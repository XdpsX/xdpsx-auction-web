package com.xdpsx.auction.dto.otp;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MailOTPRequest {
    @Email
    @NotBlank
    @Size(max=64)
    private String email;

}
