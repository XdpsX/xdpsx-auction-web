package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.BidStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

    @Enumerated(EnumType.STRING)
    private BidStatus status;

    @OneToOne
    private Transaction transaction;

    @ManyToOne
    private User bidder;

    @ManyToOne(cascade = CascadeType.MERGE)
    private Auction auction;

    private ZonedDateTime createdAt;

    private ZonedDateTime updatedAt;
}
