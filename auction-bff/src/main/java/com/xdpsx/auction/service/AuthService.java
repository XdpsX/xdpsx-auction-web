package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.auth.EmailDTO;
import com.xdpsx.auction.dto.auth.LoginRequest;
import com.xdpsx.auction.dto.auth.RegisterRequest;
import com.xdpsx.auction.dto.auth.TokenResponse;

public interface AuthService {
    EmailDTO register(EmailDTO request);
    TokenResponse createAccount(RegisterRequest request);
    TokenResponse login(LoginRequest request);
    TokenResponse refreshToken(String authHeader);
}
