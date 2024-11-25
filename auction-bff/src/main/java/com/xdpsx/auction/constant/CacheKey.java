package com.xdpsx.auction.constant;

public class CacheKey {
    public static String getOTPKey(String email){
        return "otp#" + email;
    }
    public static String getTransactionKey(String transactionId) { return "transaction#" + transactionId; }
}
