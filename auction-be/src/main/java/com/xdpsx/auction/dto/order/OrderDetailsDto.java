package com.xdpsx.auction.dto.order;

import com.xdpsx.auction.dto.auction.AuctionInfoDto;
import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.model.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record OrderDetailsDto (
        Long id,
        String trackNumber,
        BigDecimal totalAmount,
        OrderStatus status,
        PaymentMethod paymentMethod,
        String note,
        String reason,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt,
        AuctionInfoDto auction,
        ShippingInfoDto shippingInfo,
        SellerInfo seller
) {
}
