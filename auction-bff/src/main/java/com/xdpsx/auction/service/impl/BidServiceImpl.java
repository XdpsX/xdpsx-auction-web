package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.BidConstants;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.bid.*;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.dto.transaction.UpdateTransactionDto;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.BidMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.*;
import com.xdpsx.auction.model.enums.*;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.BidService;
import com.xdpsx.auction.service.NotificationService;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {
    private final UserContext userContext;
    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final WalletService walletService;
    private final TransactionService transactionService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    @Override
    public BidResponse getMyBidInAuction(Long auctionId){
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Auction auction = auctionRepository.findLiveAuction(auctionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, auctionId));
        if (auction.isEnglishAuction()) {
            List<Bid> activeBids = bidRepository.findBidsWithStatusAndAuctionAndUser(auctionId, userDetails.getId(), BidStatus.ACTIVE);
            if (!activeBids.isEmpty()){
                return BidMapper.INSTANCE.toResponse(activeBids.get(0));
            }
        } else {
            Bid bid = bidRepository.findByBidderIdAndAuctionId(userDetails.getId(), auction.getId())
                    .orElse(null);
            if (bid != null) {
                return BidMapper.INSTANCE.toResponse(bid);
            }
        }
        return null;
    }

    @Override
    @Transactional
    public BidResponse refundBid(Long id) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.BID_NOT_FOUND, id));
        if (!Objects.equals(bid.getBidder().getId(), userDetails.getId()) || !bid.getStatus().equals(BidStatus.ACTIVE)){
            throw new NotFoundException(ErrorCode.BID_NOT_FOUND, id);
        }
        Auction auction = bid.getAuction();
        if (auction.isEnglishAuction()) {
            if (bidRepository.isHighestBid(bid.getId(), bid.getAuction().getId())){
                throw new BadRequestException(ErrorCode.CAN_NOT_REFUND);
            }
            updateBidToLost(userDetails, bid);
            return null;
        } else {
            Bid savedBid = updateBidToLost(userDetails, bid);

            return BidMapper.INSTANCE.toResponse(savedBid);
        }
    }

    private Bid updateBidToLost(CustomUserDetails userDetails, Bid bid) {
        bid.setStatus(BidStatus.LOST);
        Bid savedBid = bidRepository.save(bid);

        TransactionRequest transactionRequest = TransactionRequest.builder()
                .amount(savedBid.getTransaction().getAmount())
                .type(TransactionType.DEPOSIT)
                .description("Refund for bid in auction: " + bid.getAuction().getName())
                .userId(userDetails.getId())
                .build();
        transactionService.createTransaction(transactionRequest);

        NumberFormat numberFormat = NumberFormat.getInstance(Locale.getDefault());
        NotificationRequest refundNotification = NotificationRequest.builder()
                .title("Refund Bid")
                .message("You have refunded: " + numberFormat.format(bid.getTransaction().getAmount()))
                .userId(bid.getBidder().getId())
                .build();
        notificationService.pushNotification(refundNotification);

        return savedBid;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Override
    public BidResponseHistory placeBid(Long auctionId, BidRequest bidRequest) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Auction auction = auctionRepository.findLiveAuction(auctionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, auctionId));
        if (userDetails.getId().equals(auction.getSeller().getId())) {
            throw new BadRequestException(ErrorCode.AUCTION_OWNER);
        }

        if (auction.isEnglishAuction()) {
            return placeBidForEnglishAuction(auction, bidRequest, userDetails.getId());
        } else {
            return placeBidForSealedAuction(auction, bidRequest, userDetails.getId());
        }
    }

    private BidResponseHistory placeBidForEnglishAuction(Auction auction, BidRequest bidRequest, Long userId) {
        validateEnglishBidAmount(auction.getId(), bidRequest.getAmount(), auction.getStartingPrice(), auction.getStepPrice());

        List<Bid> activeBids = bidRepository.findBidsWithStatusAndAuctionAndUser(auction.getId(), userId, BidStatus.ACTIVE);
        BidResponseHistory bidResponse;
        if (activeBids.isEmpty()) { // create new bid
            bidResponse = createNewBid(auction, bidRequest, userId);
        } else {
            Bid existingBid = activeBids.get(0);
            bidResponse = updateBid(bidRequest, existingBid, userId);
        }
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId(), bidResponse);
        return bidResponse;
    }

    private BidResponseHistory placeBidForSealedAuction(Auction auction, BidRequest bidRequest, Long userId) {
        if (bidRequest.getAmount().compareTo(auction.getStartingPrice()) >= 0) {
            throw new BadRequestException(ErrorCode.BID_HIGHER);
        }
        Bid existingBid = bidRepository.findByBidderIdAndAuctionId(userId, auction.getId())
                .orElse(null);
        if (existingBid != null) {
            throw new BadRequestException(ErrorCode.BID_DUPLICATED);
        }
        return createNewBid(auction, bidRequest, userId);
    }

    private BidResponseHistory createNewBid(Auction auction, BidRequest bidRequest, Long userId) {
        BigDecimal securityFee = bidRequest.getAmount().multiply(BidConstants.SECURITY_FEE_RATE);
        walletService.validateWalletBalance(userId, securityFee);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, userId));

        TransactionRequest transactionRequest = TransactionRequest.builder()
                .amount(securityFee)
                .type(TransactionType.WITHDRAW)
                .description("Security Fee for auction: " + auction.getName())
                .userId(userId)
                .build();
        TransactionResponse transactionResponse = transactionService.createTransaction(transactionRequest);

        Bid bid = Bid.builder()
                .amount(bidRequest.getAmount())
                .bidder(user)
                .auction(auction)
                .status(BidStatus.ACTIVE)
                .transaction(new Transaction(transactionResponse.getId()))
                .build();
        Bid savedBid = bidRepository.save(bid);

        return BidMapper.INSTANCE.toBidResponseHistory(savedBid);
    }

    private BidResponseHistory updateBid(BidRequest bidRequest, Bid existingBid, Long userId) {
        BigDecimal newSecurityFee = bidRequest.getAmount().multiply(BidConstants.SECURITY_FEE_RATE);

        BigDecimal oldSecurityFee = existingBid.getAmount().multiply(BidConstants.SECURITY_FEE_RATE);
        BigDecimal diffSecurityFee = newSecurityFee.subtract(oldSecurityFee);

        walletService.validateWalletBalance(userId, diffSecurityFee);

        Transaction existingTransaction = existingBid.getTransaction();
        UpdateTransactionDto transactionRequest = UpdateTransactionDto.builder()
                .amount(newSecurityFee)
                .description(existingTransaction.getDescription())
                .build();
        transactionService.updateTransaction(existingTransaction.getId(), transactionRequest);

        existingBid.setAmount(bidRequest.getAmount());
        Bid savedBid = bidRepository.save(existingBid);

        return BidMapper.INSTANCE.toBidResponseHistory(savedBid);
    }

    private void validateEnglishBidAmount(Long auctionId, BigDecimal amount, BigDecimal startingAmount, BigDecimal stepAmount) {
        Bid highestBid = bidRepository.findHighestBidByAuctionId(auctionId).orElse(null);
        if (highestBid != null) {
            if (highestBid.getAmount().add(stepAmount).compareTo(amount) > 0) {
                throw new BadRequestException(ErrorCode.BID_LOWER);
            }
        } else {
            if (startingAmount.add(stepAmount).compareTo(amount) > 0) {
                throw new BadRequestException(ErrorCode.BID_LOWER);
            }
        }
    }

    @Override
    public PageResponse<BidAuctionDto> getUserBids(Long userId, int pageNum, int pageSize, String sort, BidStatus status) {
        Page<Bid> bidPage = bidRepository.findUserBids(
                userId, status, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(bidPage, this::mapToBidAuctionDto);
    }

    @Override
    public BidAuctionDto getUserWonBidDetails(Long bidId, Long userId) {
        Bid bid = bidRepository.findByIdAndBidderAndStatus(bidId, userId, BidStatus.WON)
                .orElseThrow(() -> new NotFoundException(ErrorCode.BID_NOT_FOUND, bidId));
        return BidMapper.INSTANCE.toBidAuctionDto(bid);
    }

    @Override
    public PageResponse<BidHistory> getAuctionBidHistories(Long auctionId, int pageNum, int pageSize) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, auctionId));
        if (auction.isSealedBidAuction()) {
            throw new BadRequestException("Can not get bid histories of Sealed bid auction");
        }
        Page<Bid> bidPage = bidRepository.findByAuctionId(auctionId, PageRequest.of(pageNum - 1, pageSize, Sort.by("amount").descending()));
        return PageMapper.toPageResponse(bidPage, BidMapper.INSTANCE::toBidHistory);
    }


    private BidAuctionDto mapToBidAuctionDto(Bid bid){
        BidAuctionDto dto = BidMapper.INSTANCE.toBidAuctionDto(bid);
        if (bid.getStatus().equals(BidStatus.ACTIVE)) {
            dto.setCanRefund(true);
            if (bid.getAuction().isEnglishAuction() &&
                bidRepository.isHighestBid(bid.getId(), bid.getAuction().getId())){
                dto.setCanRefund(false);
            }
        }
        return dto;
    }

    private Sort getSort(String sortParam) {
        if (sortParam == null) {
            return Sort.by("updatedAt").descending();
        }

        return switch (sortParam) {
            case "amount" -> Sort.by("amount").ascending();
            case "-amount" -> Sort.by("amount").descending();
            case "date" -> Sort.by("updatedAt").ascending();
            default -> Sort.by("updatedAt").descending();
        };
    }

}
