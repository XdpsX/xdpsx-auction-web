package com.xdpsx.auction.dto.bid;

import com.xdpsx.auction.dto.auction.AuctionInfoDto;
import com.xdpsx.auction.model.enums.BidStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Getter
@Setter
@Builder
public class BidAuctionDto {
    private Long id;
    private BigDecimal amount;
    private BidStatus status;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private AuctionInfoDto auction;
    private boolean canRefund;
    private boolean canPaid;
}
