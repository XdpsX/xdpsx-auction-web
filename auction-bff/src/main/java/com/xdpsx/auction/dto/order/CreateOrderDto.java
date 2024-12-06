package com.xdpsx.auction.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateOrderDto {

    @NotNull
    private Long bidId;

    @NotBlank
    @Size(max=50)
    private String recipient;

    @NotBlank
    @Size(max=20)
    private String mobileNumber;

    @NotBlank
    @Size(max=255)
    private String shippingAddress;

    @Size(max=255)
    private String note;

    private int paymentMethod;

}
