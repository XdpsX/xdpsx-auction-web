package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.auction.AuctionRequest;
import com.xdpsx.auction.dto.auction.AuctionDto;
import com.xdpsx.auction.model.Auction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuctionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "mainImage", ignore = true)
    @Mapping(target = "trashed", ignore = true)
    Auction fromRequestToEntity(AuctionRequest dto);

    @Mapping(target = "mainImage", source = "entity.mainImage")
    @Mapping(target = "category", source = "entity.category.name")
    AuctionDto fromEntityToDto(Auction entity);
}
