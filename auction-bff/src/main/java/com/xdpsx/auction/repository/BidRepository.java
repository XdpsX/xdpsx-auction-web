package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.enums.BidStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long>, JpaSpecificationExecutor<Bid> {
    @Query("SELECT b FROM Bid b WHERE " +
            "b.auction.id = :auctionId AND " +
            "b.status = 'ACTIVE' " +
            "ORDER BY b.amount DESC LIMIT 1")
    Optional<Bid> findHighestBidByAuctionId(@Param("auctionId") Long auctionId);

    default boolean isHighestBid(Long bidId, Long auctionId) {
        Optional<Bid> highestBid = findHighestBidByAuctionId(auctionId);
        return highestBid.isPresent() && highestBid.get().getId().equals(bidId);
    }

    @Query("SELECT b FROM Bid b WHERE " +
            "b.auction.id = :auctionId AND " +
            "b.status = 'ACTIVE' " +
            "ORDER BY b.amount DESC")
    List<Bid> findBidsByAuctionIdOrderByAmountDesc(@Param("auctionId") Long auctionId);

    @Query("SELECT b FROM Bid b WHERE " +
            "b.auction.id = :auctionId AND " +
            "b.bidder.id = :userId AND " +
            "b.status = :status " +
            "ORDER BY b.amount DESC")
    List<Bid> findBidsWithStatusAndAuctionAndUser(@Param("auctionId") Long auctionId,
                                                 @Param("userId") Long userId,
                                                 @Param("status") BidStatus status);

    Optional<Bid> findByBidderIdAndAuctionId(Long bidderId, Long auctionId);

    @Query("SELECT b FROM Bid b WHERE b.bidder.id = :bidderId" +
            " AND (:status IS NULL OR b.status = :status)")
    Page<Bid> findUserBids(@Param("bidderId") Long bidderId,
                           @Param("status") BidStatus status,
                           Pageable pageable);

    @Query("SELECT b FROM Bid b WHERE " +
            "b.id = :id AND " +
            "b.bidder.id = :bidderId AND " +
            "b.status = :status" )
    Optional<Bid> findByIdAndBidderAndStatus(
            @Param("id") Long id,
            @Param("bidderId") Long bidderId,
            @Param("status") BidStatus status);

    @Query("SELECT b FROM Bid b WHERE " +
            "b.status = :status AND " +
            "b.updatedAt < :timeAgo")
    List<Bid> findBidsOlderThanAndWithStatus(
            @Param("status") BidStatus status,
            @Param("timeAgo") ZonedDateTime timeAgo
    );

    @Query("SELECT COUNT(b) FROM Bid b WHERE b.auction.id = :auctionId")
    long countBidsByAuctionId(@Param("auctionId") Long auctionId);
}
