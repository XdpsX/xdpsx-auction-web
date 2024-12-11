package com.xdpsx.auction.dto.report;

import com.xdpsx.auction.model.enums.AuctionType;

public record AuctionTypeCount(
        AuctionType type,
        long count
) {
}
