package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.payment.InitPaymentRequest;
import com.xdpsx.auction.dto.payment.InitPaymentResponse;

import java.util.Map;

public interface PaymentService {
    InitPaymentResponse init(InitPaymentRequest request);
    boolean verifyIpn(Map<String, String> params);
}
