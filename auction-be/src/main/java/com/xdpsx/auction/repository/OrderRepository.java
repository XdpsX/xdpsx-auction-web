package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Order;
import com.xdpsx.auction.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE " +
            "(:number IS NULL OR o.trackNumber LIKE %:number%) AND " +
            "(:status IS NULL OR o.status = :status)")
    Page<Order> findPageOrders(
            @Param("number") String number,
            @Param("status") OrderStatus status,
            Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
            "o.user.id = :userId AND " +
            "(:number IS NULL OR o.trackNumber LIKE %:number%) AND " +
            "(:status IS NULL OR o.status = :status)")
    Page<Order> findUserOrders(
            @Param("userId") Long userId,
            @Param("number") String number,
            @Param("status") OrderStatus status,
            Pageable pageable);

//    @Query("SELECT o FROM Order o WHERE " +
//            "o.user.id = :userId AND " +
//            "(:number IS NULL OR o.trackNumber LIKE %:number%) AND " +
//            "(:statuses IS NULL OR o.status IN :statuses)")
//    Page<Order> findUserOrders(
//            @Param("userId") Long userId,
//            @Param("number") String number,
//            @Param("statuses") List<OrderStatus> statuses,
//            Pageable pageable);

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

    Optional<Order> findByIdAndUserId(Long orderId, Long userId);

    Optional<Order> findByIdAndSellerId(Long orderId, Long sellerId);

    @Query("SELECT o FROM Order o WHERE " +
            "o.status = :status AND " +
            "o.updatedAt < :timeAgo")
    List<Order> findOrderOlderThanAndWithStatus(
            @Param("status") OrderStatus status,
            @Param("timeAgo") ZonedDateTime timeAgo
    );

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.id = :orderId AND o.status = :status")
    Optional<Order> findByUserIdAndOrderIdAndStatus(@Param("userId") Long userId,
                                                @Param("orderId") Long orderId,
                                                @Param("status") OrderStatus status);

    @Query("SELECT o FROM Order o " +
            "WHERE o.status = :status " +
            "AND o.updatedAt >= :startDate")
    List<Order> findCompletedOrdersSince(@Param("status") OrderStatus status,
                                         @Param("startDate") ZonedDateTime startDate);

    @Query("SELECT o FROM Order o " +
            "WHERE o.status = :status " +
            "AND o.updatedAt >= :startDate " +
            "AND o.seller.id = :sellerId")
    List<Order> findCompletedOrdersForSellerSince(@Param("status") OrderStatus status,
                                    @Param("startDate") ZonedDateTime startDate,
                                    @Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE FUNCTION('MONTH', o.createdAt) = :month " +
            "AND FUNCTION('YEAR', o.createdAt) = :year")
    long countByCreatedAtMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE FUNCTION('MONTH', o.createdAt) = :month " +
            "AND FUNCTION('YEAR', o.createdAt) = :year " +
            "AND o.seller.id = :sellerId")
    long countByCreatedAtMonthAndSellerId(@Param("month") int month, @Param("year") int year,
                                                @Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.seller.id = :sellerId")
    long countBySellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT o FROM Order o " +
            "WHERE o.status = :status " +
            "AND o.updatedAt >= :since " +
            "AND o.seller.id = :sellerId")
    List<Order> findCancelledOrdersForSellerSince(OrderStatus status, ZonedDateTime since, Long sellerId);
}
