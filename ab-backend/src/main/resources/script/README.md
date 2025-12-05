# Product Category Data Loading

This directory contains the JSON data file and scripts for loading product categories and products into the database.

## Files

- `product category.json` - Source JSON file containing all categories and products
- `insert_categories_and_products_sample.sql` - Sample SQL insert statements showing the structure
- `generate_sql.py` - Python script to generate full SQL file (optional)

## Database Schema

### Categories Table
```sql
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    url VARCHAR(255) NOT NULL
);
```

### Products Table
```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cas_number VARCHAR(255),
    image_url VARCHAR(500),
    description VARCHAR(2000),
    slug VARCHAR(255) UNIQUE,
    anchor VARCHAR(255),
    category_id BIGINT,
    category_name VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## Loading Data

### Option 1: Automatic Loading (Recommended)

The `DataLoader.java` class will automatically load all data from the JSON file when the Spring Boot application starts, **only if the categories table is empty**.

Simply start your Spring Boot application and the data will be loaded automatically.

### Option 2: Manual SQL Execution

1. Generate the full SQL file using the Python script:
   ```bash
   python generate_sql.py
   ```

2. Execute the generated SQL file:
   ```bash
   mysql -u root -p ab_enterprises < insert_categories_and_products.sql
   ```

### Option 3: Use Sample SQL

You can manually execute the sample SQL file (`insert_categories_and_products_sample.sql`) which contains a few sample records to test the structure.

## Entity Classes

- `Category.java` - JPA entity for categories
- `Product.java` - JPA entity for products (updated with slug, anchor, and category relationship)

## Repositories

- `CategoryRepository.java` - Repository for Category entity
- `ProductRepository.java` - Repository for Product entity (existing)

## Notes

- The `slug` field in Product is optional (nullable) to maintain backward compatibility with existing products
- The `category_name` field is kept for backward compatibility
- The `category_id` field establishes the foreign key relationship to the categories table
- All data is loaded automatically on first startup if the database is empty
