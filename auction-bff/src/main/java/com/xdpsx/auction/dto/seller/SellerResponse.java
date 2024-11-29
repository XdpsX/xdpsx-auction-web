package com.xdpsx.auction.dto.seller;

import com.xdpsx.auction.dto.user.UserInfo;
import com.xdpsx.auction.model.enums.SellerRegisterStatus;

import java.time.ZonedDateTime;

public record SellerResponse(
        Long id,
        String name,
        String address,
        String mobilePhone,
        String avatarUrl,
        SellerRegisterStatus status,
        ZonedDateTime createdAt,
        UserInfo user
) {}
