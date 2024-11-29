package com.xdpsx.auction.dto.seller;

import com.xdpsx.auction.model.enums.SellerRegisterStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class SellerResponse {
    private Long id;
    private String name;
    private String address;
    private String mobilePhone;
    private String avatarUrl;
    private SellerRegisterStatus status;
}
