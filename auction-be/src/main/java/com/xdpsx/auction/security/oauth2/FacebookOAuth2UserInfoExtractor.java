package com.xdpsx.auction.security.oauth2;

import com.xdpsx.auction.model.enums.AuthProvider;
import com.xdpsx.auction.security.CustomUserDetails;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FacebookOAuth2UserInfoExtractor implements OAuth2UserInfoExtractor{
    @Override
    public CustomUserDetails extractUserInfo(OAuth2User oAuth2User) {
        CustomUserDetails customUserDetails = new CustomUserDetails();
        customUserDetails.setEmail(retrieveAttr("email", oAuth2User));
        customUserDetails.setName(retrieveAttr("name", oAuth2User));
        customUserDetails.setAvatarUrl(retrieveAttr("picture", oAuth2User));
        customUserDetails.setProvider(AuthProvider.FACEBOOK);
        customUserDetails.setAttributes(oAuth2User.getAttributes());
        customUserDetails.setEnabled(true);
        return customUserDetails;
    }

    @Override
    public boolean accepts(OAuth2UserRequest userRequest) {
        return AuthProvider.FACEBOOK.name().equalsIgnoreCase(userRequest.getClientRegistration().getRegistrationId());
    }

    private String retrieveAttr(String attr, OAuth2User oAuth2User) {
        Object attribute = oAuth2User.getAttributes().get(attr);
        if (attribute instanceof Map) {
            // Nếu attribute là một Map (như trường hợp của "picture")
            Map<String, Object> pictureMap = (Map<String, Object>) attribute;
            return pictureMap.containsKey("data") ? ((Map<String, Object>) pictureMap.get("data")).get("url").toString() : "";
        }
        return attribute == null ? "" : attribute.toString();
    }

}
