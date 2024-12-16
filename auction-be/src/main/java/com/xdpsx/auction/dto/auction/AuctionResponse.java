package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.model.enums.AuctionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Setter
@Getter
public class AuctionResponse {
    private Long id;
    private String name;
    private BigDecimal startingPrice;
    private ZonedDateTime startingTime;
    private ZonedDateTime endingTime;
    private AuctionType type;
    private String mainImage;
    private SellerInfo seller;
    private Long numBids;
}
