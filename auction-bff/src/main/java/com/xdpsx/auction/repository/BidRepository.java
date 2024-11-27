package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.enums.BidStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {
    @Query("SELECT b FROM Bid b WHERE " +
            "b.auction.id = :auctionId AND " +
            "b.status = 'ACTIVE' " +
            "ORDER BY b.amount DESC LIMIT 1")
    Optional<Bid> findHighestBidByAuctionId(@Param("auctionId") Long auctionId);

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
}
