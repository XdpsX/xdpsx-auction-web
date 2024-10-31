package com.xdpsx.auction.dto.category;

import com.xdpsx.auction.model.Category;

public record CategoryDetailsDto(
        Integer id,
        String name,
        String slug,
        boolean published,
        String imgUrl
) {
    public static CategoryDetailsDto fromModel(Category category) {
        return new CategoryDetailsDto(category.getId(), category.getName(), category.getSlug(),
                category.isPublished(), category.getImgUrl());
    }
}
