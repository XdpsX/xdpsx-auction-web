package com.xdpsx.auction.security;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.xdpsx.auction.dto.auth.TokenResponse;
import com.xdpsx.auction.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Slf4j
@Component
public class TokenProvider {
    @Value("${app.jwt.secret}")
    private String SECRET_KEY;

    @Value("${app.jwt.access-expiration.seconds}")
    private Long ACCESS_EXPIRATION_SECONDS;

    @Value("${app.jwt.refresh-expiration.seconds}")
    private Long REFRESH_EXPIRATION_SECONDS;

    public TokenResponse generateToken(User user) {
        return TokenResponse.builder()
                .accessToken(generateToken(user, ACCESS_EXPIRATION_SECONDS))
                .refreshToken(generateToken(user, REFRESH_EXPIRATION_SECONDS))
                .build();
    }

    public String generateToken(User user, long expirationSeconds) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("xdpsx.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(expirationSeconds, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .claim("scope", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList().get(0))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    public String extractUsername(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            return claimsSet.getSubject();
        } catch (Exception e) {
            log.error("Cannot extract username from token", e);
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            MACVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());
            if (!signedJWT.verify(verifier)) {
                return false;
            }

            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Date expirationTime = claimsSet.getExpirationTime();
            if (expirationTime.before(new Date())) {
                return false;
            }

            String username = claimsSet.getSubject();
            return username.equals(userDetails.getUsername());
        } catch (Exception e) {
            log.error("Token validation failed", e);
            return false;
        }
    }

    public Long getTTL(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Date expirationTime = claimsSet.getExpirationTime();

            // Tính toán thời gian còn lại cho đến khi hết hạn
            long ttl = expirationTime.getTime() - System.currentTimeMillis();

            // Nếu TTL âm, có nghĩa là token đã hết hạn
            return ttl > 0 ? ttl : 0;
        } catch (Exception e) {
            log.error("Cannot extract TTL from token", e);
            return null;
        }
    }
}
