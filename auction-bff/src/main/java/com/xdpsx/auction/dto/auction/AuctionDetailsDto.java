package com.xdpsx.auction.dto.auction;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.xdpsx.auction.dto.media.MediaResponse;
import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.model.enums.AuctionStatus;
import com.xdpsx.auction.model.enums.AuctionType;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

public record AuctionDetailsDto(
        Long id,
        String name,
        String description,
        BigDecimal startingPrice,
        BigDecimal stepPrice,
        ZonedDateTime startingTime,
        ZonedDateTime endingTime,
        AuctionType type,
        AuctionStatus status,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        Boolean trashed,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        Boolean published,
        MediaResponse mainImage,
        List<MediaResponse> images,
        String category,
        SellerInfo seller
) {
}
