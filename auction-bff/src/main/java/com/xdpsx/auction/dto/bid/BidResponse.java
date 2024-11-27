package com.xdpsx.auction.dto.bid;

import com.xdpsx.auction.model.enums.BidStatus;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record BidResponse (
        Long id,
        BigDecimal amount,
        Long auctionId,
        Long bidderId,
        BidStatus status
) {
}
