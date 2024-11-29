package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.BidConstants;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.bid.BidAuctionDto;
import com.xdpsx.auction.dto.bid.BidRequest;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.dto.transaction.UpdateTransactionDto;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.BidMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.*;
import com.xdpsx.auction.model.enums.BidStatus;
import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.repository.OrderRepository;
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
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {
    private final UserContext userContext;
    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final OrderRepository orderRepository;
    private final WalletService walletService;
    private final TransactionService transactionService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

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
                .type(TransactionType.REFUND)
                .description("Refund for bid in auction: " + bid.getAuction().getName())
                .status(TransactionStatus.COMPLETED)
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
    public BidResponse placeBid(Long auctionId, BidRequest bidRequest) {
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

    private BidResponse placeBidForEnglishAuction(Auction auction, BidRequest bidRequest, Long userId) {
        validateEnglishBidAmount(auction.getId(), bidRequest.getAmount(), auction.getStartingPrice(), auction.getStepPrice());

        List<Bid> activeBids = bidRepository.findBidsWithStatusAndAuctionAndUser(auction.getId(), userId, BidStatus.ACTIVE);
        BidResponse bidResponse;
        if (activeBids.isEmpty()) { // create new bid
            bidResponse = createNewBid(auction, bidRequest, userId);
        } else {
            Bid existingBid = activeBids.get(0);
            bidResponse = updateBid(bidRequest, existingBid, userId);
        }
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId(), bidResponse);
        return bidResponse;
    }

    private BidResponse placeBidForSealedAuction(Auction auction, BidRequest bidRequest, Long userId) {
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

    private BidResponse createNewBid(Auction auction, BidRequest bidRequest, Long userId) {
        BigDecimal securityFee = bidRequest.getAmount().multiply(BidConstants.SECURITY_FEE_RATE);
        walletService.validateWalletBalance(userId, securityFee);

        TransactionRequest transactionRequest = TransactionRequest.builder()
                .amount(securityFee)
                .type(TransactionType.SECURITY_FEE)
                .description("Security Fee for auction: " + auction.getName())
                .status(TransactionStatus.COMPLETED)
                .userId(userId)
                .build();
        TransactionResponse transactionResponse = transactionService.createTransaction(transactionRequest);

        Bid bid = Bid.builder()
                .amount(bidRequest.getAmount())
                .bidder(new User(userId))
                .auction(auction)
                .status(BidStatus.ACTIVE)
                .transaction(new Transaction(transactionResponse.getId()))
                .build();
        Bid savedBid = bidRepository.save(bid);

        return BidMapper.INSTANCE.toResponse(savedBid);
    }

    private BidResponse updateBid(BidRequest bidRequest, Bid existingBid, Long userId) {
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

        return BidMapper.INSTANCE.toResponse(savedBid);
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
    @Transactional
    public BidResponse payBid(Long id) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Bid bid = bidRepository.findByIdAndBidderAndStatus(id, userDetails.getId(), BidStatus.WON)
                .orElseThrow(() -> new NotFoundException(ErrorCode.BID_NOT_FOUND, id));

        BigDecimal amount = bid.getAmount().subtract(bid.getTransaction().getAmount());
        walletService.validateWalletBalance(userDetails.getId(), amount);

        handlePayForBidder(amount, userDetails.getId(), bid.getAuction().getName());
        handlePayForSeller(bid.getAuction().getSeller().getId(), bid.getAuction().getName());

        bid.setStatus(BidStatus.PAID);
        Bid savedBid = bidRepository.save(bid);

        Order order = Order.builder()
                .trackNumber(UUID.randomUUID().toString())
                .auctionName(bid.getAuction().getName())
                .auctionImage(bid.getAuction().getMainMedia())
                .totalAmount(bid.getAmount())
                .shippingAddress(userDetails.getAddress())
                .status(OrderStatus.Pending)
                .user(new User(userDetails.getId()))
                .seller(bid.getAuction().getSeller())
                .auction(bid.getAuction())
                .build();
        orderRepository.save(order);
        return BidMapper.INSTANCE.toResponse(savedBid);
    }

    private void handlePayForBidder(BigDecimal amount, Long bidderId, String auctionName) {
        TransactionRequest transactionBidder = TransactionRequest.builder()
                .amount(amount)
                .type(TransactionType.BID_PAID)
                .status(TransactionStatus.COMPLETED)
                .description("Paid for auction: " + auctionName)
                .userId(bidderId)
                .build();
        transactionService.createTransaction(transactionBidder);

        NotificationRequest bidderNotification = NotificationRequest.builder()
                .title("Paid Bid")
                .message("You have paid for auction: " + auctionName)
                .userId(bidderId)
                .build();
        notificationService.pushNotification(bidderNotification);
    }

    private void handlePayForSeller(Long sellerId, String auctionName) {
        NotificationRequest sellerNotification = NotificationRequest.builder()
                .title("Sold Bid")
                .message("Your auction %s has been sold".formatted(auctionName))
                .userId(sellerId)
                .build();
        notificationService.pushNotification(sellerNotification);
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
