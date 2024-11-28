package com.xdpsx.auction.service.producer;

import com.xdpsx.auction.dto.transaction.TransactionMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionProducer {
    private final KafkaTemplate<String, TransactionMessage> kafkaTemplate;

    public void produceTransaction(TransactionMessage transaction){
        log.info("Produce transaction {}", transaction);
        kafkaTemplate.send("transaction-topic", transaction);
    }
}
