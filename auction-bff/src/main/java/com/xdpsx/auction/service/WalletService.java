package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.wallet.WalletDto;

public interface WalletService {
    WalletDto getWalletByOwnerId(Long ownerId);
}
