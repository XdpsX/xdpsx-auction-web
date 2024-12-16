package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.error.ErrorDetailsDto;
import com.xdpsx.auction.dto.user.ProfileRequest;
import com.xdpsx.auction.dto.user.UserProfile;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.service.MediaService;
import com.xdpsx.auction.service.UserService;
import com.xdpsx.auction.validation.FileTypeConstraint;
import com.xdpsx.auction.validation.ImgSizeConstraint;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
public class UserController {
    private final UserService userService;
    private final MediaService mediaService;

    @GetMapping({"/storefront/users/me", "/backoffice/users/me"})
    ResponseEntity<UserProfile> getCurrentUser() {
        UserProfile response = userService.getUserProfile();
        return ResponseEntity.ok(response);
    }

    @PutMapping({"/storefront/users/me", "/backoffice/users/me"})
    ResponseEntity<UserProfile> updateCurrentUserProfile(@Valid @RequestBody ProfileRequest request) {
        UserProfile response = userService.updateUserProfile(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = {"/storefront/users/upload","/backoffice/users/upload"},
            consumes = MULTIPART_FORM_DATA_VALUE)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created",
                    content = @Content(schema = @Schema(implementation = Media.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content(schema = @Schema(implementation = ErrorDetailsDto.class)))
    })
    ResponseEntity<Media> uploadUserImage(@RequestParam
            @ImgSizeConstraint(minWidth = USER_IMAGE_MIN_WIDTH)
            @FileTypeConstraint(allowedTypes = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE})
            MultipartFile file){
        Media image = mediaService.saveMedia(file, USER_IMAGE_FOLDER, USER_IMAGE_MIN_WIDTH);
        return new ResponseEntity<>(image, HttpStatus.CREATED);
    }
}
