package com.xdpsx.auction.repository;

import com.xdpsx.auction.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
//    @Query("SELECT COUNT(u.id) > 0 FROM User u WHERE u.email=:email AND u.enabled IS TRUE")
//    boolean isEmailRegister(String email);

    Optional<User> findByEmail(String email);
}
