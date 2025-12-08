package com.ab.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ab.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE LOWER(p.category.name) = LOWER(:category)")
    List<Product> findByCategoryIgnoreCase(@Param("category") String category);

    List<Product> findByTitleContainingIgnoreCaseOrCasNumberContainingIgnoreCase(String title, String casNumber);
}


