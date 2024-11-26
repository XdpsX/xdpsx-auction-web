package com.xdpsx.auction.dto.bid;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record BidResponse (
        Long id,
        BigDecimal amount,
        Long auctionId,
        Long bidderId
) {
}
