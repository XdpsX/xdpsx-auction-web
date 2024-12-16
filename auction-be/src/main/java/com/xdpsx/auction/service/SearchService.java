package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.AuctionResponse;
import com.xdpsx.auction.dto.auction.AuctionTime;
import com.xdpsx.auction.model.enums.AuctionType;

import java.math.BigDecimal;

public interface SearchService {
    PageResponse<AuctionResponse> searchAuctions(String keyword, Integer categoryId, BigDecimal minPrice,
                                                 BigDecimal maxPrice, int page, int size,
                                                 AuctionType type, AuctionTime time, String sort);
}
