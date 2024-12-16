package com.xdpsx.auction.dto.user;

import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.model.SellerDetails;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.security.CustomUserDetails;

public record UserProfile (
        Long id,
        String name,
        String email,
        String avatarUrl,
        String mobileNumber,
        String address,
        SellerInfo sellerDetails
) {
    public static UserProfile fromCustomUser(CustomUserDetails user) {
        return new UserProfile(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(),
                user.getMobileNumber(), user.getAddress(), getSellerInfo(user.getSellerDetails()));
    }

    public static UserProfile fromUser(User user) {
        return new UserProfile(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(),
                user.getMobileNumber(), user.getAddress(), getSellerInfo(user.getSellerDetails()));
    }

    private static SellerInfo getSellerInfo(SellerDetails sellerDetails) {
        if (sellerDetails == null) return null;
        return new SellerInfo(sellerDetails.getId(), sellerDetails.getName(), sellerDetails.getAddress(),
                sellerDetails.getMobilePhone(), sellerDetails.getAvatarUrl(), sellerDetails.getStatus());
    }
}
