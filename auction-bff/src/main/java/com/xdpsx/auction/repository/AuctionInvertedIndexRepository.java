package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.AuctionInvertedIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface AuctionInvertedIndexRepository extends JpaRepository<AuctionInvertedIndex, String> {
    @Query("SELECT a.term FROM AuctionInvertedIndex a")
    Set<String> findAllTerms();
}
