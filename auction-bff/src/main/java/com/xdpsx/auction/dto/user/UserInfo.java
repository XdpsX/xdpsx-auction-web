package com.xdpsx.auction.dto.user;

public record UserInfo(
        Long id,
        String name,
        String email,
        String avatarUrl
) {
}
