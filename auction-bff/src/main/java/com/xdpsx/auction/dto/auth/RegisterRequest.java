package com.xdpsx.auction.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    @Size(max=64)
    private String name;

    @Email
    @NotBlank
    @Size(max=64)
    private String email;

    @NotBlank
    @Size(min=8, max = 255)
    private String password;
}
