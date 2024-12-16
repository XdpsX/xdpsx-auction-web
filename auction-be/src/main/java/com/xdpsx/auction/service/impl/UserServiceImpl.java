package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.user.ProfileRequest;
import com.xdpsx.auction.dto.user.UserProfile;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.MediaService;
import com.xdpsx.auction.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final MediaService mediaService;
    private final UserContext userContext;
    private final UserRepository userRepository;

    @Override
    public UserProfile getUserProfile() {
        return UserProfile.fromCustomUser(userContext.getLoggedUser());
    }

    @Override
    public UserProfile updateUserProfile(ProfileRequest request) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND, userDetails.getId()));
        user.setId(userDetails.getId());
        user.setName(request.getName());
        user.setAddress(request.getAddress());
        user.setMobileNumber(request.getMobileNumber());

        if (request.getImageId() != null){
            Media avatar = mediaService.getMedia(request.getImageId());
            user.setAvatar(avatar);
        }

        User savedUser = userRepository.save(user);
        return UserProfile.fromUser(savedUser);
    }
}
