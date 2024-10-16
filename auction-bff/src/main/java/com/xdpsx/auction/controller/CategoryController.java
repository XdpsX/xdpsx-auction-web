package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.category.CategoryRequest;
import com.xdpsx.auction.dto.category.CategoryResponse;
import com.xdpsx.auction.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/categories")
    ResponseEntity<List<CategoryResponse>> listPublishedCategories(){
        List<CategoryResponse> response = categoryService.listPublishedCategories();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/categories")
    ResponseEntity<CategoryResponse> createCategory(@Valid @ModelAttribute CategoryRequest request){
        CategoryResponse response = categoryService.createCategory(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/categories/{id}")
    ResponseEntity<CategoryResponse> updateCategory(@PathVariable Integer id,
                                                    @Valid @ModelAttribute CategoryRequest request){
        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/categories/{id}")
    ResponseEntity<Void> deleteCategory(@PathVariable Integer id){
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
