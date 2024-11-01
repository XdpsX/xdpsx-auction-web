package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AuctionRepository extends JpaRepository<Auction, Long>,
        JpaSpecificationExecutor<Auction> {
}
