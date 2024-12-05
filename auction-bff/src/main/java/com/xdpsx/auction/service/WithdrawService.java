package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.wallet.UpdateWithdrawStatus;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;
import com.xdpsx.auction.model.enums.WithdrawStatus;

import java.util.List;

public interface WithdrawService {
    PageResponse<WithdrawRequestDto> getUserWithdrawRequests(Long userId, int pageNum, int pageSize, String sort, Integer status);
    PageResponse<WithdrawRequestDto> getAllWithdrawRequests(int pageNum, int pageSize, String sort, List<WithdrawStatus> statuses);
    void cancelWithdraw(Long userId, Long withdrawId);
    WithdrawRequestDto updateStatus(Long id, UpdateWithdrawStatus request);
}
