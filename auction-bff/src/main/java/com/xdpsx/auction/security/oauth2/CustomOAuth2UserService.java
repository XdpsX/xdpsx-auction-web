package com.xdpsx.auction.security.oauth2;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.model.Role;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.repository.RoleRepository;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final List<OAuth2UserInfoExtractor> oauth2UserInfoExtractors;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Optional<OAuth2UserInfoExtractor> oAuth2UserInfoExtractorOptional = oauth2UserInfoExtractors.stream()
                .filter(oAuth2UserInfoExtractor -> oAuth2UserInfoExtractor.accepts(userRequest))
                .findFirst();
        if (oAuth2UserInfoExtractorOptional.isEmpty()) {
            throw new InternalAuthenticationServiceException("The OAuth2 provider is not supported yet");
        }

        CustomUserDetails customUserDetails = oAuth2UserInfoExtractorOptional.get().extractUserInfo(oAuth2User);
        User user = upsertUser(customUserDetails);
        customUserDetails.setId(user.getId());
        customUserDetails.setRoles(user.getRoles());
        return customUserDetails;
    }

    private User upsertUser(CustomUserDetails customUserDetails) {
        Optional<User> userOptional = userRepository.findByEmail(customUserDetails.getUsername());

        if (userOptional.isEmpty()) {
            // Media
            Media media = new Media();
            media.setFileName("");
            media.setMediaType("external");
            media.setFilePath(customUserDetails.getAvatarUrl());

            // Role
            Role role = roleRepository.findByName(Role.USER)
                    .orElseThrow(() -> new NotFoundException(ErrorCode.ROLE_NOT_FOUND, Role.USER));
            Set<Role> roles = new HashSet<>();
            roles.add(role);

            User user = new User();
            user.setName(customUserDetails.getName());
            user.setEmail(customUserDetails.getUsername());
            user.setAvatar(media);
            user.setProvider(customUserDetails.getProvider());
            user.setRoles(roles);
            user.setEnabled(customUserDetails.isEnabled());
            return userRepository.save(user);
        } else {
            return userOptional.get();
        }
    }
}
