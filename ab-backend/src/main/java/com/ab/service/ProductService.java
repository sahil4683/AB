package com.ab.service;

import com.ab.dto.ProductDTO;
import com.ab.exception.ResourceNotFoundException;
import com.ab.mapper.ProductMapper;
import com.ab.model.Product;
import com.ab.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Product business logic.
 * Handles all product-related operations and provides abstraction over the repository layer.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    /**
     * Retrieves all products with optional filtering and sorting.
     *
     * @param category optional category filter
     * @param query optional search query
     * @param sort optional sort field
     * @return list of product DTOs
     */
    public List<ProductDTO> getAllProducts(String category, String query, String sort) {
        log.debug("Fetching products with category={}, query={}, sort={}", category, query, sort);

        List<Product> products;

        if (query != null && !query.isBlank()) {
            log.debug("Searching products by query: {}", query);
            products = productRepository.findByTitleContainingIgnoreCaseOrCasNumberContainingIgnoreCase(query, query);
        } else if (category != null && !category.isBlank() && !"All Products".equalsIgnoreCase(category)) {
            log.debug("Filtering products by category: {}", category);
            products = productRepository.findByCategoryIgnoreCase(category);
        } else {
            log.debug("Fetching all products");
            products = productRepository.findAll();
        }

        // Apply sorting if specified
        if ("name".equalsIgnoreCase(sort)) {
            log.debug("Sorting products by name");
            products = products.stream()
                    .sorted((a, b) -> a.getTitle().compareToIgnoreCase(b.getTitle()))
                    .collect(Collectors.toList());
        }

        log.info("Retrieved {} products", products.size());
        return products.stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a specific product by ID.
     *
     * @param id the product ID
     * @return the product DTO
     * @throws ResourceNotFoundException if product is not found
     */
    public ProductDTO getProductById(Long id) {
        log.debug("Fetching product with id: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Product not found with id: {}", id);
                    return new ResourceNotFoundException("Product not found with id: " + id);
                });

        log.info("Retrieved product: {}", id);
        return productMapper.toDTO(product);
    }

    /**
     * Creates a new product.
     *
     * @param productDTO the product data
     * @return the created product DTO
     */
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        log.info("Creating new product: {}", productDTO.getTitle());

        Product product = productMapper.toEntity(productDTO);
        Product savedProduct = productRepository.save(product);

        log.info("Product created successfully with id: {}", savedProduct.getId());
        return productMapper.toDTO(savedProduct);
    }

    /**
     * Updates an existing product.
     *
     * @param id the product ID
     * @param productDTO the updated product data
     * @return the updated product DTO
     * @throws ResourceNotFoundException if product is not found
     */
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        log.info("Updating product with id: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Product not found with id: {}", id);
                    return new ResourceNotFoundException("Product not found with id: " + id);
                });

        productMapper.updateEntityFromDTO(productDTO, product);
        Product updatedProduct = productRepository.save(product);

        log.info("Product updated successfully with id: {}", id);
        return productMapper.toDTO(updatedProduct);
    }

    /**
     * Deletes a product by ID.
     *
     * @param id the product ID
     * @throws ResourceNotFoundException if product is not found
     */
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product with id: {}", id);

        if (!productRepository.existsById(id)) {
            log.warn("Product not found with id: {}", id);
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }

        productRepository.deleteById(id);
        log.info("Product deleted successfully with id: {}", id);
    }

    /**
     * Searches products by query string.
     *
     * @param query the search query
     * @return list of matching product DTOs
     */
    public List<ProductDTO> searchProducts(String query) {
        log.debug("Searching products with query: {}", query);

        List<Product> products = productRepository
                .findByTitleContainingIgnoreCaseOrCasNumberContainingIgnoreCase(query, query);

        log.info("Found {} products matching query: {}", products.size(), query);
        return products.stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }
}
