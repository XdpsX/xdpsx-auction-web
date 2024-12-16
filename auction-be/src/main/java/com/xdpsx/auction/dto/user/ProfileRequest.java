package com.xdpsx.auction.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProfileRequest {
    @NotBlank
    @Size(max=64)
    private String name;

    @Size(max=255)
    private String address;

    @Size(max=15)
    private String mobileNumber;

    private Long imageId;

}
