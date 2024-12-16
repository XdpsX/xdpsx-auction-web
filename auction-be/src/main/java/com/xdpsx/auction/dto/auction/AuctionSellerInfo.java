package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.model.enums.AuctionType;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record AuctionSellerInfo (
        Long id,
        String name,
        BigDecimal startingPrice,
        ZonedDateTime startingTime,
        ZonedDateTime endingTime,
        boolean published,
        AuctionType type,
        String mainImage,
        SellerInfo seller,
        String category
) {
}
