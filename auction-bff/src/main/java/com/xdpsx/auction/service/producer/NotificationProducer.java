package com.xdpsx.auction.service.producer;

import com.xdpsx.auction.dto.notification.NotificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationProducer {
    private final KafkaTemplate<String, NotificationRequest> kafkaTemplate;

    public void produceNotification(NotificationRequest request) {
        log.info("Produce notification request: {}", request);
        kafkaTemplate.send("notification-topic", request);
    }
}
