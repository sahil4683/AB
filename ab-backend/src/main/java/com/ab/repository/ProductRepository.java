package com.ab.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ab.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByTitleContainingIgnoreCaseOrCasNumberContainingIgnoreCase(String title, String casNumber);
}


