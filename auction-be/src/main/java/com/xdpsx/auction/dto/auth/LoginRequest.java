package com.xdpsx.auction.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @Email
    @NotBlank
    @Size(max=64)
    private String email;

    @NotBlank
    @Size(max = 255)
    private String password;
}
