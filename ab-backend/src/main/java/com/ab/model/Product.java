package com.ab.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "cas_number")
    private String casNumber;

    private String imageUrl;

    @Column(length = 2000)
    private String description;

    @Column
    private String slug;

    @Column(name = "anchor")
    private String anchor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"products"})
    private Category category;

    // Keep legacy category field for backward compatibility
    @Column(name = "category_name")
    private String categoryName;

    public Product() {
    }

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCasNumber() {
        return casNumber;
    }

    public void setCasNumber(String casNumber) {
        this.casNumber = casNumber;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getAnchor() {
        return anchor;
    }

    public void setAnchor(String anchor) {
        this.anchor = anchor;
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

    // Legacy method for backward compatibility - returns category name as string
    public String getCategory() {
        return categoryName != null ? categoryName : (category != null ? category.getName() : null);
    }

    public void setCategory(String category) {
        this.categoryName = category;
    }
}


