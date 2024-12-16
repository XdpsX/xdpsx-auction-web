package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.dto.transaction.UpdateTransactionDto;
import com.xdpsx.auction.model.enums.TransactionType;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request);
    TransactionResponse updateTransaction(Long transactionId, UpdateTransactionDto request);
    PageResponse<TransactionResponse> getUserTransactions(Long userId, int pageNum, int pageSize, String sort, TransactionType type);
}
