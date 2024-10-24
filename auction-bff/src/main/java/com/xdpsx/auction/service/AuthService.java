package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.auth.*;

public interface AuthService {
    EmailDTO register(EmailDTO request);
    TokenResponse createAccount(RegisterRequest request);
    TokenResponse login(LoginRequest request);
    TokenResponse refreshToken(String authHeader);
    TokenResponse handleGoogleIdToken(IDToken request);
}
