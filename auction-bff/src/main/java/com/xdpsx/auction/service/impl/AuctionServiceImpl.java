package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.auction.AuctionCreateDto;
import com.xdpsx.auction.dto.auction.AuctionDto;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.AuctionMapper;
import com.xdpsx.auction.model.*;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.CategoryRepository;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.AuctionService;
import com.xdpsx.auction.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.xdpsx.auction.constant.FileConstants.AUCTION_IMAGE_FOLDER;
import static com.xdpsx.auction.constant.FileConstants.AUCTION_IMAGE_MIN_WIDTH;

@Service
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService {
    private final AuctionMapper auctionMapper;
    private final UserContext userContext;
    private final MediaService mediaService;
    private final CategoryRepository categoryRepository;
    private final AuctionRepository auctionRepository;

    @Override
    public AuctionDto createAuction(AuctionCreateDto request) {
        Auction auction = auctionMapper.fromCreateDtoToEntity(request);

        Category category = findPublishedCategory(request.getCategoryId());
        auction.setCategory(category);

        List<AuctionImage> images = request.getFiles().stream().map(file -> {
            Media media = mediaService.saveMedia(file, AUCTION_IMAGE_FOLDER, AUCTION_IMAGE_MIN_WIDTH);
            return AuctionImage.builder()
                    .auction(auction)
                    .media(media).build();
        }).toList();
        auction.setImages(images);

        User seller = userContext.getLoggedUser();
        auction.setSeller(seller);

        Auction savedAuction = auctionRepository.save(auction);
        return auctionMapper.fromEntityToDto(savedAuction);
    }

    private Category findPublishedCategory(Integer categoryId){
        return categoryRepository.findPublishedCategoryById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category with id=%s not found".formatted(categoryId)));
    }
}
