package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.*;
import com.xdpsx.auction.model.enums.AuctionStatus;
import com.xdpsx.auction.model.enums.AuctionType;

public interface AuctionService {
    PageResponse<AuctionSellerInfo> getAllPageAuctions(int pageNum, int pageSize, String keyword, String sort,
                                                       Boolean published, AuctionType type, AuctionStatus status, AuctionTime time);
    PageResponse<AuctionSellerInfo> getAllTrashedAuctions(int pageNum, int pageSize, String keyword, String sort,
                                                          Boolean published, AuctionType type, AuctionStatus status, AuctionTime time);
    PageResponse<AuctionDto> getCurrentUserAuctions(int pageNum, int pageSize, String keyword, String sort,
                                                    AuctionType type, AuctionStatus status, AuctionTime time);
    AuctionDto createAuction(AuctionRequest request);
    PageResponse<AuctionResponse> getCategoryAuctions(Integer categoryId, int pageNum, int pageSize);
    AuctionDetails getPublishedAuction(Long id);
    AuctionDetailsGet getAuctionDetails(Long id);
    AuctionDetailsGet getSellerAuctionDetails(Long sellerId, Long auctionId);

}
