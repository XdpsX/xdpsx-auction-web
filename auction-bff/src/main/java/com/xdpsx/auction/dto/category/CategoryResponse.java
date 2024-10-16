package com.xdpsx.auction.dto.category;

import com.xdpsx.auction.model.Category;

public record CategoryResponse(
        Integer id,
        String name,
        String slug,
        String imgUrl
) {
    public static CategoryResponse fromModel(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getSlug(), category.getImgUrl());
    }
}
