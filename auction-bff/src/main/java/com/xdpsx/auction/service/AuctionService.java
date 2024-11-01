package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.AuctionRequest;
import com.xdpsx.auction.dto.auction.AuctionDto;

public interface AuctionService {
    PageResponse<AuctionDto> getAllPageAuctions(int pageNum, int pageSize, String keyword, String sort,
                                                Boolean published);
    PageResponse<AuctionDto> getCurrentUserAuctions(int pageNum, int pageSize,
                                                    String keyword, String sort, Boolean published);
    AuctionDto createAuction(AuctionRequest request);

}
