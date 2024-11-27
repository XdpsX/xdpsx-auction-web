package com.xdpsx.auction.dto.bid;

import com.xdpsx.auction.dto.auction.AuctionInfoDto;
import com.xdpsx.auction.model.enums.BidStatus;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record BidAuctionDto (
        Long id,
        BigDecimal amount,
        BidStatus status,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt,
        AuctionInfoDto auction
) {
}
