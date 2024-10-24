package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.user.UserProfile;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserContext userContext;

    @Override
    public UserProfile getUserProfile() {
        return UserProfile.fromCustomUser(userContext.getLoggedUser());
    }
}
