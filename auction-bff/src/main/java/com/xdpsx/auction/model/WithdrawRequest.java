package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.WithdrawStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "withdraw_requests")
public class WithdrawRequest extends AbstractAuditEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bankName;

    private String accountNumber;

    private String holderName;

    private BigDecimal amount;

    @Enumerated(EnumType.ORDINAL)
    private WithdrawStatus status;

    private String reason;

    @ManyToOne
    private User user;

}
