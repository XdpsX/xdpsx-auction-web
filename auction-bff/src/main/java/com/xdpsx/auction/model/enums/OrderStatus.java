package com.xdpsx.auction.model.enums;

public enum OrderStatus {
    Pending(0), Confirmed(1), Shipped(2), Delivered(3), Completed(4), Cancelled(5), Returned(6);

    private final Integer level;

    OrderStatus(int level) {
        this.level = level;
    }
    public Integer getPriority() {
        return level;
    }
    public OrderStatus next() {
        int nextOrdinal = this.ordinal() + 1;
        if (nextOrdinal < OrderStatus.values().length) {
            return OrderStatus.values()[nextOrdinal];
        }
        return this;
    }
}
