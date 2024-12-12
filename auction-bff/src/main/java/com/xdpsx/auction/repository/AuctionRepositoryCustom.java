package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Auction;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface AuctionRepositoryCustom {
    List<Long> findIdsBySpecification(Specification<Auction> spec);
}
