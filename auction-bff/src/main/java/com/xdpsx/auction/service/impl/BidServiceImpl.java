package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.bid.BidRequest;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.WalletMapper;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.repository.WalletRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.BidService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {
    private final UserContext userContext;
    private final WalletMapper walletMapper;
    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final WalletRepository walletRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, String> redisTemplate;

    @PostConstruct
    public void createConsumerGroup() {
        try {
            redisTemplate.opsForStream().createGroup("refundStream", "refundGroup");
        } catch (Exception e) {
            log.info("Consumer group already exists: {}", e.getMessage());
        }
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
        Bid highestBid = bidRepository.findHighestBidByAuctionId(auction.getId()).orElse(null);
        if (highestBid != null) {
            if (
//                    highestBid.getAmount().compareTo(bidRequest.getAmount()) >= 0 &&
                    highestBid.getAmount().add(auction.getStepPrice()).compareTo(bidRequest.getAmount()) > 0) {
            throw new BadRequestException(ErrorCode.BID_LOWER);

            }
        } else {
            if (auction.getStartingPrice().add(auction.getStepPrice()).compareTo(bidRequest.getAmount()) > 0) {
                throw new BadRequestException(ErrorCode.BID_LOWER);
            }
        }
        Wallet wallet = walletRepository.findByOwnerId(userDetails.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, userDetails.getId()));
        BigDecimal securityDeposit = bidRequest.getAmount().multiply(BigDecimal.valueOf(0.10));
        if (securityDeposit.compareTo(wallet.getBalance()) > 0){
            throw new BadRequestException(ErrorCode.WALLET_NOT_ENOUGH);
        }
        BigDecimal newBalance = wallet.getBalance().subtract(securityDeposit);
        wallet.setBalance(newBalance);
        Wallet savedWallet = walletRepository.save(wallet);

        User bidder = User.builder()
                .id(userDetails.getId())
                .build();
        Bid bid = Bid.builder()
                .amount(bidRequest.getAmount())
                .bidder(bidder)
                .auction(auction)
                .isWinner(false)
                .build();
        Bid savedBid = bidRepository.save(bid);
        BidResponse bidResponse = BidResponse.builder()
                .id(savedBid.getId())
                .amount(savedBid.getAmount())
                .bidTime(savedBid.getBidTime())
                .bidderId(savedBid.getBidder().getId())
                .auctionId(savedBid.getAuction().getId())
                .build();

        messagingTemplate.convertAndSend("/topic/wallet/" + savedWallet.getId(), walletMapper.toWalletDto(savedWallet));
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId(), bidResponse);
        if (highestBid != null) {
            publishRefundBid(highestBid.getId());
        }
        return bidResponse;
    }

    public void publishRefundBid(Long bidId) {
        Map<String, String> message = new HashMap<>();
        message.put("bidId", String.valueOf(bidId));
        redisTemplate.opsForStream().add("refundStream", message);
    }
}
