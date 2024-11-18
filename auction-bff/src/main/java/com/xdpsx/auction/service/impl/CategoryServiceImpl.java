package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.category.CategoryDetailsDto;
import com.xdpsx.auction.dto.category.CategoryRequest;
import com.xdpsx.auction.dto.category.CategoryResponse;
import com.xdpsx.auction.exception.InUseException;
import com.xdpsx.auction.exception.DuplicateException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.Category;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.repository.CategoryRepository;
import com.xdpsx.auction.repository.specification.SimpleSpecification;
import com.xdpsx.auction.service.CategoryService;
import com.xdpsx.auction.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final PageMapper pageMapper;
    private final MediaService mediaService;
    private final CategoryRepository categoryRepository;
    private final SimpleSpecification<Category> specification;

    @Override
    public List<CategoryResponse> listPublishedCategories() {
        return categoryRepository.findPublishedCategories().stream()
                .map(CategoryResponse::fromModel)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public CategoryDetailsDto getCategoryById(Integer id) {
        Category category = fetchCategory(id);
        return CategoryDetailsDto.fromModel(category);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<CategoryDetailsDto> getPageCategories(int pageNum, int pageSize,
                                                              String keyword, String sort, Boolean published) {
        Page<Category> categoryPage = categoryRepository.findAll(
                specification.getSimpleSpec(keyword, sort, published),
                PageRequest.of(pageNum - 1, pageSize)
        );
        return pageMapper.toPageCategoryResponse(categoryPage);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public CategoryDetailsDto createCategory(CategoryRequest request) {
        checkNameExists(request.getName());
        checkSlugExists(request.getSlug());
        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .published(request.isPublished())
                .build();
        if (request.getImageId() != null){
            Media image = mediaService.getMedia(request.getImageId());
            category.setImage(image);
        }
        Category savedCategory = categoryRepository.save(category);
        return CategoryDetailsDto.fromModel(savedCategory);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Override
    public CategoryDetailsDto updateCategory(Integer id, CategoryRequest request) {
        Category categoryToEdit = fetchCategory(id);

        if (!categoryToEdit.getName().equals(request.getName())){
            checkNameExists(request.getName());
        }
        if (!categoryToEdit.getSlug().equals(request.getSlug())){
            checkSlugExists(request.getSlug());
        }
        categoryToEdit.setName(request.getName());
        categoryToEdit.setSlug(request.getSlug());
        categoryToEdit.setPublished(request.isPublished());

        // Update file
        if (request.getImageId() != null){
            mediaService.deleteMedia(categoryToEdit.getImage().getId());
            Media image = mediaService.getMedia(request.getImageId());
            categoryToEdit.setImage(image);
        }
        Category updatedCategory = categoryRepository.save(categoryToEdit);
        return CategoryDetailsDto.fromModel(updatedCategory);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Override
    public void deleteCategory(Integer id) {
        Category category = fetchCategory(id);
        long countCategories = categoryRepository.countCategoriesUsed(category.getId());
        if (countCategories > 0){
            throw new InUseException(ErrorCode.CATEGORY_IN_USE, category.getName());
        }
        categoryRepository.delete(category);
        mediaService.deleteMedia(category.getImage().getId());
    }

    private Category fetchCategory(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.CATEGORY_NOT_FOUND, id));
    }

    private void checkSlugExists(String slug) {
        if (categoryRepository.existsBySlug(slug)){
            throw new DuplicateException(ErrorCode.SLUG_DUPLICATED, slug);
        }
    }

    private void checkNameExists(String name) {
        if (categoryRepository.existsByName(name)){
            throw new DuplicateException(ErrorCode.NAME_DUPLICATED, name);
        }
    }
}
