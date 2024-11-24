package com.xdpsx.auction.dto.notification;

import com.xdpsx.auction.model.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class NotificationRequest {
    private String message;
    private NotificationType type;
    private Long userId;
}
