package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.auction.AuctionDetails;
import com.xdpsx.auction.dto.auction.AuctionRequest;
import com.xdpsx.auction.dto.auction.AuctionDto;
import com.xdpsx.auction.dto.auction.AuctionResponse;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.AuctionImage;
import com.xdpsx.auction.model.Bid;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

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

    @Mapping(target = "mainImage", source = "entity.mainImage")
    @Mapping(target = "seller", source = "entity.seller")
    AuctionResponse fromEntityToResponse(Auction entity);

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "images", source = "entity.images")
    @Mapping(target = "category", source = "entity.category.name")
    @Mapping(target = "seller", source = "entity.seller")
    @Mapping(target = "highestBid", source = "highestBid")
    AuctionDetails toAuctionDetails(Auction entity, Bid highestBid);

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
                .bidTime(bid.getBidTime())
                .bidderId(bid.getBidder().getId())
                .auctionId(bid.getAuction().getId())
                .build();
    }
}
