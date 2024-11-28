package com.xdpsx.auction.dto.notification;

import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record NotificationDto(
        Long id,
        String title,
        String message,
        String href,
        boolean isRead,
        ZonedDateTime createdAt
) {
}
