package com.xdpsx.auction.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class FileTypeValidator implements ConstraintValidator<FileTypeConstraint, Object> {
    private String[] allowedTypes;
    private String message;

    @Override
    public void initialize(FileTypeConstraint constraintAnnotation) {
        this.allowedTypes = constraintAnnotation.allowedTypes();
        this.message = constraintAnnotation.message();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value instanceof List<?> files) {
            if (!files.isEmpty() && files.stream().allMatch(file -> file instanceof MultipartFile)) {
                for (Object file : files) {
                    MultipartFile curFile = (MultipartFile) file;
                    if (!validateFileType(curFile)) {
                        buildNewMessage(context, message);
                        return false;
                    }
                }
            }
        } else if (value instanceof MultipartFile file) {
            if (!validateFileType(file)) {
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

    private boolean validateFileType(MultipartFile file) {
        for (String type : allowedTypes) {
            if (type.equals(file.getContentType())) {
                return true;
            }
        }
        return false;
    }
}
