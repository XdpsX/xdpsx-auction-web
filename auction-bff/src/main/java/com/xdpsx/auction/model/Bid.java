package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.BidStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bids")
public class Bid extends AbstractAuditEntity{
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

    @ManyToOne
    private Auction auction;
}
