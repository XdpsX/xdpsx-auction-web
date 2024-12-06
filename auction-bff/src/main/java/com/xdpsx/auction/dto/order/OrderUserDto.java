package com.xdpsx.auction.dto.order;

import com.xdpsx.auction.dto.auction.AuctionInfoDto;
import com.xdpsx.auction.dto.user.UserResponse;
import com.xdpsx.auction.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record OrderUserDto(
        Long id,
        String trackNumber,
        BigDecimal totalAmount,
        OrderStatus status,
        ZonedDateTime updatedAt,
        AuctionInfoDto auction,
        UserResponse user
) {
}