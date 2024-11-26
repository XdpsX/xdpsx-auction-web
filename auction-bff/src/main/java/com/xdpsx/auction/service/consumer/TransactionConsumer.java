package com.xdpsx.auction.service.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionConsumer {
    @KafkaListener(topics = "transaction-topic", groupId = "wallet-balance-group")
    public void handleTransactionEvent(String mesage) {
      log.info("Kafka message: " + mesage);
    }
}
