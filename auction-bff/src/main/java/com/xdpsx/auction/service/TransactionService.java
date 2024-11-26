package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.dto.transaction.UpdateTransactionDto;

public interface TransactionService {
    TransactionResponse deposit(String transactionId, String responseCode);
    TransactionResponse createTransaction(TransactionRequest request);
    TransactionResponse updateTransaction(Long transactionId, UpdateTransactionDto request);
}
