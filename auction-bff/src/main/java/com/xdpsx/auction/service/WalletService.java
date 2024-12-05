package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.wallet.CreateWithdrawRequest;
import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;

import java.math.BigDecimal;

public interface WalletService {
    WalletDto getWalletByOwnerId(Long ownerId);
    void validateWalletBalance(Long userId, BigDecimal checkBalance);
    WithdrawRequestDto createWithdrawRequest(Long userId, CreateWithdrawRequest request);
}
