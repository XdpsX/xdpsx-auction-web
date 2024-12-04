package com.xdpsx.auction.dto.wallet;

import com.xdpsx.auction.model.WithdrawRequest;
import com.xdpsx.auction.model.enums.WithdrawStatus;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record WithdrawRequestDto(
        Long id,
        String bankName,
        String accountNumber,
        String holderName,
        BigDecimal amount,
        WithdrawStatus status,
        String reason,
        ZonedDateTime updatedAt
) {
    public static WithdrawRequestDto fromWithdrawRequest(WithdrawRequest request) {
        return new WithdrawRequestDto(
                request.getId(),
                request.getBankName(),
                request.getAccountNumber(),
                request.getHolderName(),
                request.getAmount(),
                request.getStatus(),
                request.getReason(),
                request.getUpdatedAt()
        );
    }
}
