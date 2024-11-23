package com.xdpsx.auction.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;

    @CreationTimestamp
    private ZonedDateTime bidTime;

    private boolean isWinner;

    private boolean isRefund;

    @ManyToOne
    private User bidder;

    @ManyToOne
    private Auction auction;
}
