package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
//    @Query("SELECT COUNT(u.id) > 0 FROM User u WHERE u.email=:email AND u.enabled IS TRUE")
//    boolean isEmailRegister(String email);

    Optional<User> findByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u " +
            "WHERE FUNCTION('MONTH', u.createdAt) = :month " +
            "AND FUNCTION('YEAR', u.createdAt) = :year")
    long countByCreatedAtMonth(@Param("month") int month, @Param("year") int year);
}
