package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.BidConstants;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.bid.BidRequest;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.dto.transaction.UpdateTransactionDto;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.*;
import com.xdpsx.auction.model.enums.AuctionType;
import com.xdpsx.auction.model.enums.BidStatus;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.BidService;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
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
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public BidResponse getMyBidInAuction(Long auctionId){
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Auction auction = auctionRepository.findLiveAuction(auctionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, auctionId));
        if (auction.getAuctionType().equals(AuctionType.ENGLISH)) {
            List<Bid> activeBids = bidRepository.findBidsWithStatusAndAuctionAndUser(auctionId, userDetails.getId(), BidStatus.ACTIVE);
            if (!activeBids.isEmpty()){
                return mapToBidResponse(activeBids.get(0));
            }
        } else {
            Bid bid = bidRepository.findByBidderIdAndAuctionId(userDetails.getId(), auction.getId())
                    .orElse(null);
            if (bid != null) {
                return mapToBidResponse(bid);
            }
        }
        return null;
    }

    @Override
    @Transactional
    public void refundBid(Long id) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.BID_NOT_FOUND, id));
        if (!Objects.equals(bid.getBidder().getId(), userDetails.getId())){
            throw new NotFoundException(ErrorCode.BID_NOT_FOUND, id);
        }
        Bid highestBid = bidRepository.findHighestBidByAuctionId(bid.getAuction().getId())
                        .orElse(null);
        if (highestBid != null && Objects.equals(highestBid.getId(), bid.getId())) {
            throw new BadRequestException(ErrorCode.CAN_NOT_REFUND);
        }
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

        if (auction.getAuctionType().equals(AuctionType.ENGLISH)) {
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

        return mapToBidResponse(savedBid);
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

        return mapToBidResponse(savedBid);
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

    private BidResponse mapToBidResponse(Bid bid) {
        return BidResponse.builder()
                .id(bid.getId())
                .amount(bid.getAmount())
                .bidderId(bid.getBidder().getId())
                .auctionId(bid.getAuction().getId())
                .build();
    }

}
