package com.xdpsx.auction.exception;

import com.xdpsx.auction.util.MessagesUtils;

public class BadRequestException extends RuntimeException {
    private final String message;

    public BadRequestException(String errorCode, Object... var2) {
        this.message = MessagesUtils.getMessage(errorCode, var2);
    }

    @Override
    public String getMessage() {
        return message;
    }
}
