package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.category.CategoryDetailsDto;
import com.xdpsx.auction.dto.category.CategoryRequest;
import com.xdpsx.auction.dto.category.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> listPublishedCategories();
    CategoryDetailsDto getCategoryById(Integer id);
    PageResponse<CategoryDetailsDto> getPageCategories(int pageNum, int pageSize, String keyword, String sort, Boolean hasPublished);
    CategoryDetailsDto createCategory(CategoryRequest request);
    CategoryDetailsDto updateCategory(Integer id, CategoryRequest request);
    void deleteCategory(Integer id);
}
