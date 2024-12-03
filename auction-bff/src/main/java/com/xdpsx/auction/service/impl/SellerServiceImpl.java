package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.dto.seller.SellerRequest;
import com.xdpsx.auction.dto.seller.SellerResponse;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.mapper.SellerMapper;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.model.Role;
import com.xdpsx.auction.model.SellerDetails;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.SellerRegisterStatus;
import com.xdpsx.auction.repository.RoleRepository;
import com.xdpsx.auction.repository.SellerDetailsRepository;
import com.xdpsx.auction.repository.UserRepository;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.MediaService;
import com.xdpsx.auction.service.NotificationService;
import com.xdpsx.auction.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {
    private final MediaService mediaService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final UserContext userContext;
    private final SellerDetailsRepository sellerDetailsRepository;
    private final RoleRepository roleRepository;

    @Override
    public SellerInfo registerSeller(SellerRequest request) {
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
        return SellerMapper.INSTANCE.toInfo(savedSellerDetails);
    }

    @Override
    public SellerInfo getSellerInfo(Long userId) {
        SellerDetails sellerDetails = sellerDetailsRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Seller not found"));
        return SellerMapper.INSTANCE.toInfo(sellerDetails);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<SellerResponse> getPageSeller(int pageNum, int pageSize, String keyword, String sort,
                                                      SellerRegisterStatus status) {
        Page<SellerDetails> sellerPage = sellerDetailsRepository.searchSellers(
                keyword, status, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(sellerPage, SellerMapper.INSTANCE::toResponse);
    }

    @Override
    @Transactional
    public SellerResponse updateStatus(Long id, SellerRegisterStatus status) {
        SellerDetails sellerDetails = sellerDetailsRepository.findByIdWithUser(id)
                .orElseThrow(() -> new NotFoundException("Seller not found"));
        if (sellerDetails.getStatus().equals(SellerRegisterStatus.PENDING)) {
            sellerDetails.setStatus(status);
        }
        SellerDetails savedSellerDetails = sellerDetailsRepository.save(sellerDetails);
        if (savedSellerDetails.getStatus().equals(SellerRegisterStatus.APPROVED)) {
            User user = sellerDetails.getUser();
            Role sellerRole = roleRepository.findByName(Role.SELLER)
                    .orElseThrow(() -> new NotFoundException("Role not found"));
            user.getRoles().add(sellerRole);
            userRepository.save(user);

            NotificationRequest notification = NotificationRequest.builder()
                    .title("Register Seller Success")
                    .message("Congrats to become seller. Try to login now")
                    .href("http://localhost:3001/login")
                    .userId(user.getId())
                    .build();
            notificationService.pushNotification(notification);

        }
        return SellerMapper.INSTANCE.toResponse(savedSellerDetails);
    }

    @Override
    public PageResponse<SellerResponse> getPageSellerRegisterList(int pageNum, int pageSize, String keyword, String sort) {
        Page<SellerDetails> sellerPage = sellerDetailsRepository.searchSellerRegister(
                keyword, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(sellerPage, SellerMapper.INSTANCE::toResponse);
    }

    private Sort getSort(String sortParam) {
        if (sortParam == null) {
            return Sort.by("createdAt").descending();
        }

        return switch (sortParam) {
            case "name" -> Sort.by("name").ascending();
            case "-name" -> Sort.by("name").descending();
            case "date" -> Sort.by("createdAt").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
