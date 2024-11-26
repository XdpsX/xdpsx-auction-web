package com.xdpsx.auction.service.consumer;

import com.xdpsx.auction.dto.notification.NotificationMsg;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationConsumer {
    @KafkaListener(topics = "notification-topic", groupId = "notification-push-group", concurrency = "1")
    public void handleTransactionEvent(NotificationMsg message) {
        log.info("Kafka notification message: {}", message.getMessage());
        log.info(message.getTitle());
    }
}
