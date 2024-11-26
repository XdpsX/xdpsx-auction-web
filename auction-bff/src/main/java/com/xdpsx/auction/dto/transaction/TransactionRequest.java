package com.xdpsx.auction.dto.transaction;

import com.xdpsx.auction.model.enums.TransactionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
public class TransactionRequest {
    private BigDecimal amount;
    private TransactionType type;
    private String description;
}
