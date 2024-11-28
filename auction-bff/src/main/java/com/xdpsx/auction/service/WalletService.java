package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.wallet.WalletDto;

import java.math.BigDecimal;

public interface WalletService {
    WalletDto getWalletByOwnerId(Long ownerId);
    void validateWalletBalance(Long userId, BigDecimal checkBalance);
}
