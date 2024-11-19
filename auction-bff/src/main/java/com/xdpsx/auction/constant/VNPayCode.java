package com.xdpsx.auction.constant;

import com.xdpsx.auction.model.enums.TransactionStatus;

public enum VNPayCode {
    SUCCESS("00", "Transaction successful", TransactionStatus.COMPLETED),
    SUSPICIOUS_TRANSACTION("07", "Transaction successful. The transaction is suspicious (related to fraud, unusual transactions).", TransactionStatus.COMPLETED),
    NOT_REGISTERED("09", "Transaction failed: The customer's card/account has not registered for Internet Banking service at the bank.", TransactionStatus.FAILED),
    INCORRECT_INFO("10", "Transaction failed: The customer has entered incorrect card/account information more than 3 times.", TransactionStatus.FAILED),
    TIMEOUT("11", "Transaction failed: The payment timeout has expired. Please try the transaction again.", TransactionStatus.FAILED),
    ACCOUNT_LOCKED("12", "Transaction failed: The customer's card/account is locked.", TransactionStatus.FAILED),
    INCORRECT_OTP("13", "Transaction failed: The customer entered the wrong transaction authentication password (OTP). Please try the transaction again.", TransactionStatus.FAILED),
    TRANSACTION_CANCELED("24", "Transaction failed: The customer canceled the transaction.", TransactionStatus.FAILED),
    INSUFFICIENT_BALANCE("51", "Transaction failed: Your account does not have enough balance to perform the transaction.", TransactionStatus.FAILED),
    EXCEED_LIMIT("65", "Transaction failed: Your account has exceeded the daily transaction limit.", TransactionStatus.FAILED),
    MAINTENANCE("75", "The payment bank is under maintenance.", TransactionStatus.FAILED),
    INCORRECT_PAYMENT_PASSWORD("79", "Transaction failed: The customer entered the wrong payment password too many times. Please try the transaction again.", TransactionStatus.FAILED),
    OTHER_ERRORS("99", "Other errors (remaining errors not listed in the error code list).", TransactionStatus.FAILED);

    private final String code;
    private final String message;
    private final TransactionStatus status;

    VNPayCode(String code, String message, TransactionStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public static VNPayCode fromCode(String code) {
        for (VNPayCode vnPayCode : VNPayCode.values()) {
            if (vnPayCode.getCode().equals(code)) {
                return vnPayCode;
            }
        }
        return null;
    }
}

