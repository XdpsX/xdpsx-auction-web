package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.model.enums.AuctionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AuctionDto(
    Long id,
    String name,
    BigDecimal startingPrice,
    LocalDate startingTime,
    LocalDate endingTime,
    AuctionType auctionType,
    String mainImage,
    String category
) {
}
