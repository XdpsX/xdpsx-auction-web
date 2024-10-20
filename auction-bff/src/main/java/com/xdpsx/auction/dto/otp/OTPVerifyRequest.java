package com.xdpsx.auction.dto.otp;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OTPVerifyRequest {
    @Email
    @NotBlank
    @Size(max=64)
    private String email;

    @NotBlank
    private String otp;
}
