package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.model.enums.EmailTemplateName;
import com.xdpsx.auction.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    @Override
    public void sendEmail(String to, EmailTemplateName emailTemplate,
                          String subject, Map<String, Object> properties) throws MessagingException {
        String templateName = emailTemplate.getName();

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );

        Context context = new Context();
        context.setVariables(properties);

        String template = templateEngine.process(templateName, context);

        helper.setFrom("no-reply@xdpsx.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(template, true);

        ClassPathResource logoResource = new ClassPathResource("images/logo-120x120.png");
        helper.addInline("logo", logoResource);

        mailSender.send(mimeMessage);
    }
}
