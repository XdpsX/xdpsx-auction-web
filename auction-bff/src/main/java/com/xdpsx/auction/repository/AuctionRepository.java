package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Long>,
        JpaSpecificationExecutor<Auction> {
    @Query("SELECT a FROM Auction a " +
            "JOIN FETCH a.mainImage " +
            "LEFT JOIN FETCH a.images " +
            "JOIN FETCH a.seller " +
            "JOIN FETCH a.category " +
            "WHERE a.id = :id " +
            "AND a.trashed = false " +
            "AND a.published = true " +
            "AND a.endingTime > CURRENT_TIMESTAMP")
    Optional<Auction> findActiveAuctionById(@Param("id") Long id);
}
