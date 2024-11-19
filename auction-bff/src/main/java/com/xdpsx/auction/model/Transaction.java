package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.PaymentMethod;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")
public class Transaction extends AbstractAuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String description;

    @ManyToOne
    private Wallet wallet;

}
