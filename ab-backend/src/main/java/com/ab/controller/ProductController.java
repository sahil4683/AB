package com.ab.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ab.model.Product;
import com.ab.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> listProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(required = false) String sort) {

        List<Product> products;

        if (query != null && !query.isBlank()) {
            products = productRepository.findByTitleContainingIgnoreCaseOrCasNumberContainingIgnoreCase(query, query);
        } else if (category != null && !category.isBlank() && !"All Products".equalsIgnoreCase(category)) {
            products = productRepository.findByCategoryIgnoreCase(category);
        } else {
            products = productRepository.findAll();
        }

        if ("name".equalsIgnoreCase(sort)) {
            products.sort((a, b) -> a.getTitle().compareToIgnoreCase(b.getTitle()));
        }

        return products;
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}


