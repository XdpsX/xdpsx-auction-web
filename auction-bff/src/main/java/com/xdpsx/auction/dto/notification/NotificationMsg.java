package com.xdpsx.auction.dto.notification;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationMsg {
    private String message;
    private String title;

}
