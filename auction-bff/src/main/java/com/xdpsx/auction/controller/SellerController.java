package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.seller.SellerRequest;
import com.xdpsx.auction.dto.seller.SellerResponse;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.MediaService;
import com.xdpsx.auction.service.SellerService;
import com.xdpsx.auction.validation.FileTypeConstraint;
import com.xdpsx.auction.validation.ImgSizeConstraint;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static com.xdpsx.auction.constant.FileConstants.*;
import static org.springframework.http.MediaType.*;

@RestController
@RequiredArgsConstructor
public class SellerController {
    private final UserContext userContext;
    private final SellerService sellerService;
    private final MediaService mediaService;

    @PostMapping("/storefront/sellers/register")
    ResponseEntity<SellerResponse> registerSeller(@Valid @RequestBody SellerRequest request){
        SellerResponse response = sellerService.registerSeller(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/storefront/sellers/me")
    ResponseEntity<SellerResponse> getMySellerInfo(){
        SellerResponse response = sellerService.getSellerInfo(userContext.getLoggedUser().getId());
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
