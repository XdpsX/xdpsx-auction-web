package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.auth.EmailDTO;
import com.xdpsx.auction.dto.auth.LoginRequest;
import com.xdpsx.auction.dto.auth.RegisterRequest;
import com.xdpsx.auction.dto.auth.TokenResponse;
import com.xdpsx.auction.exception.DuplicateException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.Role;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.AuthProvider;
import com.xdpsx.auction.repository.RoleRepository;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.TokenProvider;
import com.xdpsx.auction.service.AuthService;
import com.xdpsx.auction.service.OTPService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RedisTemplate<String, String> redisTemplate;
    private final OTPService otpService;

    @Override
    public EmailDTO register(EmailDTO request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user != null) {
            if (user.isEnabled()){
                throw new DuplicateException(ErrorCode.EMAIL_DUPLICATED, request.getEmail());
            }
            return new EmailDTO(user.getEmail());
        }
        User newUser = User.builder()
                .name("New User")
                .email(request.getEmail())
                .provider(AuthProvider.SYSTEM)
                .build();
        User savedUser = userRepository.save(newUser);
        return new EmailDTO(savedUser.getEmail());
    }

    @Override
    public TokenResponse createAccount(RegisterRequest request) {
        otpService.verifyOTP(request.getVerify());

        String email = request.getVerify().getEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, email));
        Role role = roleRepository.findByName(Role.USER)
                        .orElseThrow(() -> new NotFoundException(ErrorCode.ROLE_NOT_FOUND, Role.USER));
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.setRoles(roles);

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
