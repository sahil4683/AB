package com.ab.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Category entity representing a product category.
 */
@Entity
@Table(name = "categories", indexes = {
    @Index(name = "idx_slug", columnList = "slug"),
    @Index(name = "idx_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    @NotBlank(message = "Category name is required")
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    @NotBlank(message = "Category slug is required")
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Category URL is required")
    private String url;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"category"})
    @ToString.Exclude
    @Builder.Default
    private List<Product> products = new ArrayList<>();

    public Category(String name, String slug, String url) {
        this.name = name;
        this.slug = slug;
        this.url = url;
        this.products = new ArrayList<>();
    }
}
