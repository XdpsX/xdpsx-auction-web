package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.model.enums.AuctionType;

public record AuctionInfoDto (
        Long id,
        String name,
        String mainImage,
        AuctionType type
) {
}
