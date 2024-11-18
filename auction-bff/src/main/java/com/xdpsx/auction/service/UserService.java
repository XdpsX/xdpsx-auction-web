package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.user.ProfileRequest;
import com.xdpsx.auction.dto.user.UserProfile;

public interface UserService {
    UserProfile getUserProfile();
    UserProfile updateUserProfile(ProfileRequest request);
}
