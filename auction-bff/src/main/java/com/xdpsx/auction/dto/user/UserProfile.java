package com.xdpsx.auction.dto.user;

import com.xdpsx.auction.model.User;
import com.xdpsx.auction.security.CustomUserDetails;

import java.math.BigDecimal;


public record UserProfile (
        Long id,
        String name,
        String email,
        String avatarUrl,
        String mobileNumber,
        String address,
        BigDecimal balance
) {
    public static UserProfile fromCustomUser(CustomUserDetails user) {
        return new UserProfile(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(),
                user.getMobileNumber(), user.getAddress(), user.getWallet().getBalance());
    }

    public static UserProfile fromUser(User user) {
        return new UserProfile(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(),
                user.getMobileNumber(), user.getAddress(), user.getWallet().getBalance());
    }
}
