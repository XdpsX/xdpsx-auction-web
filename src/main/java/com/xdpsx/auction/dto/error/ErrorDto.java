package com.xdpsx.auction.dto.error;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

public record ErrorDto(
        String status,
        String message,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        Map<String, String> fieldErrors
) {
    public ErrorDto(String status, String message){
        this(status, message, Map.of());
    }
}
