package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.auth.LoginRequest;
import com.xdpsx.auction.dto.auth.RegisterRequest;
import com.xdpsx.auction.dto.auth.TokenResponse;
import com.xdpsx.auction.exception.DuplicateException;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.AuthProvider;
import com.xdpsx.auction.model.enums.Role;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.TokenProvider;
import com.xdpsx.auction.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateException("Email %s is already in use".formatted(request.getEmail()));
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider(AuthProvider.SYSTEM)
                .role(Role.USER)
                .build();
        User savedUser = userRepository.save(user);
        String accessToken = tokenProvider.generateToken(savedUser);
        return TokenResponse.builder().accessToken(accessToken).build();
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        String accessToken = tokenProvider.generateToken(user);
        return TokenResponse.builder().accessToken(accessToken).build();
    }
}
