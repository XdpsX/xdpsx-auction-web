package com.xdpsx.auction.exception;

public class BadRequestException extends AbstractAPIException {
    public BadRequestException(String errorCode, Object... var2) {
        super(errorCode, var2);
    }
}
