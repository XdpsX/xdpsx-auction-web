package com.xdpsx.auction.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingInfo {
    private String recipient;
    private String mobileNumber;
    private String shippingAddress;
}
