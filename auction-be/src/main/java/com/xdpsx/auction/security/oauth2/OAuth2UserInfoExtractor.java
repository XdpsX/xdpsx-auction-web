package com.xdpsx.auction.security.oauth2;

import com.xdpsx.auction.security.CustomUserDetails;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuth2UserInfoExtractor {
    CustomUserDetails extractUserInfo(OAuth2User oAuth2User);
    boolean accepts(OAuth2UserRequest userRequest);
}
