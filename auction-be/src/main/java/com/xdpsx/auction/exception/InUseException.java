package com.xdpsx.auction.exception;

public class InUseException extends AbstractAPIException {

    public InUseException(String errorCode, Object... var2) {
        super(errorCode, var2);
    }
}
