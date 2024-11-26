package com.xdpsx.auction.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
    @Bean
    public NewTopic transactionTopic(){
        return TopicBuilder.name("transaction-topic")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic notificationTopic(){
        return TopicBuilder.name("notification-topic")
                .partitions(1)
                .replicas(1)
//                .config("retention.ms", "604800000") // Thời gian tồn tại là 7 ngày (604800000 mili giây)
//                .config("retention.bytes", "-1") // Không giới hạn kích thước
                .build();
    }
}
