package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.AuctionInvertedIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface AuctionInvertedIndexRepository extends JpaRepository<AuctionInvertedIndex, String> {
    @Query("SELECT a.term FROM AuctionInvertedIndex a")
    Set<String> findAllTerms();

    @Query("SELECT a.term FROM AuctionInvertedIndex a " +
            "WHERE LENGTH(a.term) BETWEEN :minLength AND :maxLength " +
            "AND a.term LIKE :prefix%")
    Set<String> findTermsByLengthAndPrefix(@Param("minLength") int minLength,
                                           @Param("maxLength") int maxLength,
                                           @Param("prefix") String prefix);

    @Query("SELECT a.term FROM AuctionInvertedIndex a WHERE a.term LIKE %:prefix%")
    Set<String> findTermsByPrefix(@Param("prefix") String prefix);
}
