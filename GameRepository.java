package com.gamevault.repository;

import com.gamevault.model.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    
    Page<Game> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<Game> findByCategoryIgnoreCase(String category, Pageable pageable);
    
    @Query("SELECT g FROM Game g WHERE LOWER(g.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(g.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Game> searchGames(String query, Pageable pageable);
    
    List<Game> findTop6ByOrderByDownloadCountDesc();
    
    List<Game> findTop6ByOrderByCreatedAtDesc();
}