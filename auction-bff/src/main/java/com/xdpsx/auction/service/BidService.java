package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.bid.*;
import com.xdpsx.auction.model.enums.BidStatus;

public interface BidService {
    BidResponseHistory placeBid(Long auctionId, BidRequest bidRequest);
    BidResponse getMyBidInAuction(Long auctionId);
    BidResponse refundBid(Long id);
    PageResponse<BidAuctionDto> getUserBids(Long userId, int pageNum, int pageSize, String sort, BidStatus status);
    BidAuctionDto getUserWonBidDetails(Long bidId, Long userId);
    PageResponse<BidHistory> getAuctionBidHistories(Long auctionId, int pageNum, int pageSize);
}
