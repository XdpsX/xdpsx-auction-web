package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.dto.bid.BidResponse;

public record AuctionDetailsGet(
        AuctionDetailsDto auctionContent,
        BidResponse highestBid
) {
}
