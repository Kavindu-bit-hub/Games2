package com.gamevault.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class GameResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String platform;
    private List<String> tags;
    private String version;
    private Long fileSize;
    private String thumbnailUrl;
    private List<String> screenshots;
    private LocalDateTime createdAt;
    private Integer downloadCount;
    private Double averageRating;
    private Integer reviewCount;
    private AuthorInfo author;
    
    @Data
    public static class AuthorInfo {
        private Long id;
        private String fullName;
        private String avatarUrl;
    }
}