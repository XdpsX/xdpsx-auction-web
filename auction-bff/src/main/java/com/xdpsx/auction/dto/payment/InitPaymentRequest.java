package com.xdpsx.auction.dto.payment;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data @Builder
public class InitPaymentRequest {
    private String requestId;

    private String ipAddress;

    private String txnRef;

    private BigDecimal amount;

    private String prefixReturn;
}
