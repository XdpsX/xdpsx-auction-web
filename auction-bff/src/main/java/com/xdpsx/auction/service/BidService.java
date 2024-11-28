package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.bid.BidAuctionDto;
import com.xdpsx.auction.dto.bid.BidRequest;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.model.enums.BidStatus;

public interface BidService {
    BidResponse placeBid(Long auctionId, BidRequest bidRequest);
    BidResponse getMyBidInAuction(Long auctionId);
    BidResponse refundBid(Long id);
    PageResponse<BidAuctionDto> getUserBids(Long userId, int pageNum, int pageSize, String sort, BidStatus status);
    BidResponse payBid(Long id);
}
