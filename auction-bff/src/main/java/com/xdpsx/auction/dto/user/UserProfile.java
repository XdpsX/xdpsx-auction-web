package com.xdpsx.auction.dto.user;

import com.xdpsx.auction.security.CustomUserDetails;


public record UserProfile (
        Long id,
        String name,
        String email,
        String avatarUrl
) {
    public static UserProfile fromCustomUser(CustomUserDetails user) {
        return new UserProfile(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl());
    }
}
