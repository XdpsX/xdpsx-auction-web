package com.xdpsx.auction.dto.notification;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {
    private String title;
    private String message;
    private String href;
    private Long userId;
}
