package com.xdpsx.auction.dto.bid;

import com.xdpsx.auction.validation.PriceConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BidRequest {
    @PriceConstraint
    @NotNull
    private BigDecimal amount;
}
