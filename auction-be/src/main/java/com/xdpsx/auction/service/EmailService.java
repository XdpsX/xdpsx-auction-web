package com.xdpsx.auction.service;

import com.xdpsx.auction.model.enums.EmailTemplateName;
import jakarta.mail.MessagingException;

import java.util.Map;

public interface EmailService {
    void sendEmail(
            String to,
            EmailTemplateName emailTemplate,
            String subject,
            Map<String, Object> properties
    ) throws MessagingException;
}
