package com.xdpsx.auction.model.enums;

import lombok.Getter;

@Getter
public enum PaymentMethod {
    INTERNAL_WALLET(0),
    VNPAY(1);

    private final int value;

    PaymentMethod(int value) {
        this.value = value;
    }

    public static PaymentMethod fromValue(int value) {
        for (PaymentMethod status : PaymentMethod.values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        return null;
    }

}
