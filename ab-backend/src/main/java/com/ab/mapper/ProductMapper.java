package com.ab.mapper;

import org.springframework.stereotype.Component;
import com.ab.dto.ProductDTO;
import com.ab.model.Product;
import com.ab.model.Category;

/**
 * Mapper component for converting between Product entity and ProductDTO.
 * Handles the transformation of data between persistence layer and API layer.
 */
@Component
public class ProductMapper {

    /**
     * Converts Product entity to ProductDTO.
     *
     * @param product the product entity
     * @return the product DTO
     */
    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        return ProductDTO.builder()
                .id(product.getId())
                .title(product.getTitle())
                .casNumber(product.getCasNumber())
                .imageUrl(product.getImageUrl())
                .description(product.getDescription())
                .slug(product.getSlug())
                .anchor(product.getAnchor())
                .categoryId(product.getCategoryEntity() != null ? product.getCategoryEntity().getId() : null)
                .categoryName(product.getCategory())
                .build();
    }

    /**
     * Converts ProductDTO to Product entity.
     *
     * @param productDTO the product DTO
     * @return the product entity
     */
    public Product toEntity(ProductDTO productDTO) {
        if (productDTO == null) {
            return null;
        }

        Product product = new Product();
        product.setId(productDTO.getId());
        product.setTitle(productDTO.getTitle());
        product.setCasNumber(productDTO.getCasNumber());
        product.setImageUrl(productDTO.getImageUrl());
        product.setDescription(productDTO.getDescription());
        product.setSlug(productDTO.getSlug());
        product.setAnchor(productDTO.getAnchor());
        product.setCategoryName(productDTO.getCategoryName());

        return product;
    }

    /**
     * Updates an existing product entity with data from DTO.
     *
     * @param productDTO the source DTO
     * @param product the target entity to update
     */
    public void updateEntityFromDTO(ProductDTO productDTO, Product product) {
        if (productDTO == null || product == null) {
            return;
        }

        product.setTitle(productDTO.getTitle());
        product.setCasNumber(productDTO.getCasNumber());
        product.setImageUrl(productDTO.getImageUrl());
        product.setDescription(productDTO.getDescription());
        product.setSlug(productDTO.getSlug());
        product.setAnchor(productDTO.getAnchor());
        product.setCategoryName(productDTO.getCategoryName());
    }
}
