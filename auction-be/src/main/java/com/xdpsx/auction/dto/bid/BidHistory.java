package com.xdpsx.auction.dto.bid;

import com.xdpsx.auction.dto.user.UserBidder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record BidHistory(
        Long id,
        BigDecimal amount,
        UserBidder bidder,
        ZonedDateTime updatedAt
) {
}
