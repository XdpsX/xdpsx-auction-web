package com.xdpsx.auction.exception.handler;

import com.xdpsx.auction.dto.error.ErrorDto;
import com.xdpsx.auction.exception.NotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
    private static final String ERROR_LOG_FORMAT = "Error: URI: {}, ErrorCode: {}, Message: {}";

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorDto> handleNotFoundException(NotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        String message = ex.getMessage();

        return buildErrorResponse(status, message, ex, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleException(HttpServletRequest request, Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = ex.getMessage();
        return buildErrorResponse(status, message, ex, request);
    }

    private ResponseEntity<ErrorDto> buildErrorResponse(HttpStatus status, String message,
                                                                Exception ex, HttpServletRequest request){
        return buildErrorResponse(status, message, null, ex, request);
    }

    private ResponseEntity<ErrorDto> buildErrorResponse(HttpStatus status, String message, Map<String, String> errors,
                                                        Exception ex, HttpServletRequest request) {
        ErrorDto error =
                new ErrorDto(status.toString(), message, errors);

        if (request != null) {
            log.error(ERROR_LOG_FORMAT, request.getServletPath(), status.value(), message);
        }
        log.error(message, ex);
        return ResponseEntity.status(status).body(error);
    }
}
