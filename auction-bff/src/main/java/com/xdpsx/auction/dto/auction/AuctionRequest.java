package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.model.enums.AuctionType;
import com.xdpsx.auction.validation.AuctionTypeConstraint;
import com.xdpsx.auction.validation.PriceConstraint;
import com.xdpsx.auction.validation.TimeConstraint;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

import static com.xdpsx.auction.constant.FileConstants.*;

@Setter
@Getter
@AuctionTypeConstraint
@TimeConstraint
public class AuctionRequest {
    @NotBlank
    @Size(max = 128)
    private String name;

    @Size(max = 2000)
    private String description;

    @NotNull
    @Max(value = 2_000_000_000L)
    @PriceConstraint
    private BigDecimal startingPrice;

    @Max(value = 200_000_000)
    @PriceConstraint
    private BigDecimal stepPrice;

    @NotNull
    @FutureOrPresent
    private ZonedDateTime startingTime;

    @NotNull
    @Future
    private ZonedDateTime endingTime;

    @NotNull
    private AuctionType type;

    private boolean published;

    @NotNull
    private Integer categoryId;

    @NotNull
    private Long mainImageId;

    @Size(max = MAX_NUMBER_AUCTION_IMAGE)
    private List<Long> imageIds;

}
