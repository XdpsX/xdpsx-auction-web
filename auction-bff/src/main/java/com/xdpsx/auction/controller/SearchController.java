package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.AuctionResponse;
import com.xdpsx.auction.dto.auction.AuctionTime;
import com.xdpsx.auction.model.enums.AuctionStatus;
import com.xdpsx.auction.model.enums.AuctionType;
import com.xdpsx.auction.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;
    @GetMapping("/public/auctions/search")
    public PageResponse<AuctionResponse> searchAuctions(
            @RequestParam String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) AuctionType type,
            @RequestParam(required = false) AuctionTime time,
            @RequestParam(required = false) String sort) {

        return searchService.searchAuctions(keyword, categoryId, minPrice, maxPrice, pageNum, pageSize, type, time, sort);
    }
}
