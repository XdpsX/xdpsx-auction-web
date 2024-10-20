package com.xdpsx.auction.dto.auth;

import com.xdpsx.auction.dto.otp.OTPVerifyRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    @Size(max=64)
    private String name;

    @NotBlank
    @Size(min=8, max = 255)
    private String password;

    @NotNull
    private OTPVerifyRequest verify;
}
