package com.xdpsx.auction.constant;

import com.xdpsx.auction.dto.auction.AuctionTime;
import com.xdpsx.auction.model.enums.AuctionType;

import java.math.BigDecimal;

public class CacheKey {
    public static String getOTPKey(String email){
        return "otp#" + email;
    }
    public static String getTransactionKey(String transactionId) { return "transaction#" + transactionId; }
    public static String getAuctionSearchKey(String keyword, Integer categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                             AuctionType type, AuctionTime time, String sort) {
        return String.format("search:%s:%s:%s:%s:%s:%s:%s",
                keyword == null ? "" : keyword.replace(" ", ","),
                categoryId == null ? "null" : categoryId,
                minPrice == null ? "null" : minPrice.toPlainString(),
                maxPrice == null ? "null" : maxPrice.toPlainString(),
                type == null ? "null" : type,
                time == null ? "null" : time,
                sort == null ? "null" : sort);
    }
}
