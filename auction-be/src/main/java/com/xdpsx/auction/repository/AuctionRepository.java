package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.enums.AuctionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Long>,
        JpaSpecificationExecutor<Auction>, AuctionRepositoryCustom {
    @Query("SELECT a FROM Auction a " +
            "JOIN FETCH a.mainImage " +
            "LEFT JOIN FETCH a.images " +
            "JOIN FETCH a.seller " +
            "JOIN FETCH a.category " +
            "WHERE a.id = :id " +
            "AND a.trashed = false " +
            "AND a.published = true")
    Optional<Auction> findActiveAuctionById(@Param("id") Long id);

    @Query("SELECT a FROM Auction a " +
            "JOIN FETCH a.mainImage " +
            "LEFT JOIN FETCH a.images " +
            "JOIN FETCH a.seller " +
            "JOIN FETCH a.category " +
            "WHERE a.id = :id")
    Optional<Auction> findAuctionDetailsById(@Param("id") Long id);

    @Query("SELECT a FROM Auction a " +
            "JOIN FETCH a.mainImage " +
            "LEFT JOIN FETCH a.images " +
            "JOIN FETCH a.seller " +
            "JOIN FETCH a.category " +
            "WHERE a.id = :auctionId " +
            "AND a.seller.id = :sellerId " +
            "AND a.trashed = false")
    Optional<Auction> findAuctionDetailsByIdAndSellerId(
            @Param("auctionId") Long auctionId,
            @Param("sellerId") Long sellerId
    );

    @Query("SELECT a FROM Auction a " +
            "JOIN FETCH a.seller " +
            "WHERE a.id = :id " +
            "AND a.trashed = false " +
            "AND a.published = true " +
            "AND a.startingTime < CURRENT_TIMESTAMP " +
            "AND a.endingTime > CURRENT_TIMESTAMP")
    Optional<Auction> findLiveAuction(@Param("id") Long id);

    @Query("SELECT a FROM Auction a " +
            "JOIN FETCH a.seller " +
            "WHERE a.id = :id " +
            "AND a.trashed = false " +
            "AND a.published = true " +
            "AND a.startingTime < CURRENT_TIMESTAMP " +
            "AND a.endingTime > CURRENT_TIMESTAMP " +
            "AND a.type = :type")
    Optional<Auction> findLiveAuction(@Param("id") Long id, @Param("type") AuctionType type);

    @Query("SELECT a FROM Auction a " +
            "WHERE a.status = 'LIVE' " +
            "AND a.endingTime < CURRENT_TIMESTAMP")
    List<Auction> findEndingAuction();

    @Query("SELECT COUNT(a) FROM Auction a WHERE a.seller.id = :sellerId")
    long countBySellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(a) FROM Auction a " +
            "WHERE FUNCTION('MONTH', a.createdAt) = :month " +
            "AND FUNCTION('YEAR', a.createdAt) = :year")
    long countByCreatedAtMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT COUNT(a) FROM Auction a " +
            "WHERE FUNCTION('MONTH', a.createdAt) = :month " +
            "AND FUNCTION('YEAR', a.createdAt) = :year " +
            "AND a.seller.id = :sellerId " +
            "AND a.trashed = false " +
            "AND a.published = true")
    long countByCreatedAtMonthAndSellerId(@Param("month") int month, @Param("year") int year,
                                          @Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(a) FROM Auction a WHERE a.type = :type")
    long countAuctionsByType(@Param("type") AuctionType type);

    @Query("SELECT COUNT(a) FROM Auction a " +
            "WHERE a.seller.id = :sellerId AND a.type = :type")
    long countAuctionsBySellerIdAndType(@Param("sellerId") Long sellerId, @Param("type") AuctionType type);
}
