package com.xdpsx.auction.dto.order;

import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record OrderSellerDto(
        Long id,
        String trackNumber,
        String auctionName,
        String auctionImageUrl,
        BigDecimal totalAmount,
        String shippingAddress,
        OrderStatus status,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt,
        SellerInfo seller
) {
}
