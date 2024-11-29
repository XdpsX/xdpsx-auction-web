package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.dto.seller.SellerRequest;
import com.xdpsx.auction.dto.seller.SellerResponse;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.model.enums.SellerRegisterStatus;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.MediaService;
import com.xdpsx.auction.service.SellerService;
import com.xdpsx.auction.validation.FileTypeConstraint;
import com.xdpsx.auction.validation.ImgSizeConstraint;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static com.xdpsx.auction.constant.FileConstants.*;
import static com.xdpsx.auction.constant.PageConstant.*;
import static org.springframework.http.MediaType.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class SellerController {
    private final UserContext userContext;
    private final SellerService sellerService;
    private final MediaService mediaService;

    @PostMapping("/storefront/sellers/register")
    ResponseEntity<SellerInfo> registerSeller(@Valid @RequestBody SellerRequest request){
        SellerInfo response = sellerService.registerSeller(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/sellers")
    ResponseEntity<PageResponse<SellerResponse>> getPageSeller(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) SellerRegisterStatus status){
        PageResponse<SellerResponse> response = sellerService.getPageSeller(
                pageNum, pageSize, keyword, sort, status
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/backoffice/sellers/{id}/status/{status}")
    ResponseEntity<SellerResponse> updateSellerStatus(@PathVariable("id") Long id,
                                                      @PathVariable("status") SellerRegisterStatus status) {
        SellerResponse response = sellerService.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/storefront/sellers/me")
    ResponseEntity<SellerInfo> getMySellerInfo(){
        SellerInfo response = sellerService.getSellerInfo(userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = {"/storefront/sellers/upload","/backoffice/sellers/upload"},
            consumes = MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<Media> uploadUserImage(@RequestParam
                                          @ImgSizeConstraint(minWidth = SELLER_IMAGE_MIN_WIDTH)
                                          @FileTypeConstraint(allowedTypes = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE})
                                          MultipartFile file){
        Media image = mediaService.saveMedia(file, SELLER_IMAGE_FOLDER, SELLER_IMAGE_MIN_WIDTH);
        return new ResponseEntity<>(image, HttpStatus.CREATED);
    }
}
