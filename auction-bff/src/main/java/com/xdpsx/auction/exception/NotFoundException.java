package com.xdpsx.auction.exception;

public class NotFoundException extends AbstractAPIException {

    public NotFoundException(String errorCode, Object... var2) {
        super(errorCode, var2);
    }
}
