package com.xdpsx.auction.dto.order;

import com.xdpsx.auction.dto.auction.AuctionInfoDto;
import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record OrderSellerDto(
        Long id,
        String trackNumber,
        BigDecimal totalAmount,
        OrderStatus status,
        ZonedDateTime updatedAt,
        AuctionInfoDto auction,
        SellerInfo seller
) {
}
