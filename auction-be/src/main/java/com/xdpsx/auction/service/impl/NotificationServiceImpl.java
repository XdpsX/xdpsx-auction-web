package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationDto;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.mapper.NotificationMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.Notification;
import com.xdpsx.auction.repository.NotificationRepository;
import com.xdpsx.auction.service.NotificationService;
import com.xdpsx.auction.service.producer.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationProducer notificationProducer;

    @Override
    public void pushNotification(NotificationRequest request) {
        notificationProducer.produceNotification(request);
    }

    @Override
    public PageResponse<NotificationDto> getUserNotifications(int pageNum, int pageSize, Long userId) {
        Page<Notification> notificationPage = notificationRepository.findUserNotifications(
                userId,
                PageRequest.of(pageNum - 1, pageSize)
        );
        return PageMapper.toPageResponse(notificationPage, NotificationMapper.INSTANCE::toDto);
    }

    @Override
    public long countUnreadNotifications(Long userId) {
        return notificationRepository.countUnreadNotification(userId);
    }

    @Override
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    public void markAsReadAll(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    @Override
    public void pushNotificationTest() {
        NotificationRequest request = NotificationRequest.builder()
                .message("test message")
                .userId(1L)
                .build();
        notificationProducer.produceNotification(request);
    }

}
