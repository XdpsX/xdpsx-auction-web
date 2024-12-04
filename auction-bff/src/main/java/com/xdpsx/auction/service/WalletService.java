package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.wallet.CreateWithdrawRequest;
import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;

import java.math.BigDecimal;
import java.util.List;

public interface WalletService {
    WalletDto getWalletByOwnerId(Long ownerId);
    void validateWalletBalance(Long userId, BigDecimal checkBalance);
    WithdrawRequestDto createWithdrawRequest(Long userId, CreateWithdrawRequest request);
    PageResponse<WithdrawRequestDto> getUserWithdrawRequests(Long userId, int pageNum, int pageSize, String sort, Integer status);
    void cancelWithdraw(Long userId, Long withdrawId);
    PageResponse<WithdrawRequestDto> getAllWithdrawRequests(int pageNum, int pageSize, String sort, List<Integer> statuses);
}
