package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationDto;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.Notification;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.repository.NotificationRepository;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PageMapper pageMapper;

    @Override
    public void pushNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .message(request.getMessage())
                .type(request.getType())
                .isRead(false)
                .build();

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, request.getUserId()));
            notification.setUser(user);
        }

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDto dto = maptoNotificationDto(savedNotification);
        if (request.getUserId() != null) {
            messagingTemplate.convertAndSend("/topic/notification/" + request.getUserId(), dto);
        } else {
            messagingTemplate.convertAndSend("/topic/notification", dto);
        }
    }

    @Override
    public PageResponse<NotificationDto> getUserNotifications(int pageNum, int pageSize, Long userId) {
        Page<Notification> notificationPage = notificationRepository.findUserNotifications(
                userId,
                PageRequest.of(pageNum - 1, pageSize)
        );
        return pageMapper.toPageNotificationResponse(notificationPage, this::maptoNotificationDto);
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

    private NotificationDto maptoNotificationDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
