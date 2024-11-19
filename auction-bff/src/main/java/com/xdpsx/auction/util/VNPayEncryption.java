package com.xdpsx.auction.util;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Component
@Slf4j
public class VNPayEncryption {
    private final Mac mac = Mac.getInstance("HmacSHA512");

    @Value("${payment.vnpay.secret-key}")
    private String secretKey;

    public VNPayEncryption() throws NoSuchAlgorithmException {
    }

    @PostConstruct
    void init() throws InvalidKeyException {
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA512");
        mac.init(secretKeySpec);
    }


    public String sign(String data) {
        try {
            return EncodingUtil.toHexString(mac.doFinal(data.getBytes()));
        }
        catch (Exception e) {
            throw new RuntimeException("VNPAY_SIGNING_FAILED");
        }
    }
}
