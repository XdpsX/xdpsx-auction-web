package com.xdpsx.auction.dto.seller;

import com.xdpsx.auction.model.enums.SellerRegisterStatus;

public record SellerInfo (
      Long id,
      String name,
      String address,
      String mobilePhone,
      String avatarUrl,
      SellerRegisterStatus status
) {
}
