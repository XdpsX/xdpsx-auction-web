package com.xdpsx.auction.dto.transaction;

import com.xdpsx.auction.model.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionMessage {
    private BigDecimal amount;
    private TransactionType type;
    private Long walletId;
}
