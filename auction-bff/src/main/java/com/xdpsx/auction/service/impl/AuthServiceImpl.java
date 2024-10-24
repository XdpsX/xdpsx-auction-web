package com.xdpsx.auction.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.auth.*;
import com.xdpsx.auction.exception.DuplicateException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.Media;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Slf4j
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

    @Override
    public TokenResponse handleGoogleIdToken(IDToken request) {
        String GOOGLE_CLIENT_ID = System.getenv("GOOGLE_CLIENT_ID");
        if (GOOGLE_CLIENT_ID != null){
            try {
                HttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
                JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
                GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                        .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                        .build();

                String idTokenString = request.getToken();
                GoogleIdToken idToken = verifier.verify(idTokenString);
                if (idToken != null) {
                    GoogleIdToken.Payload payload = idToken.getPayload();
                    String email = payload.getEmail();
                    Optional<User> userOptional = userRepository.findByEmail(email);
                    if (userOptional.isPresent()){
                        return tokenProvider.generateToken(userOptional.get());
                    }else {
                        String name = (String) payload.get("name");
                        String pictureUrl = (String) payload.get("picture");

                        Media media = new Media();
                        media.setFileName("");
                        media.setMediaType("external");
                        media.setFilePath(pictureUrl);

                        Role role = roleRepository.findByName(Role.USER)
                                .orElseThrow(() -> new NotFoundException(ErrorCode.ROLE_NOT_FOUND, Role.USER));
                        Set<Role> roles = new HashSet<>();
                        roles.add(role);

                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name);
                        newUser.setRoles(roles);
                        newUser.setEnabled(true);
                        newUser.setProvider(AuthProvider.GOOGLE);
                        newUser.setAvatar(media);
                        User savedUser = userRepository.save(newUser);
                        return tokenProvider.generateToken(savedUser);
                    }
                }
            }catch (GeneralSecurityException | IOException ex) {
                log.error(ex.getMessage(), ex);
                return null;
            }
        }
        return null;
    }
}
