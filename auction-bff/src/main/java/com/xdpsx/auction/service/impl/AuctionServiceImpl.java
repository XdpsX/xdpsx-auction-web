package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.AuctionDetails;
import com.xdpsx.auction.dto.auction.AuctionRequest;
import com.xdpsx.auction.dto.auction.AuctionDto;
import com.xdpsx.auction.dto.auction.AuctionResponse;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.AuctionMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.*;
import com.xdpsx.auction.model.enums.AuctionType;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.repository.CategoryRepository;
import com.xdpsx.auction.repository.specification.AuctionSpecification;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.AuctionService;
import com.xdpsx.auction.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService {
    private final AuctionMapper auctionMapper;
    private final PageMapper pageMapper;
    private final UserContext userContext;
    private final MediaService mediaService;
    private final AuctionSpecification specification;
    private final CategoryRepository categoryRepository;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<AuctionDto> getAllPageAuctions(int pageNum, int pageSize, String keyword,
                                                       String sort, Boolean published) {
        Page<Auction> auctionPage = auctionRepository.findAll(
                specification.getAllAuctionsSpec(keyword, sort, published),
                PageRequest.of(pageNum - 1, pageSize)
        );
        return pageMapper.toPageAuctionDto(auctionPage, auctionMapper::fromEntityToDto);
    }

    @Override
    public PageResponse<AuctionDto> getCurrentUserAuctions(int pageNum, int pageSize, String keyword,
                                                           String sort, Boolean published) {
        CustomUserDetails user = userContext.getLoggedUser();
        Page<Auction> auctionPage = auctionRepository.findAll(
                specification.getUserAuctionsSpec(keyword, sort, published, user.getId()),
                PageRequest.of(pageNum - 1, pageSize)
        );
        return pageMapper.toPageAuctionDto(auctionPage, auctionMapper::fromEntityToDto);
    }

    @Override
    public AuctionDto createAuction(AuctionRequest request) {
        Auction auction = auctionMapper.fromRequestToEntity(request);

        Category category = findPublishedCategory(request.getCategoryId());
        auction.setCategory(category);

        Media mainImage = mediaService.getMedia(request.getMainImageId());
        auction.setMainImage(mainImage);

        if (request.getImageIds() != null && !request.getImageIds().isEmpty()) {
            List<AuctionImage> images = request.getImageIds().stream().map(imageId -> {
                Media image = mediaService.getMedia(imageId);
                return AuctionImage.builder()
                        .auction(auction)
                        .media(image).build();
            }).toList();
            auction.setImages(images);
        }

        User seller = User.builder()
                .id(userContext.getLoggedUser().getId())
                .build();
        auction.setSeller(seller);

        Auction savedAuction = auctionRepository.save(auction);
        return auctionMapper.fromEntityToDto(savedAuction);
    }

    @Override
    public PageResponse<AuctionResponse> getCategoryAuctions(Integer categoryId, int pageNum, int pageSize) {
        Category category = findPublishedCategory(categoryId);
        Page<Auction> auctionPage = auctionRepository.findAll(
                specification.getCategoryAuctionsSpec(category.getId()),
                PageRequest.of(pageNum - 1, pageSize)
        );
        return pageMapper.toPageAuctionResponse(auctionPage, auctionMapper::fromEntityToResponse);
    }

    @Override
    public AuctionDetails getPublishedAuction(Long id) {
        Auction auction = auctionRepository.findActiveAuctionById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, id));
        Bid highestBid = null;
        if (auction.getAuctionType().equals(AuctionType.ENGLISH)){
            highestBid = bidRepository.findHighestBidByAuctionId(auction.getId())
                    .orElse(null);
        }
        return auctionMapper.toAuctionDetails(auction, highestBid);
    }

    private Category findPublishedCategory(Integer categoryId){
        return categoryRepository.findPublishedCategoryById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category with id=%s not found".formatted(categoryId)));
    }
}
