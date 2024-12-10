package com.xdpsx.auction.service.producer;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuctionProducer {
    private final KafkaTemplate<String, Long> kafkaTemplate;

    public void produceAuctionTfIDF(Long auctionId){
        kafkaTemplate.send("auction-tfidf-topic", auctionId);
    }

    public void produceAuctionEnd(Long auctionId){
        kafkaTemplate.send("auction-end-topic", auctionId);
    }
}
