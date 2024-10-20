package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.auth.EmailDTO;
import com.xdpsx.auction.dto.auth.LoginRequest;
import com.xdpsx.auction.dto.auth.TokenResponse;
import com.xdpsx.auction.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    ResponseEntity<EmailDTO> register(@Valid @RequestBody EmailDTO request){
        EmailDTO response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponse> refreshToken(
            @RequestHeader("Authorization") String authHeader
    ) {
        TokenResponse response = authService.refreshToken(authHeader);
        if (response == null ){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(response);
    }
}
