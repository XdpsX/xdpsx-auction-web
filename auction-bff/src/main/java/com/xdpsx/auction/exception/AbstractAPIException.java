package com.xdpsx.auction.exception;

import com.xdpsx.auction.util.MessagesUtils;

public abstract class AbstractAPIException extends RuntimeException {
    private final String message;

    public AbstractAPIException(String errorCode, Object... var2) {
        this.message = MessagesUtils.getMessage(errorCode, var2);
    }

    @Override
    public String getMessage() {
        return message;
    }
}
