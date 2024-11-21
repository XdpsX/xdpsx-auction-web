package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.bid.BidRequest;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {
    private final UserContext userContext;
    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final WalletRepository walletRepository;

    @Transactional
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
        walletRepository.save(wallet);

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
        return BidResponse.builder()
                .id(savedBid.getId())
                .amount(savedBid.getAmount())
                .bidTime(savedBid.getBidTime())
                .bidderId(savedBid.getBidder().getId())
                .auctionId(savedBid.getAuction().getId())
                .build();
    }
}
