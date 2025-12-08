package com.ab.mapper;

import org.springframework.stereotype.Component;
import com.ab.dto.CategoryDTO;
import com.ab.model.Category;

/**
 * Mapper component for converting between Category entity and CategoryDTO.
 * Handles the transformation of data between persistence layer and API layer.
 */
@Component
public class CategoryMapper {

    /**
     * Converts Category entity to CategoryDTO.
     *
     * @param category the category entity
     * @return the category DTO
     */
    public CategoryDTO toDTO(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .url(category.getUrl())
                .productIds(category.getProducts() != null ?
                        category.getProducts().stream()
                                .map(p -> p.getId())
                                .toList() : null)
                .build();
    }

    /**
     * Converts CategoryDTO to Category entity.
     *
     * @param categoryDTO the category DTO
     * @return the category entity
     */
    public Category toEntity(CategoryDTO categoryDTO) {
        if (categoryDTO == null) {
            return null;
        }

        Category category = new Category();
        category.setId(categoryDTO.getId());
        category.setName(categoryDTO.getName());
        category.setSlug(categoryDTO.getSlug());
        category.setUrl(categoryDTO.getUrl());

        return category;
    }

    /**
     * Updates an existing category entity with data from DTO.
     *
     * @param categoryDTO the source DTO
     * @param category the target entity to update
     */
    public void updateEntityFromDTO(CategoryDTO categoryDTO, Category category) {
        if (categoryDTO == null || category == null) {
            return;
        }

        category.setName(categoryDTO.getName());
        category.setSlug(categoryDTO.getSlug());
        category.setUrl(categoryDTO.getUrl());
    }
}
