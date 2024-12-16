package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.model.enums.AuctionType;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record AuctionDto(
    Long id,
    String name,
    BigDecimal startingPrice,
    ZonedDateTime startingTime,
    ZonedDateTime endingTime,
    AuctionType type,
    String mainImage,
    String category
) {
}
