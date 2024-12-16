package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.CacheKey;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.otp.MailOTPRequest;
import com.xdpsx.auction.dto.otp.OTPVerifyRequest;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.exception.OTPException;
import com.xdpsx.auction.exception.TooManyRequestException;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.EmailTemplateName;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.service.EmailService;
import com.xdpsx.auction.service.OTPService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static com.xdpsx.auction.constant.OTPConstants.*;

@Service
@RequiredArgsConstructor
public class OTPServiceImpl implements OTPService {
    private final RedisTemplate<String, String> redisTemplate;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Override
    public void sendValidEmailOTP(MailOTPRequest request) {
        validateEmail(request.getEmail());

        String otp = genOTPAndSave(request.getEmail());
        Map<String, Object> properties = new HashMap<>();
        properties.put("otp", otp);
        properties.put("validTime", OTP_VALID_MINUTES);

        try {
            emailService.sendEmail(
                    request.getEmail(),
                    EmailTemplateName.EMAIL_VALIDATION,
                    "Email Validation",
                    properties
            );
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void verifyOTP(OTPVerifyRequest request) {
        String key = CacheKey.getOTPKey(request.getEmail());
        String otp = redisTemplate.opsForValue().get(key);
        if (otp == null || !otp.equals(request.getOtp())) {
            throw new OTPException(ErrorCode.OTP_INVALID);
        }
        redisTemplate.delete(key);
    }

    private void validateEmail(String email){
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null){
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND,  email);
        }
        if (user.isEnabled()){
            throw new BadRequestException(ErrorCode.EMAIL_VALIDATED, email);
        }

        String key = CacheKey.getOTPKey(email);
        Long ttl = redisTemplate.getExpire(key);
        if (ttl != null && ttl > 0) {
            long elapsedTime = (OTP_VALID_MINUTES * 60) - ttl;
            if (elapsedTime < (MINUTES_PER_OTP * 60)){
                throw new TooManyRequestException(ErrorCode.TOO_MANY_REQUEST);
            }
        }
    }

    private String genOTPAndSave(String email){
        String otp = generateOTP(OTP_LENGTH);
        String key = CacheKey.getOTPKey(email);
        redisTemplate.opsForValue().set(key, otp, OTP_VALID_MINUTES, TimeUnit.MINUTES);
        return otp;
    }

    @Override
    public String generateOTP(int otpLength) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < otpLength; i++){
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }
}
