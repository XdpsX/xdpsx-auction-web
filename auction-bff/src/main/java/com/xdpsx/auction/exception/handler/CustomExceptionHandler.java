package com.xdpsx.auction.exception.handler;

import com.xdpsx.auction.dto.error.ErrorDto;
import com.xdpsx.auction.exception.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler extends AbstractExceptionHandler {

    @ExceptionHandler(OTPException.class)
    public ResponseEntity<ErrorDto> handleOTPException(OTPException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        String message = ex.getMessage();

        return buildErrorResponse(status, message, ex, request);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorDto> handleBadRequestException(BadRequestException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = ex.getMessage();

        return buildErrorResponse(status, message, ex, request);
    }

    @ExceptionHandler({DuplicateException.class, InUseException.class})
    public ResponseEntity<ErrorDto> handleConflictException(RuntimeException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;
        String message = ex.getMessage();

        return buildErrorResponse(status, message, ex, request);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorDto> handleNotFoundException(NotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        String message = ex.getMessage();

        return buildErrorResponse(status, message, ex, request);
    }
}
