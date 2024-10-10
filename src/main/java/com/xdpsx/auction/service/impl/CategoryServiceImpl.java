package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.category.CategoryRequest;
import com.xdpsx.auction.dto.category.CategoryResponse;
import com.xdpsx.auction.exception.DuplicateException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.Category;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.repository.CategoryRepository;
import com.xdpsx.auction.service.CategoryService;
import com.xdpsx.auction.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.xdpsx.auction.constant.FileConstants.CATEGORY_IMAGE_FOLDER;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final MediaService mediaService;
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> listPublishedCategories() {
        return categoryRepository.findPublishedCategories().stream()
                .map(CategoryResponse::fromModel)
                .toList();
    }

    @Transactional
    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())){
            throw new DuplicateException("Category name=%s already exists".formatted(request.getName()));
        }
        if (categoryRepository.existsBySlug(request.getSlug())){
            throw new DuplicateException("Category slug=%s already exists".formatted(request.getSlug()));
        }
        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .isPublished(request.isPublished())
                .build();
        if (request.getFile() != null){
            Media image = mediaService.saveMedia(request.getFile(), CATEGORY_IMAGE_FOLDER);
            category.setImage(image);
        }
        Category savedCategory = categoryRepository.save(category);
        return CategoryResponse.fromModel(savedCategory);
    }

    @Transactional
    @Override
    public CategoryResponse updateCategory(Integer id, CategoryRequest request) {
        Category existingCat = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category with id=%s not found".formatted(id)));

        // Update name
        if (!existingCat.getName().equals(request.getName())){
            if (categoryRepository.existsByName(request.getName())){
                throw new DuplicateException("Category with name=%s already exists".formatted(request.getName()));
            }
            existingCat.setName(request.getName());
        }

        // Update slug
        if (!existingCat.getSlug().equals(request.getSlug())){
            if (categoryRepository.existsBySlug(request.getSlug())){
                throw new DuplicateException("Category with slug=%s already exists".formatted(request.getSlug()));
            }
            existingCat.setSlug(request.getSlug());
        }

        existingCat.setPublished(request.isPublished());

        // Update file
        if (request.getFile() != null){
            mediaService.deleteMedia(existingCat.getImage().getId());
            Media image = mediaService.saveMedia(request.getFile(), CATEGORY_IMAGE_FOLDER);
            existingCat.setImage(image);
        }
        Category savedCategory = categoryRepository.save(existingCat);
        return CategoryResponse.fromModel(savedCategory);
    }

    @Transactional
    @Override
    public void deleteCategory(Integer id) {
        Category existingCat = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category with id=%s not found".formatted(id)));
        categoryRepository.delete(existingCat);
        mediaService.deleteMedia(existingCat.getImage().getId());
    }
}
