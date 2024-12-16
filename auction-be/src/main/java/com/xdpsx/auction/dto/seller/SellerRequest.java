package com.xdpsx.auction.dto.seller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SellerRequest {
    @NotBlank
    @Size(max=64)
    private String name;

    @Size(max=255)
    @NotBlank
    private String address;

    @Size(max=15)
    @NotBlank
    private String mobileNumber;

    private Long imageId;
}
