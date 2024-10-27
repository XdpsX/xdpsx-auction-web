package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.user.UserProfile;
import com.xdpsx.auction.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping({"/storefront/users/me", "/backoffice/users/me"})
    ResponseEntity<UserProfile> getCurrentUser() {
        UserProfile response = userService.getUserProfile();
        return ResponseEntity.ok(response);
    }
}
