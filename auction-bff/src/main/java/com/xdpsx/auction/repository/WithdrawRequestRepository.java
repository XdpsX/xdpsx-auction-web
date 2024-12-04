package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.WithdrawRequest;
import com.xdpsx.auction.model.enums.WithdrawStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WithdrawRequestRepository extends JpaRepository<WithdrawRequest, Long> {
    @Query("SELECT wr FROM WithdrawRequest wr WHERE " +
            "wr.user.id = :userId" +
            " AND (:status IS NULL OR wr.status = :status)")
    Page<WithdrawRequest> findByUserIdAndOptionalStatus(@Param("userId") Long userId,
                                                        @Param("status") WithdrawStatus status,
                                                        Pageable pageable);

    Optional<WithdrawRequest> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT wr FROM WithdrawRequest wr WHERE wr.status IN :statuses")
    Page<WithdrawRequest> findByStatusIn(
            @Param("statuses") List<WithdrawStatus> statuses,
            Pageable pageable
    );
}
