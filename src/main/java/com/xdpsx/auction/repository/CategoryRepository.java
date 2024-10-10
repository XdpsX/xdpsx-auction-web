package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    @Query("SELECT c FROM Category c WHERE c.isPublished = true")
    List<Category> findPublishedCategories();

    boolean existsByName(String name);
    boolean existsBySlug(String slug);
}
