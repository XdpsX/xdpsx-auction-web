package com.xdpsx.auction.dto.user;

public record UserResponse (
        Long id,
        String name,
        String email,
        String avatarUrl,
        String mobileNumber,
        String address
) {
}
