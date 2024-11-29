package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
