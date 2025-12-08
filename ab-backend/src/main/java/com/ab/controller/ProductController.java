package com.ab.controller;

import com.ab.dto.ProductDTO;
import com.ab.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Product management.
 * Provides endpoints for CRUD operations on products.
 */
@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

    private final ProductService productService;

    /**
     * Retrieve all products with optional filtering and sorting.
     *
     * @param category optional category filter
     * @param query optional search query
     * @param sort optional sort field
     * @return list of products
     */
    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve all products with optional filtering and sorting")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved products",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductDTO.class)))
    public ResponseEntity<List<ProductDTO>> listProducts(
            @Parameter(description = "Category name for filtering")
            @RequestParam(required = false) String category,
            @Parameter(description = "Search query")
            @RequestParam(required = false, name = "q") String query,
            @Parameter(description = "Sort field (e.g., 'name')")
            @RequestParam(required = false) String sort) {

        log.info("GET /products - category={}, query={}, sort={}", category, query, sort);
        List<ProductDTO> products = productService.getAllProducts(category, query, sort);
        return ResponseEntity.ok(products);
    }

    /**
     * Retrieve a specific product by ID.
     *
     * @param id the product ID
     * @return the product
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve a specific product by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductDTO.class))),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        log.info("GET /products/{} - Retrieving product", id);
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * Create a new product.
     *
     * @param productDTO the product data
     * @return the created product
     */
    @PostMapping
    @Operation(summary = "Create product", description = "Create a new product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        log.info("POST /products - Creating product: {}", productDTO.getTitle());
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    /**
     * Update an existing product.
     *
     * @param id the product ID
     * @param productDTO the updated product data
     * @return the updated product
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Update an existing product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductDTO.class))),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {

        log.info("PUT /products/{} - Updating product", id);
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * Delete a product.
     *
     * @param id the product ID
     * @return no content
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product", description = "Delete a product by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.info("DELETE /products/{} - Deleting product", id);
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Search products by query.
     *
     * @param query the search query
     * @return list of matching products
     */
    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Search products by title or CAS number")
    @ApiResponse(responseCode = "200", description = "Search results",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductDTO.class)))
    public ResponseEntity<List<ProductDTO>> searchProducts(
            @Parameter(description = "Search query")
            @RequestParam String query) {

        log.info("GET /products/search - Query: {}", query);
        List<ProductDTO> results = productService.searchProducts(query);
        return ResponseEntity.ok(results);
    }
}



