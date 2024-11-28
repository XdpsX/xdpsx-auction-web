package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.dto.transaction.DepositRequest;

import java.util.Map;

public interface PaymentService {
    InitPaymentResponse createPayment(DepositRequest request);
    boolean verifyIpn(Map<String, String> params);
}
