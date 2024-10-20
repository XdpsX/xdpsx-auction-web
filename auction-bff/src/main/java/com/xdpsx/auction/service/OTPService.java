package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.otp.MailOTPRequest;

public interface OTPService {
    void sendValidEmailOTP(MailOTPRequest request);
}
