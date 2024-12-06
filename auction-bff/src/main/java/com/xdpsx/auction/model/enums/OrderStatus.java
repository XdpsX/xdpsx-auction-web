package com.xdpsx.auction.model.enums;

public enum OrderStatus {
    Creating(0),
    Pending(1),
    Confirmed(2),
    Shipped(3),
    Delivered(4),
    Completed(5),
    Cancelled(6),
    Returned(7);

    private final int value;

    OrderStatus(int value) {
        this.value = value;
    }
    public Integer getValue() {
        return value;
    }
    public OrderStatus next() {
        int nextValue = this.value + 1;
        if (nextValue < OrderStatus.values().length) {
//            return OrderStatus.values()[nextValue];
            for (OrderStatus status : OrderStatus.values()) {
                if (status.getValue() == value) {
                    return status;
                }
            }
        }
        return null;
    }
}
