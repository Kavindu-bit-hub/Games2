package com.gamevault.repository;

import com.gamevault.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByGameIdOrderByCreatedAtDesc(Long gameId);
    boolean existsByGameIdAndUserId(Long gameId, Long userId);
}