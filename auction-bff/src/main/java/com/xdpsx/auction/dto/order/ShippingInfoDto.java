package com.xdpsx.auction.dto.order;

public record ShippingInfoDto (
        String recipient,
        String mobileNumber,
        String shippingAddress
) {
}
