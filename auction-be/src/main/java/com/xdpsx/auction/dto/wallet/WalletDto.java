package com.xdpsx.auction.dto.wallet;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record WalletDto (
        Long id,
        BigDecimal balance,
        Long ownerId
) {
}
