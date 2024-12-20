package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.model.enums.AuctionType;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

public record AuctionDetails (
        Long id,
        String name,
        String description,
        BigDecimal startingPrice,
        BigDecimal stepPrice,
        ZonedDateTime startingTime,
        ZonedDateTime endingTime,
        AuctionType type,
        String mainImage,
        List<String> images,
        String category,
        SellerInfo seller,
        BidResponse highestBid
) {
}
