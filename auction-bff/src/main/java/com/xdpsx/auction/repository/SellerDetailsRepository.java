package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.SellerDetails;
import com.xdpsx.auction.model.enums.SellerRegisterStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SellerDetailsRepository extends JpaRepository<SellerDetails, Long> {
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SellerDetails s WHERE s.user.id = :userId")
    boolean existsByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM SellerDetails s " +
            "JOIN FETCH s.user u WHERE " +
            "s.status <> 'PENDING' AND" +
            "(:name IS NULL OR s.name LIKE %:name%) AND " +
            "(:status IS NULL OR s.status = :status)")
    Page<SellerDetails> searchSellers(
            @Param("name") String name,
            @Param("status") SellerRegisterStatus status,
            Pageable pageable);

    @Query("SELECT sd FROM SellerDetails sd JOIN FETCH sd.user WHERE sd.id = :id")
    Optional<SellerDetails> findByIdWithUser(Long id);

    @Query("SELECT s FROM SellerDetails s " +
            "JOIN FETCH s.user u WHERE " +
            "s.status = 'PENDING' AND" +
            "(:name IS NULL OR s.name LIKE %:name%)")
    Page<SellerDetails> searchSellerRegister(@Param("name") String name, Pageable pageable);
}
