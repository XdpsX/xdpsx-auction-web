package com.xdpsx.auction.dto.user;

import com.xdpsx.auction.dto.seller.SellerResponse;
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
        SellerResponse sellerDetails
) {
    public static UserProfile fromCustomUser(CustomUserDetails user) {
        return new UserProfile(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(),
                user.getMobileNumber(), user.getAddress(), getSellerResponse(user.getSellerDetails()));
    }

    public static UserProfile fromUser(User user) {
        return new UserProfile(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(),
                user.getMobileNumber(), user.getAddress(), getSellerResponse(user.getSellerDetails()));
    }

    private static SellerResponse getSellerResponse(SellerDetails sellerDetails) {
        if (sellerDetails == null) return null;
        return SellerResponse.builder()
                .id(sellerDetails.getId())
                .mobilePhone(sellerDetails.getMobilePhone())
                .address(sellerDetails.getAddress())
                .name(sellerDetails.getName())
                .status(sellerDetails.getStatus())
                .avatarUrl(sellerDetails.getAvatarUrl())
                .build();
    }
}
