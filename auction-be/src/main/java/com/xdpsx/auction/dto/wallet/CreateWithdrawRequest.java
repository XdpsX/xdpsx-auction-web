package com.xdpsx.auction.dto.wallet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateWithdrawRequest {
    @NotBlank
    @Size(max = 100)
    private String bankName;

    @NotBlank
    @Size(max = 50)
    private String accountNumber;

    @NotBlank
    @Size(max = 50)
    private String holderName;

    @NotNull
    private BigDecimal amount;
}
