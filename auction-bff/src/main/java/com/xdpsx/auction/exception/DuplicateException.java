package com.xdpsx.auction.exception;

public class DuplicateException extends AbstractAPIException {

    public DuplicateException(String errorCode, Object... var2) {
        super(errorCode, var2);
    }
}
