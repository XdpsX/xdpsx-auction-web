package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer>, JpaSpecificationExecutor<Category> {
    @Query("SELECT c FROM Category c WHERE c.published = true")
    List<Category> findPublishedCategories();

    boolean existsByName(String name);
    boolean existsBySlug(String slug);

    @Query("SELECT c FROM Category c WHERE c.published = true AND c.id = :id")
    Optional<Category> findPublishedCategoryById(Integer id);

//    @Query("SELECT COUNT(a) + COUNT(t) FROM Auction a JOIN a.category c ON c.id = :categoryId " +
//            "LEFT JOIN Test t ON t.category.id = c.id WHERE c.id = :categoryId")
    @Query("SELECT COUNT(a.id) FROM Category c " +
            "JOIN Auction a ON c.id = a.category.id " +
//            "JOIN Test t ON t.category.id = c.id " +
            "WHERE c.id = :categoryId")
    long countCategoriesUsed(@Param("categoryId") Integer categoryId);
}
