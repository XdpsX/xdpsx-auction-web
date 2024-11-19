package com.xdpsx.auction.dto.payment;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class InitPaymentResponse {
    private String paymentUrl;
}
