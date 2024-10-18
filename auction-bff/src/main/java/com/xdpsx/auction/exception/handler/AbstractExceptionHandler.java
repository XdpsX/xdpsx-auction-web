package com.xdpsx.auction.exception.handler;

import com.xdpsx.auction.dto.error.ErrorDetailsDto;
import com.xdpsx.auction.dto.error.ErrorDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Slf4j
public abstract class AbstractExceptionHandler {
    static final String ERROR_LOG_FORMAT = "Error info - URI: {}, ErrorCode: {}, Message: {}";
    protected static final String INVALID_REQUEST_INFORMATION_MESSAGE = "Request information is not valid";

    protected ResponseEntity<ErrorDto> buildErrorResponse(HttpStatus status, String message,
                                                          Exception ex, HttpServletRequest request) {
        logError(status, message, request, ex);
        ErrorDto error = new ErrorDto(status.toString(), message);
        return ResponseEntity.status(status).body(error);
    }

    protected ResponseEntity<ErrorDetailsDto> buildErrorDetailsResponse(HttpStatus status, String message,
                                                                        Map<String, String> errors, Exception ex, HttpServletRequest request) {
        logError(status, message, request, ex);
        ErrorDetailsDto errorDetails = new ErrorDetailsDto(status.toString(), message, errors);
        return ResponseEntity.status(status).body(errorDetails);
    }

    protected void logError(HttpStatus status, String message, HttpServletRequest request, Exception ex) {
        if (request != null) {
            log.error(ERROR_LOG_FORMAT, request.getServletPath(), status.value(), message);
        }
        log.error(message, ex);
    }
}
