package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.otp.MailOTPRequest;
import com.xdpsx.auction.service.OTPService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OTPController {
    private final OTPService otpService;

    @PostMapping("/otp/mail")
    ResponseEntity<Void> sendOTPMail(@Valid @RequestBody MailOTPRequest request){
        otpService.sendValidEmailOTP(request);
        return ResponseEntity.ok().build();
    }

//    @PostMapping("/verify-otp")
//    ResponseEntity<Void> verifyOTP(@Valid @RequestBody OTPVerifyRequest request){
//        otpService.verifyOTP(request);
//        return ResponseEntity.ok().build();
//    }
}
