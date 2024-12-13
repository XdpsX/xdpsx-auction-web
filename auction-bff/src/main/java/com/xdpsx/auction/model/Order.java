package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.model.enums.PaymentMethod;
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
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackNumber;

    private BigDecimal totalAmount;

    @Embedded
    private ShippingInfo shippingInfo;

    @Enumerated(EnumType.ORDINAL)
    private OrderStatus status;

    @Enumerated(EnumType.ORDINAL)
    private PaymentMethod paymentMethod;

    private String note;

    private String reason;

    @ManyToOne
    private User user;

    @ManyToOne
    private User seller;

    @OneToOne
    private Auction auction;

    private ZonedDateTime createdAt;

    private ZonedDateTime updatedAt;

    public boolean isCanCancel() {
        return (status.equals(OrderStatus.Pending)) || (status.equals(OrderStatus.Cancelled));
    }

    public boolean isLowerDelivered() {
        return status.ordinal() < OrderStatus.Delivered.ordinal();
    }
}
