package com.xdpsx.auction.service.consumer;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.notification.NotificationDto;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.NotificationMapper;
import com.xdpsx.auction.model.Notification;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.repository.NotificationRepository;
import com.xdpsx.auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationConsumer {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "notification-topic", groupId = "notification-push-group", concurrency = "1")
    public void handleNotification(NotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, request.getUserId()));
        Notification notification = Notification.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .href(request.getHref())
                .isRead(false)
                .user(user)
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDto dto = NotificationMapper.INSTANCE.toDto(savedNotification);
        messagingTemplate.convertAndSend("/topic/notification/" + request.getUserId(), dto);
    }

}
