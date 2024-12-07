package com.xdpsx.auction.dto.bid;

import com.xdpsx.auction.dto.user.UserBidder;
import com.xdpsx.auction.model.enums.BidStatus;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record BidResponseHistory (
        Long id,
        BigDecimal amount,
        Long auctionId,
        Long bidderId,
        BidStatus status,
        UserBidder bidder,
        ZonedDateTime updatedAt
) {
}
