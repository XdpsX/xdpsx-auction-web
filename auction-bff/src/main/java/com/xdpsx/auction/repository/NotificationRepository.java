package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n WHERE " +
            "(n.type = 'AUCTION' AND n.user.id = :userId) OR " +
            "(n.type <> 'AUCTION') " +
            "ORDER BY n.createdAt DESC")
    Page<Notification> findUserNotifications(@Param("userId") Long userId, Pageable pageable);
}
