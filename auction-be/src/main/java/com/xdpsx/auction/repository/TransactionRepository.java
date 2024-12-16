package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.Transaction;
import com.xdpsx.auction.model.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE " +
            "t.wallet.id = :walletId" +
            " AND (:type IS NULL OR t.type = :type)")
    Page<Transaction> findWalletTransactions(@Param("walletId") Long walletId,
                           @Param("type") TransactionType type,
                           Pageable pageable);
}
