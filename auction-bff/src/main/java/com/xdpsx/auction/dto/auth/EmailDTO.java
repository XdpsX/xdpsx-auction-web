package com.xdpsx.auction.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmailDTO {
    @Email
    @NotBlank
    @Size(max=64)
    private String email;
}
