package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.seller.SellerRequest;
import com.xdpsx.auction.dto.seller.SellerResponse;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.SellerMapper;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.model.SellerDetails;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.SellerRegisterStatus;
import com.xdpsx.auction.repository.SellerDetailsRepository;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.MediaService;
import com.xdpsx.auction.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {
    private final MediaService mediaService;
    private final UserRepository userRepository;
    private final UserContext userContext;
    private final SellerDetailsRepository sellerDetailsRepository;

    @Override
    public SellerResponse registerSeller(SellerRequest request) {
        User userDetails = userRepository.findById(userContext.getLoggedUser().getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        if (sellerDetailsRepository.existsByUserId(userDetails.getId())) {
            throw new BadRequestException("Seller has already been registered");
        }

        SellerDetails sellerDetails = SellerDetails.builder()
                .name(request.getName())
                .address(request.getAddress())
                .mobilePhone(request.getMobileNumber())
                .user(userDetails)
                .status(SellerRegisterStatus.PENDING)
                .build();

        Media media;
        if (request.getImageId() != null) {
            media = mediaService.getMedia(request.getImageId());
        } else {
            media = userDetails.getAvatar();
        }
        sellerDetails.setAvatar(media);

        SellerDetails savedSellerDetails = sellerDetailsRepository.save(sellerDetails);
        return SellerMapper.INSTANCE.toResponse(savedSellerDetails);
    }

    @Override
    public SellerResponse getSellerInfo(Long userId) {
        SellerDetails sellerDetails = sellerDetailsRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Seller not found"));
        return SellerMapper.INSTANCE.toResponse(sellerDetails);
    }
}
