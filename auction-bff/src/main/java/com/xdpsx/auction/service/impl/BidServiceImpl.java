package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.BidConstants;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.bid.BidRequest;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.*;
import com.xdpsx.auction.model.enums.BidPaymentStatus;
import com.xdpsx.auction.model.enums.BidStatus;
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

    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Override
    public BidResponse placeBid(Long auctionId, BidRequest bidRequest) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Auction auction = auctionRepository.findLiveAuction(auctionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, auctionId));
        if (userDetails.getId().equals(auction.getSeller().getId())) {
            throw new BadRequestException(ErrorCode.AUCTION_OWNER);
        }


        List<Bid> activeBids = bidRepository.findBidsWithStatusAndAuctionAndUser(auction.getId(), userDetails.getId(), BidStatus.ACTIVE);
        if (!activeBids.isEmpty()) { // create new bid
            return createNewBid(auction, bidRequest, userDetails.getId());
        }
        return null;

    }

    private BidResponse createNewBid(Auction auction, BidRequest bidRequest, Long userId) {
        validateEnglishBidAmount(auction.getId(), bidRequest.getAmount(), auction.getStartingPrice(), auction.getStepPrice());

        BigDecimal securityFee = bidRequest.getAmount().multiply(BidConstants.SECURITY_FEE_RATE);
        walletService.validateWalletBalance(userId, securityFee);

        TransactionRequest transaction = TransactionRequest.builder()
                .amount(securityFee)
                .type(TransactionType.SECURITY_FEE)
                .description("Security Fee for auction: " + auction.getName())
                .build();
        transactionService.createTransaction(transaction);

        User bidder = User.builder()
                .id(userId)
                .build();
        Bid bid = Bid.builder()
                .amount(bidRequest.getAmount())
                .bidder(bidder)
                .auction(auction)
                .status(BidStatus.ACTIVE)
                .paymentStatus(BidPaymentStatus.DEPOSIT)
                .build();
        Bid savedBid = bidRepository.save(bid);
        BidResponse bidResponse = BidResponse.builder()
                .id(savedBid.getId())
                .amount(savedBid.getAmount())
                .bidTime(savedBid.getBidTime())
                .bidderId(savedBid.getBidder().getId())
                .auctionId(savedBid.getAuction().getId())
                .build();

        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId(), bidResponse);

        return bidResponse;
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

}
