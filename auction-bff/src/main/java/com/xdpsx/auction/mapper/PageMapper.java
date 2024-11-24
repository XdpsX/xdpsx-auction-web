package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.AuctionDto;
import com.xdpsx.auction.dto.auction.AuctionResponse;
import com.xdpsx.auction.dto.category.CategoryDetailsDto;
import com.xdpsx.auction.dto.notification.NotificationDto;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.Category;
import com.xdpsx.auction.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PageMapper {

    public PageResponse<CategoryDetailsDto> toPageCategoryResponse(Page<Category> categoryPage){
        return toPageResponse(categoryPage, CategoryDetailsDto::fromModel);
    }

    public PageResponse<AuctionDto> toPageAuctionDto(Page<Auction> auctionPage,
                                                     Function<Auction, AuctionDto> mapper){
        return toPageResponse(auctionPage, mapper);
    }
    public PageResponse<AuctionResponse> toPageAuctionResponse(Page<Auction> auctionPage,
                                                     Function<Auction, AuctionResponse> mapper){
        return toPageResponse(auctionPage, mapper);
    }
    public PageResponse<NotificationDto> toPageNotificationResponse(Page<Notification> page,
                                                               Function<Notification, NotificationDto> mapper){
        return toPageResponse(page, mapper);
    }

    private <T, R> PageResponse<R> toPageResponse(Page<T> page, Function<T, R> mapper) {
        List<R> responses = page.getContent().stream()
                .map(mapper)
                .collect(Collectors.toList());
        return PageResponse.<R>builder()
                .items(responses)
                .pageNum(page.getNumber() + 1)
                .pageSize(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
