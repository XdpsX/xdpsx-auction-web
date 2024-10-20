package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.otp.MailOTPRequest;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
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

    private void validateEmail(String email){
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null){
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND,  email);
        }
        if (user.isEnabled()){
            throw new BadRequestException(ErrorCode.EMAIL_VALIDATED, email);
        }
    }

    private String genOTPAndSave(String email){
        String otp = generateCode();
        redisTemplate.opsForValue().set(email, otp, OTP_VALID_MINUTES, TimeUnit.MINUTES);
        return otp;
    }

    private String generateCode() {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < OTP_LENGTH; i++){
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }
}
