package com.ab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for Product entity.
 * Used for API requests and responses to decouple the entity from external interfaces.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    @NotBlank(message = "Product title is required")
    @Size(min = 3, max = 255, message = "Product title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "CAS number is required")
    @Size(min = 3, max = 50, message = "CAS number must be between 3 and 50 characters")
    private String casNumber;

    private String imageUrl;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private String slug;

    private String anchor;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String categoryName;

    private Long createdBy;

    private Long lastModifiedBy;
}
