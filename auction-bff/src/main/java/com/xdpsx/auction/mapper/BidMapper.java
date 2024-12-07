package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.bid.BidAuctionDto;
import com.xdpsx.auction.dto.bid.BidHistory;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.model.Bid;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface BidMapper {
    BidMapper INSTANCE = Mappers.getMapper(BidMapper.class);

    @Mapping(target = "auctionId", source = "entity.auction.id")
    @Mapping(target = "bidderId", source = "entity.bidder.id")
    BidResponse toResponse(Bid entity);

    @Mapping(target = "auction", source = "entity.auction")
    @Mapping(target = "canRefund", ignore = true)
    BidAuctionDto toBidAuctionDto(Bid entity);

    @Mapping(target = "bidder", source = "entity.bidder")
    BidHistory toBidHistory(Bid entity);
}
