package com.gamevault.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.util.List;

@Data
public class GameUploadRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must be less than 2000 characters")
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Platform is required")
    private String platform;
    
    private List<String> tags;
    
    private String version;
}