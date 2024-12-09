package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.AuctionInvertedIndex;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionInvertedIndexRepository extends JpaRepository<AuctionInvertedIndex, String> {
}
