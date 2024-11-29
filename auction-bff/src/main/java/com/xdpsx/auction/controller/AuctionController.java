package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.*;
import com.xdpsx.auction.dto.error.ErrorDetailsDto;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.service.AuctionService;
import com.xdpsx.auction.service.MediaService;
import com.xdpsx.auction.validation.FileTypeConstraint;
import com.xdpsx.auction.validation.ImgSizeConstraint;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static com.xdpsx.auction.constant.FileConstants.*;
import static com.xdpsx.auction.constant.PageConstant.*;
import static org.springframework.http.MediaType.*;

@RestController
@RequiredArgsConstructor
@Validated
public class AuctionController {
    private final AuctionService auctionService;
    private final MediaService mediaService;

    @GetMapping("/backoffice/auctions/all")
    ResponseEntity<PageResponse<AuctionSellerInfo>> getAllPageAuctions(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean published
    ) {
        PageResponse<AuctionSellerInfo> response = auctionService.getAllPageAuctions(pageNum, pageSize,
                keyword, sort, published);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/auctions/me")
    ResponseEntity<PageResponse<AuctionDto>> getUserPageAuctions(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean published
    ) {
        PageResponse<AuctionDto> response = auctionService.getCurrentUserAuctions(pageNum, pageSize,
                keyword, sort, published);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/backoffice/auctions")
    ResponseEntity<AuctionDto> createAuction(@Valid @RequestBody AuctionRequest request){
        return new ResponseEntity<>(auctionService.createAuction(request), HttpStatus.CREATED);
    }

    @PostMapping(value = "/backoffice/auctions/upload", consumes = MULTIPART_FORM_DATA_VALUE)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created",
                    content = @Content(schema = @Schema(implementation = Media.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content(schema = @Schema(implementation = ErrorDetailsDto.class)))
    })
    ResponseEntity<Media> uploadAuctionImage(
            @RequestParam
            @ImgSizeConstraint(minWidth = AUCTION_IMAGE_MIN_WIDTH)
            @FileTypeConstraint(allowedTypes = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE})
            MultipartFile file){
        Media image = mediaService.saveMedia(file, AUCTION_IMAGE_FOLDER, AUCTION_IMAGE_MIN_WIDTH);
        return new ResponseEntity<>(image, HttpStatus.CREATED);
    }

    @GetMapping("/public/categories/{categoryId}/auctions")
    ResponseEntity<PageResponse<AuctionResponse>> getCategoryAuctions(
            @PathVariable Integer categoryId,
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize
    ) {
        PageResponse<AuctionResponse> response = auctionService.getCategoryAuctions(categoryId, pageNum, pageSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/auctions/{id}")
    ResponseEntity<AuctionDetails> getPublishedAuction(
            @PathVariable Long id
    ) {
        AuctionDetails response = auctionService.getPublishedAuction(id);
        return ResponseEntity.ok(response);
    }

}
