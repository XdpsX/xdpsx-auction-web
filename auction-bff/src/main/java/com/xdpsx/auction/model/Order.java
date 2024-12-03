package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order extends AbstractAuditEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackNumber;

    private String auctionName;

    @OneToOne
    private Media auctionImage;

    private BigDecimal totalAmount;

    private String shippingAddress;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String note;

    @ManyToOne
    private User user;

    @ManyToOne
    private User seller;

    @OneToOne
    private Auction auction;

    public String getAuctionImageUrl() {
        return auctionImage.getUrl();
    }

    public boolean isCanCancel() {
        return (status.equals(OrderStatus.Pending)) || (status.equals(OrderStatus.Cancelled));
    }

    public boolean isLowerDelivered() {
        return status.ordinal() < OrderStatus.Delivered.ordinal();
    }
}
