package com.xdpsx.auction.dto.transaction;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.xdpsx.auction.model.enums.PaymentMethod;
import com.xdpsx.auction.validation.PriceConstraint;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class TransactionRequest {
    @PriceConstraint
    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String ipAddress;
}
