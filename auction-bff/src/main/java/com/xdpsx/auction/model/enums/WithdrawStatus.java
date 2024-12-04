package com.xdpsx.auction.model.enums;

import lombok.Getter;

@Getter
public enum WithdrawStatus {
    PENDING(0),
    CONFIRMED(1),
    COMPLETED(2),
    REJECTED(3),
    CANCELLED(4);

    private final int value;

    WithdrawStatus(int value) {
        this.value = value;
    }

    public static WithdrawStatus fromValue(int value) {
        for (WithdrawStatus status : WithdrawStatus.values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
//        throw new IllegalArgumentException("Invalid value: " + value);
        return null;
    }
}

