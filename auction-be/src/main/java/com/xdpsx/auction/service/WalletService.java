package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.dto.transaction.DepositRequest;
import com.xdpsx.auction.dto.wallet.CreateWithdrawRequest;
import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;

import java.math.BigDecimal;

public interface WalletService {
    InitPaymentResponse createDepositLink(DepositRequest request);
    WalletDto getWalletByOwnerId(Long ownerId);
    void validateWalletBalance(Long userId, BigDecimal checkBalance);
    void deposit(String transactionId);
    WithdrawRequestDto createWithdrawRequest(Long userId, CreateWithdrawRequest request);
}
