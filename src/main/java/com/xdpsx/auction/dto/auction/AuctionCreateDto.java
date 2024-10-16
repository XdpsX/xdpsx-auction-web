package com.xdpsx.auction.dto.auction;

import com.xdpsx.auction.model.enums.AuctionType;
import com.xdpsx.auction.validation.FileTypeConstraint;
import com.xdpsx.auction.validation.ImgSizeConstraint;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static com.xdpsx.auction.constant.FileConstants.*;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@Setter
@Getter
public class AuctionCreateDto {
    @NotBlank
    @Size(max = 128)
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull
    @Max(value = 2_000_000_000L)
    @Min(value = 0)
    private BigDecimal startingPrice;

    @Min(value = 100)
    private BigDecimal stepPrice;

    @NotNull
    @FutureOrPresent
    private LocalDate startingTime;

    @NotNull
    @Future
    private LocalDate endingTime;

    @NotNull
    private AuctionType auctionType;

    @NotNull
    private Integer categoryId;

    @ImgSizeConstraint(minWidth = AUCTION_IMAGE_MIN_WIDTH)
    @FileTypeConstraint(allowedTypes = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE})
    @Size(min = 1, max = MAX_NUMBER_AUCTION_IMAGE)
    private List<MultipartFile> files;
}
