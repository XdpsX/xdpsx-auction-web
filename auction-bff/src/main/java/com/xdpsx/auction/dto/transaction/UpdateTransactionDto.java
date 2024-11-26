package com.xdpsx.auction.dto.transaction;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
public class UpdateTransactionDto {
    private BigDecimal amount;
    private String description;
}
