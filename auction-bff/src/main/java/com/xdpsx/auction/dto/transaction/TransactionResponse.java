package com.xdpsx.auction.dto.transaction;

import com.xdpsx.auction.model.enums.PaymentMethod;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data @Builder
public class TransactionResponse {
    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private TransactionStatus status;
    private PaymentMethod paymentMethod;
    private String description;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
