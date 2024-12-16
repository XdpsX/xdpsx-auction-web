package com.xdpsx.auction.exception;

public class TooManyRequestException extends AbstractAPIException {
    public TooManyRequestException(String errorCode, Object... var2) {
        super(errorCode, var2);
    }
}
