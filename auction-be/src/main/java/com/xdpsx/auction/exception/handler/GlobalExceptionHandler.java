package com.xdpsx.auction.exception.handler;

import com.xdpsx.auction.dto.error.ErrorDetailsDto;
import com.xdpsx.auction.dto.error.ErrorDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ControllerAdvice
public class GlobalExceptionHandler extends AbstractExceptionHandler{

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDto> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request){
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        String message = ex.getMessage();

        return buildErrorResponse(status, message, ex, request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorDetailsDto> handleConstraintViolationException(ConstraintViolationException ex,
                                                                              HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        Set<ConstraintViolation<?>> fieldErrorsList = ex.getConstraintViolations();
        Map<String, String> fieldErrors = new HashMap<>();

        for (ConstraintViolation<?> fieldError : fieldErrorsList) {
            String[] fieldPathSplit = fieldError.getPropertyPath().toString().split("\\.");
            String fieldName = fieldPathSplit[fieldPathSplit.length - 1];
//            fieldErrors.put(fieldName, fieldError.getMessage());
            fieldErrors.merge(fieldName, fieldError.getMessage(),
                    (existingMessage, newMessage) -> existingMessage + "; " + newMessage);
        }
        return buildErrorDetailsResponse(status, INVALID_REQUEST_INFORMATION_MESSAGE, fieldErrors, ex, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDetailsDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex,
                                                                                 HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        List<FieldError> fieldErrorsList = ex.getBindingResult().getFieldErrors();
        Map<String, String> fieldErrors = new HashMap<>();

        for (FieldError fieldError : fieldErrorsList) {
            String errorMessage = fieldError.getDefaultMessage();
            if (errorMessage != null) {
                fieldErrors.merge(fieldError.getField(), errorMessage,
                        (existingMessage, newMessage) -> existingMessage + "; " + newMessage);
            }
        }
        return buildErrorDetailsResponse(status, INVALID_REQUEST_INFORMATION_MESSAGE, fieldErrors, ex, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleException(HttpServletRequest request, Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = ex.getMessage();
        return buildErrorResponse(status, message, ex, request);
    }

}
