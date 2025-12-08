package com.ab.service;

import com.ab.dto.CategoryDTO;
import com.ab.exception.ResourceNotFoundException;
import com.ab.mapper.CategoryMapper;
import com.ab.model.Category;
import com.ab.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Category business logic.
 * Handles all category-related operations and provides abstraction over the repository layer.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    /**
     * Retrieves all categories.
     *
     * @return list of category DTOs
     */
    public List<CategoryDTO> getAllCategories() {
        log.debug("Fetching all categories");

        List<Category> categories = categoryRepository.findAll();
        log.info("Retrieved {} categories", categories.size());

        return categories.stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a specific category by ID.
     *
     * @param id the category ID
     * @return the category DTO
     * @throws ResourceNotFoundException if category is not found
     */
    public CategoryDTO getCategoryById(Long id) {
        log.debug("Fetching category with id: {}", id);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Category not found with id: {}", id);
                    return new ResourceNotFoundException("Category not found with id: " + id);
                });

        log.info("Retrieved category: {}", id);
        return categoryMapper.toDTO(category);
    }

    /**
     * Creates a new category.
     *
     * @param categoryDTO the category data
     * @return the created category DTO
     */
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        log.info("Creating new category: {}", categoryDTO.getName());

        Category category = categoryMapper.toEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);

        log.info("Category created successfully with id: {}", savedCategory.getId());
        return categoryMapper.toDTO(savedCategory);
    }

    /**
     * Updates an existing category.
     *
     * @param id the category ID
     * @param categoryDTO the updated category data
     * @return the updated category DTO
     * @throws ResourceNotFoundException if category is not found
     */
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        log.info("Updating category with id: {}", id);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Category not found with id: {}", id);
                    return new ResourceNotFoundException("Category not found with id: " + id);
                });

        categoryMapper.updateEntityFromDTO(categoryDTO, category);
        Category updatedCategory = categoryRepository.save(category);

        log.info("Category updated successfully with id: {}", id);
        return categoryMapper.toDTO(updatedCategory);
    }

    /**
     * Deletes a category by ID.
     *
     * @param id the category ID
     * @throws ResourceNotFoundException if category is not found
     */
    @Transactional
    public void deleteCategory(Long id) {
        log.info("Deleting category with id: {}", id);

        if (!categoryRepository.existsById(id)) {
            log.warn("Category not found with id: {}", id);
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }

        categoryRepository.deleteById(id);
        log.info("Category deleted successfully with id: {}", id);
    }

    /**
     * Retrieves category by slug.
     *
     * @param slug the category slug
     * @return the category DTO
     * @throws ResourceNotFoundException if category is not found
     */
    public CategoryDTO getCategoryBySlug(String slug) {
        log.debug("Fetching category with slug: {}", slug);

        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> {
                    log.warn("Category not found with slug: {}", slug);
                    return new ResourceNotFoundException("Category not found with slug: " + slug);
                });

        log.info("Retrieved category by slug: {}", slug);
        return categoryMapper.toDTO(category);
    }
}
