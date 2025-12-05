-- SQL Insert Script for Categories and Products
-- Generated from product category.json
-- This is a sample showing the structure. Use DataLoader.java to load all data programmatically.

-- Create tables (if not exists - usually handled by JPA)
-- CREATE TABLE IF NOT EXISTS categories (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL UNIQUE,
--     slug VARCHAR(255) NOT NULL UNIQUE,
--     url VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS products (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     cas_number VARCHAR(255),
--     image_url VARCHAR(500),
--     description VARCHAR(2000),
--     slug VARCHAR(255) UNIQUE,
--     anchor VARCHAR(255),
--     category_id BIGINT,
--     category_name VARCHAR(255),
--     FOREIGN KEY (category_id) REFERENCES categories(id)
-- );

-- Insert Categories (Sample - first 5 categories)
INSERT INTO categories (id, name, slug, url) VALUES 
(1, 'Industrial Chemicals', 'industrial-chemicals', '/industrial-chemicals.html'),
(2, 'Industrial Chemical', 'industrial-chemical', '/industrial-chemical.html'),
(3, 'Laboratory Chemical', 'laboratory-chemical', '/laboratory-chemical.html'),
(4, 'Chemical Compound', 'chemical-compound', '/chemical-compound.html'),
(5, 'Chemicals Compound', 'chemicals-compound', '/chemicals-compound.html');

-- Insert Products (Sample - first few products from Industrial Chemicals category)
INSERT INTO products (id, title, slug, anchor, category_id, category_name) VALUES 
(1, 'R -2-Amino-2-(Cyclohexa-1,4-Dien-1-yl)Acetic Acid', 'r-2-amino-2-cyclohexa-1-4-dien-1-yl-acetic-acid', '#r-2-amino-2-cyclohexa-1-4-dien-1-yl-acetic-acid', 1, 'Industrial Chemicals'),
(2, '2-acetamido-2-deoxy-alpha-d- Glucopyranosylchloride-3,4,6- Triacetate', '2-acetamido-2-deoxy-alpha-d-glucopyranosylchloride-3-4-6-triacetate', '#2-acetamido-2-deoxy-alpha-d-glucopyranosylchloride-3-4-6-triacetate', 1, 'Industrial Chemicals'),
(3, '1-Aminocyclohexane Carboxylic Acid Hydrochloride', '1-aminocyclohexane-carboxylic-acid-hydrochloride', '#1-aminocyclohexane-carboxylic-acid-hydrochloride', 2, 'Industrial Chemical'),
(4, 'Allylmagnesium Bromide Solution (1.0m In Diethyl Ether)', 'allylmagnesium-bromide-solution-1-0m-in-diethyl-ether', '#allylmagnesium-bromide-solution-1-0m-in-diethyl-ether', 2, 'Industrial Chemical'),
(5, '(4r Cis)-1,1-Dimethyl Ethyl-6,-2-Aminoethyl2,2-Dimethyl-1,3-Dioxane-4-Acetate', '4r-cis-1-1-dimethyl-ethyl-6-2-aminoethyl2-2-dimethyl-1-3-dioxane-4-acetate', '#4r-cis-1-1-dimethyl-ethyl-6-2-aminoethyl2-2-dimethyl-1-3-dioxane-4-acetate', 2, 'Industrial Chemical');

-- Note: To insert all data from the JSON file, use the DataLoader.java class
-- which will automatically load all categories and products on application startup
-- if the categories table is empty.
