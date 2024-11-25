package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.BidPaymentStatus;
import com.xdpsx.auction.model.enums.BidStatus;
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

    @Enumerated(EnumType.STRING)
    private BidStatus status;

    @Enumerated(EnumType.STRING)
    private BidPaymentStatus paymentStatus;

    @ManyToOne
    private User bidder;

    @ManyToOne
    private Auction auction;
}
