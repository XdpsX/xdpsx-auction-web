package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.WalletMapper;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.repository.WalletRepository;
import com.xdpsx.auction.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
    private final WalletMapper walletMapper;
    private final WalletRepository walletRepository;

    @Override
    public WalletDto getWalletByOwnerId(Long ownerId) {
        Wallet wallet = walletRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, ownerId));
        return walletMapper.toWalletDto(wallet);
    }
}
