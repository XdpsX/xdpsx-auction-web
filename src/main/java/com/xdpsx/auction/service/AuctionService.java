package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.auction.AuctionCreateDto;
import com.xdpsx.auction.dto.auction.AuctionDto;

public interface AuctionService {
    AuctionDto createAuction(AuctionCreateDto request);
}
