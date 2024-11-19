package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;

public interface TransactionService {
    InitPaymentResponse deposit(TransactionRequest request);
    TransactionResponse depositCallback(Long transactionId, String responseCode);
}
