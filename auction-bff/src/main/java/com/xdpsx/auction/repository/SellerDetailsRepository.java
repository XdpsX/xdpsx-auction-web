package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.SellerDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SellerDetailsRepository extends JpaRepository<SellerDetails, Long> {
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SellerDetails s WHERE s.user.id = :userId")
    boolean existsByUserId(@Param("userId") Long userId);
}
