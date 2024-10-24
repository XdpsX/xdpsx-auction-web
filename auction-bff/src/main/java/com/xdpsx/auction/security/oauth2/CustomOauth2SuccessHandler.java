package com.xdpsx.auction.security.oauth2;

import com.xdpsx.auction.dto.auth.TokenResponse;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.TokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomOauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final TokenProvider tokenProvider;

    @Value("${app.oauth2.success-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        handle(request, response, authentication);
        super.clearAuthenticationAttributes(request);
    }

    @Override
    protected void handle(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        String targetUrl = redirectUri.isEmpty() ?
                determineTargetUrl(request, response, authentication) : redirectUri;

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        TokenResponse token = tokenProvider.generateToken(userDetails);
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("accessToken", token.accessToken())
                .queryParam("refreshToken", token.refreshToken())
                .build().toUriString();
        log.info("Login successfully. Redirecting to {}", targetUrl);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
