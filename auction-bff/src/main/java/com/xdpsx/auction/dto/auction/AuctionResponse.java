package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.dto.user.UserInfo;
import com.xdpsx.auction.model.enums.AuctionType;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record AuctionResponse (
        Long id,
        String name,
        BigDecimal startingPrice,
        ZonedDateTime startingTime,
        ZonedDateTime endingTime,
        AuctionType auctionType,
        String mainImage,
        String category,
        UserInfo seller
) {
}
