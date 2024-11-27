package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.bid.BidRequest;
import com.xdpsx.auction.dto.bid.BidResponse;

public interface BidService {
    BidResponse placeBid(Long auctionId, BidRequest bidRequest);
    BidResponse getMyBidInAuction(Long auctionId);
    BidResponse refundBid(Long id);
}
