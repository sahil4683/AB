package com.ab.config;

import com.ab.model.Category;
import com.ab.model.Product;
import com.ab.repository.CategoryRepository;
import com.ab.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
public class DataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    public DataLoader(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void run(String... args) throws Exception {
        // Only load if categories table is empty
        if (categoryRepository.count() == 0) {
            loadDataFromJson();
        }
    }

    private void loadDataFromJson() {
        int categoriesLoaded = 0;
        int productsLoaded = 0;
        int productsSkipped = 0;
        
        try {
            ClassPathResource resource = new ClassPathResource("script/product category.json");
            InputStream inputStream = resource.getInputStream();
            JsonNode rootNode = objectMapper.readTree(inputStream);
            JsonNode categoriesNode = rootNode.get("categories");

            if (categoriesNode != null && categoriesNode.isArray()) {
                for (JsonNode categoryNode : categoriesNode) {
                    // Create Category
                    Category category1 = new Category(
                            categoryNode.get("name").asText(),
                            categoryNode.get("slug").asText(),
                            categoryNode.get("url").asText()
                    );
                    Category category = categoryRepository.save(category1);
                    categoriesLoaded++;

                    // Create Products for this category
                    JsonNode productsNode = categoryNode.get("products");
                    if (productsNode != null && productsNode.isArray()) {
                        for (JsonNode productNode : productsNode) {
                            try {
                                String slug = productNode.get("slug").asText();
                                
                                // Check if product with same slug and category already exists
                                boolean exists = productRepository.findAll().stream()
                                        .anyMatch(p -> slug.equals(p.getSlug()) && 
                                                      p.getCategoryEntity() != null &&
                                                      category.getId().equals(p.getCategoryEntity().getId()));
                                
                                if (!exists) {
                                    Product product = new Product(
                                            productNode.get("name").asText(),
                                            slug,
                                            productNode.get("anchor").asText(),
                                            category
                                    );
                                    productRepository.save(product);
                                    productsLoaded++;
                                } else {
                                    productsSkipped++;
                                }
                            } catch (Exception e) {
                                // Log constraint violation but continue processing
                                System.err.println("Error saving product: " + productNode.get("slug").asText() + 
                                                 " in category: " + category.getName() + " - " + e.getMessage());
                                productsSkipped++;
                            }
                        }
                    }
                }
                System.out.println("Data loaded successfully!");
                System.out.println("Categories loaded: " + categoriesLoaded);
                System.out.println("Products loaded: " + productsLoaded);
                System.out.println("Products skipped (duplicates): " + productsSkipped);
            }
        } catch (Exception e) {
            System.err.println("Error loading data from JSON: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
