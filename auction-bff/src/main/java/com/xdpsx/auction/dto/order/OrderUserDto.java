package com.xdpsx.auction.dto.order;

import com.xdpsx.auction.dto.user.UserResponse;
import com.xdpsx.auction.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record OrderUserDto(
        Long id,
        String trackNumber,
        String auctionName,
        String auctionImageUrl,
        BigDecimal totalAmount,
        String shippingAddress,
        OrderStatus status,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt,
        UserResponse user
) {
}
