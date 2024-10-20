package com.xdpsx.auction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AuctionBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuctionBeApplication.class, args);
    }

}
