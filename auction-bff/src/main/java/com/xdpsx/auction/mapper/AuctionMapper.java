package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.auction.*;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.AuctionImage;
import com.xdpsx.auction.model.Bid;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface AuctionMapper {
    AuctionMapper INSTANCE = Mappers.getMapper(AuctionMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "mainImage", ignore = true)
    @Mapping(target = "trashed", ignore = true)
    @Mapping(target = "bids", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "published", ignore = true)
    Auction toEntity(AuctionRequest dto);

    @Mapping(target = "mainImage", source = "entity.mainImage")
    @Mapping(target = "category", source = "entity.category.name")
    AuctionDto toDto(Auction entity);

    @Mapping(target = "mainImage", source = "entity.mainImage")
    @Mapping(target = "seller", source = "entity.seller.sellerDetails")
    AuctionResponse toResponse(Auction entity);

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "images", source = "entity.images")
    @Mapping(target = "category", source = "entity.category.name")
    @Mapping(target = "seller", source = "entity.seller.sellerDetails")
    @Mapping(target = "highestBid", source = "highestBid")
    AuctionDetails toAuctionDetails(Auction entity, Bid highestBid);

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "category", source = "entity.category.name")
    @Mapping(target = "seller", source = "entity.seller.sellerDetails")
    AuctionSellerInfo toAuctionSellerInfo(Auction entity);

    default List<String> mapImages(List<AuctionImage> auctionImages) {
        return auctionImages.stream()
                .map(AuctionImage::getUrl)
                .collect(Collectors.toList());
    }

    default BidResponse mapBidToResponse(Bid bid) {
        if (bid == null) {
            return null;
        }
        return BidResponse.builder()
                .id(bid.getId())
                .amount(bid.getAmount())
                .bidderId(bid.getBidder().getId())
                .auctionId(bid.getAuction().getId())
                .build();
    }
}
