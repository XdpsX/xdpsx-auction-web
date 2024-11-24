package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationDto;
import com.xdpsx.auction.dto.notification.NotificationRequest;

public interface NotificationService {
    void pushNotification(NotificationRequest request);
    PageResponse<NotificationDto> getUserNotifications(int pageNum, int pageSize, Long userId);
}
