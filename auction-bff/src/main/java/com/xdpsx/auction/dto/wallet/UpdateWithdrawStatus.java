package com.xdpsx.auction.dto.wallet;

import com.xdpsx.auction.model.enums.WithdrawStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateWithdrawStatus {
    @NotNull
    private WithdrawStatus status;
    private String reason;
}
