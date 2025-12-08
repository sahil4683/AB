// package com.ab.config;

// import com.ab.model.Category;
// import com.ab.model.Product;
// import com.ab.repository.CategoryRepository;
// import com.ab.repository.ProductRepository;
// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.core.io.ClassPathResource;
// import org.springframework.stereotype.Component;

// import java.io.InputStream;

// /**
//  * Data loader component for initializing database with sample data.
//  * Loads data from JSON file on application startup if database is empty.
//  */
// @Slf4j
// @Component
// @RequiredArgsConstructor
// public class DataLoader implements CommandLineRunner {

//     private final CategoryRepository categoryRepository;
//     private final ProductRepository productRepository;
//     private final ObjectMapper objectMapper;

//     @Override
//     public void run(String... args) throws Exception {
//         if (categoryRepository.count() == 0) {
//             log.info("Loading initial data from JSON file...");
//             loadDataFromJson();
//         } else {
//             log.info("Database already contains data. Skipping data loading.");
//         }
//     }

//     private void loadDataFromJson() {
//         int categoriesLoaded = 0;
//         int productsLoaded = 0;
//         int productsSkipped = 0;
        
//         try {
//             ClassPathResource resource = new ClassPathResource("script/product category.json");
//             InputStream inputStream = resource.getInputStream();
//             JsonNode rootNode = objectMapper.readTree(inputStream);
//             JsonNode categoriesNode = rootNode.get("categories");

//             if (categoriesNode != null && categoriesNode.isArray()) {
//                 for (JsonNode categoryNode : categoriesNode) {
//                     try {
//                         // Create Category
//                         Category category = new Category(
//                                 categoryNode.get("name").asText(),
//                                 categoryNode.get("slug").asText(),
//                                 categoryNode.get("url").asText()
//                         );
//                         category = categoryRepository.save(category);
//                         final Category savedCategory = category;
//                         categoriesLoaded++;
//                         log.debug("Loaded category: {}", savedCategory.getName());

//                         // Create Products for this category
//                         JsonNode productsNode = categoryNode.get("products");
//                         if (productsNode != null && productsNode.isArray()) {
//                             for (JsonNode productNode : productsNode) {
//                                 try {
//                                     String slug = productNode.get("slug").asText();
                                    
//                                     // Check if product with same slug and category already exists
//                                     boolean exists = productRepository.findAll().stream()
//                                             .anyMatch(p -> slug.equals(p.getSlug()) && 
//                                                           p.getCategoryEntity() != null &&
//                                                           savedCategory.getId().equals(p.getCategoryEntity().getId()));
                                    
//                                     if (!exists) {
//                                         Product product = new Product(
//                                                 productNode.get("name").asText(),
//                                                 slug,
//                                                 productNode.get("anchor").asText(),
//                                                 savedCategory
//                                         );
//                                         productRepository.save(product);
//                                         productsLoaded++;
//                                     } else {
//                                         productsSkipped++;
//                                     }
//                                 } catch (Exception e) {
//                                     log.warn("Error saving product: {} in category: {} - {}",
//                                             productNode.get("slug").asText(),
//                                             savedCategory.getName(),
//                                             e.getMessage());
//                                     productsSkipped++;
//                                 }
//                             }
//                         }
//                     } catch (Exception e) {
//                         log.error("Error loading category: {}", e.getMessage(), e);
//                     }
//                 }
                
//                 log.info("Data loading completed successfully!");
//                 log.info("Categories loaded: {}, Products loaded: {}, Products skipped: {}",
//                         categoriesLoaded, productsLoaded, productsSkipped);
//             }
//         } catch (Exception e) {
//             log.error("Error loading data from JSON: {}", e.getMessage(), e);
//         }
//     }
// }

