package com.xdpsx.auction.dto.notification;

import com.xdpsx.auction.model.enums.NotificationType;
import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record NotificationDto(
        Long id,
        String message,
        boolean isRead,
        NotificationType type,
        ZonedDateTime createdAt
) {
}
