package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.*;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.AuctionMapper;
import com.xdpsx.auction.mapper.BidMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.*;
import com.xdpsx.auction.model.enums.AuctionStatus;
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
    private final UserContext userContext;
    private final MediaService mediaService;
    private final AuctionSpecification specification;
    private final CategoryRepository categoryRepository;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<AuctionSellerInfo> getAllPageAuctions(int pageNum, int pageSize, String keyword,
                                                              String sort, Boolean published,
                                                              AuctionType type, AuctionStatus status, AuctionTime time) {
        Page<Auction> auctionPage = auctionRepository.findAll(
                specification.getAllAuctionsSpec(keyword, sort, published, type, status, time),
                PageRequest.of(pageNum - 1, pageSize)
        );
        return PageMapper.toPageResponse(auctionPage, AuctionMapper.INSTANCE::toAuctionSellerInfo);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<AuctionSellerInfo> getAllTrashedAuctions(int pageNum, int pageSize, String keyword,
                                                                 String sort, Boolean published,
                                                                 AuctionType type, AuctionStatus status, AuctionTime time) {
        Page<Auction> auctionPage = auctionRepository.findAll(
                specification.getTrashedAuctionsSpec(keyword, sort, published, type, status, time),
                PageRequest.of(pageNum - 1, pageSize)
        );
        return PageMapper.toPageResponse(auctionPage, AuctionMapper.INSTANCE::toAuctionSellerInfo);
    }

    @Override
    public PageResponse<AuctionDto> getCurrentUserAuctions(int pageNum, int pageSize, String keyword, String sort,
                                                           AuctionType type, AuctionStatus status, AuctionTime time) {
        CustomUserDetails user = userContext.getLoggedUser();
        Page<Auction> auctionPage = auctionRepository.findAll(
                specification.getUserAuctionsSpec(keyword, sort, user.getId(), type, status, time),
                PageRequest.of(pageNum - 1, pageSize)
        );
        return PageMapper.toPageResponse(auctionPage, AuctionMapper.INSTANCE::toDto);
    }

    @Override
    public AuctionDto createAuction(AuctionRequest request) {
        Auction auction = AuctionMapper.INSTANCE.toEntity(request);

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
        auction.setPublished(true);
        auction.setStatus(AuctionStatus.LIVE);

        Auction savedAuction = auctionRepository.save(auction);
        return AuctionMapper.INSTANCE.toDto(savedAuction);
    }

    @Override
    public PageResponse<AuctionResponse> getCategoryAuctions(Integer categoryId, int pageNum, int pageSize) {
        Category category = findPublishedCategory(categoryId);
        Page<Auction> auctionPage = auctionRepository.findAll(
                specification.getCategoryAuctionsSpec(category.getId()),
                PageRequest.of(pageNum - 1, pageSize)
        );
        return PageMapper.toPageResponse(auctionPage, this::mapToResponse);
    }

    @Override
    public AuctionDetails getPublishedAuction(Long id) {
        Auction auction = auctionRepository.findActiveAuctionById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, id));
        Bid highestBid = null;
        if (auction.isEnglishAuction()){
            highestBid = bidRepository.findHighestBidByAuctionId(auction.getId())
                    .orElse(null);
        }
        return AuctionMapper.INSTANCE.toAuctionDetails(auction, highestBid);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AuctionDetailsGet getAuctionDetails(Long id) {
        Auction auction = auctionRepository.findAuctionDetailsById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, id));
        AuctionDetailsDto dto = AuctionMapper.INSTANCE.toAuctionDetailsDto(auction);
        BidResponse highestBid = null;
        if (auction.isEnglishAuction()){
            Bid bid = bidRepository.findHighestBidByAuctionId(auction.getId())
                    .orElse(null);
            highestBid = BidMapper.INSTANCE.toResponse(bid);
        }
        return new AuctionDetailsGet(dto, highestBid);
    }

    @Override
    public AuctionDetailsGet getSellerAuctionDetails(Long sellerId, Long auctionId) {
        Auction auction = auctionRepository.findAuctionDetailsByIdAndSellerId(auctionId, sellerId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, auctionId));
        AuctionDetailsDto dto = AuctionMapper.INSTANCE.toSellerAuctionDetailsDto(auction);
        BidResponse highestBid = null;
        if (auction.isEnglishAuction()){
            Bid bid = bidRepository.findHighestBidByAuctionId(auction.getId())
                    .orElse(null);
            highestBid = BidMapper.INSTANCE.toResponse(bid);
        }
        return new AuctionDetailsGet(dto, highestBid);
    }

    private Category findPublishedCategory(Integer categoryId){
        return categoryRepository.findPublishedCategoryById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category with id=%s not found".formatted(categoryId)));
    }

    private AuctionResponse mapToResponse(Auction auction) {
        AuctionResponse response = AuctionMapper.INSTANCE.toResponse(auction);
        if (auction.isEnglishAuction()) {
            long numBids = bidRepository.countBidsByAuctionId(auction.getId());
            response.setNumBids(numBids);
        }
        return response;
    }
}
