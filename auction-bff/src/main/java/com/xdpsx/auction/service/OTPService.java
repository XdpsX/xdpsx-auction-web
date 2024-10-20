package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.otp.MailOTPRequest;
import com.xdpsx.auction.dto.otp.OTPVerifyRequest;

public interface OTPService {
    void sendValidEmailOTP(MailOTPRequest request);
    void verifyOTP(OTPVerifyRequest request);
}
