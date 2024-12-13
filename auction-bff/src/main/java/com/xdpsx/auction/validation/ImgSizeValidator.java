package com.xdpsx.auction.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;

public class ImgSizeValidator implements ConstraintValidator<ImgSizeConstraint, Object> {
    private int minWidth;
    private String message;

    @Override
    public void initialize(ImgSizeConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        this.minWidth = constraintAnnotation.minWidth();
        this.message = constraintAnnotation.message();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value instanceof List<?> files) {
            // Check if the list is empty or contains only MultipartFile instances
            if (files.isEmpty() || files.stream().allMatch(file -> file instanceof MultipartFile)) {
                for (Object file : files) {
                    MultipartFile curFile = (MultipartFile) file;
                    if (!validateImageWidth(curFile)) {
                        buildNewMessage(context, message);
                        return false;
                    }
                }
            } else {
                buildNewMessage(context, "Invalid file type in the list");
                return false;
            }
        } else if (value instanceof MultipartFile file) {
            if (!validateImageWidth(file)) {
                buildNewMessage(context, message);
                return false;
            }
        }
        return true;
    }

    private void buildNewMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
    }

    private boolean validateImageWidth(MultipartFile file) {
//        try {
//            BufferedImage image = ImageIO.read(file.getInputStream());
//            if (image == null) return false;
//            int imageWidth = image.getWidth();
//            return imageWidth >= minWidth;
//        } catch (IOException e) {
//            return false;
//        }
        return true;
    }
}
