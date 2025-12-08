package com.ab.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Product entity representing a chemical product in the inventory.
 */
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_category_id", columnList = "category_id"),
    @Index(name = "idx_title", columnList = "title"),
    @Index(name = "idx_slug", columnList = "slug")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    @NotBlank(message = "Product title is required")
    private String title;

    @Column(name = "cas_number", length = 50)
    private String casNumber;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(length = 2000, columnDefinition = "TEXT")
    private String description;

    @Column(length = 255, unique = true)
    private String slug;

    @Column(length = 255)
    private String anchor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"products"})
    private Category category;

    @Column(name = "category_name", length = 100)
    @ToString.Exclude
    private String categoryName;

    public Product(String title, String casNumber, String imageUrl, String description, String category) {
        this.title = title;
        this.casNumber = casNumber;
        this.imageUrl = imageUrl;
        this.description = description;
        this.categoryName = category;
    }

    public Product(String title, String slug, String anchor, Category category) {
        this.title = title;
        this.slug = slug;
        this.anchor = anchor;
        this.category = category;
        this.categoryName = category != null ? category.getName() : null;
    }

    public String getCategory() {
        return categoryName != null ? categoryName : (category != null ? category.getName() : null);
    }

    public void setCategory(String category) {
        this.categoryName = category;
    }

    public Category getCategoryEntity() {
        return category;
    }

    public void setCategoryEntity(Category category) {
        this.category = category;
        if (category != null) {
            this.categoryName = category.getName();
        }
    }
}



