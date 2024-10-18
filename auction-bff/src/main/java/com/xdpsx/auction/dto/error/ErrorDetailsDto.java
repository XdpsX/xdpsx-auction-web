package com.xdpsx.auction.dto.error;


import java.util.Map;

public record ErrorDetailsDto(
        String status,
        String message,
        Map<String, String> fieldErrors
) {
    public ErrorDetailsDto(String status, String message){
        this(status, message, Map.of());
    }
}
