package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Order;
import com.xdpsx.auction.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o WHERE " +
            "o.user.id = :userId AND " +
            "(:number IS NULL OR o.trackNumber LIKE %:number%) AND " +
            "(:status IS NULL OR o.status = :status)")
    Page<Order> findUserOrders(
            @Param("userId") Long userId,
            @Param("number") String number,
            @Param("status") OrderStatus status,
            Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
            "o.seller.id = :sellerId AND " +
            "(:number IS NULL OR o.trackNumber LIKE %:number%) AND " +
            "(:status IS NULL OR o.status = :status)")
    Page<Order> findSellerOrders(
            @Param("sellerId") Long sellerId,
            @Param("number") String number,
            @Param("status") OrderStatus status,
            Pageable pageable
    );
}
