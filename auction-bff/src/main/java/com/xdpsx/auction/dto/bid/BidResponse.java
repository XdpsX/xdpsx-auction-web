package com.xdpsx.auction.dto.bid;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Builder
public record BidResponse (
        Long id,
        BigDecimal amount,
        ZonedDateTime bidTime,
        Long auctionId,
        Long bidderId
) {
}
