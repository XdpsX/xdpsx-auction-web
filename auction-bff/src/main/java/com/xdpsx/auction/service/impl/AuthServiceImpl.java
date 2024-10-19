package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.auth.LoginRequest;
import com.xdpsx.auction.dto.auth.RegisterRequest;
import com.xdpsx.auction.dto.auth.TokenResponse;
import com.xdpsx.auction.exception.DuplicateException;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.AuthProvider;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.TokenProvider;
import com.xdpsx.auction.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RedisTemplate<String, String> redisTemplate;

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
//                .role(Role.USER)
                .build();
        User savedUser = userRepository.save(user);
        return tokenProvider.generateToken(savedUser);
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return tokenProvider.generateToken(user);
    }

    @Override
    public TokenResponse refreshToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return null;
        }
        final String refreshToken = authHeader.substring(7);
        final String userEmail = tokenProvider.extractUsername(refreshToken);
        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail)
                    .orElse(null);
            if (user != null &&
                    tokenProvider.isRefreshTokenValid(refreshToken, user) &&
                    Boolean.FALSE.equals(redisTemplate.hasKey(refreshToken))
            ){

                redisTemplate.opsForValue().set(refreshToken, "REFRESH",
                        tokenProvider.getTTL(refreshToken), TimeUnit.MILLISECONDS);
                return tokenProvider.generateToken(user);
            }
        }
        return null;
    }
}
