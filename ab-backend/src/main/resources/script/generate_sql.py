import json
import os

# Read the JSON file
json_path = os.path.join(os.path.dirname(__file__), 'product category.json')
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Generate SQL insert statements
sql_statements = []
sql_statements.append("-- SQL Insert Script for Categories and Products")
sql_statements.append("-- Generated from product category.json")
sql_statements.append("")
sql_statements.append("-- Insert Categories")
sql_statements.append("")

category_id_map = {}
category_counter = 1

for category in data['categories']:
    category_name = category['name'].replace("'", "''")
    slug = category['slug'].replace("'", "''")
    url = category['url'].replace("'", "''")
    
    category_id_map[category['name']] = category_counter
    
    sql_statements.append(f"INSERT INTO categories (id, name, slug, url) VALUES ({category_counter}, '{category_name}', '{slug}', '{url}');")
    category_counter += 1

sql_statements.append("")
sql_statements.append("-- Insert Products")
sql_statements.append("")

product_counter = 1

for category in data['categories']:
    category_id = category_id_map[category['name']]
    
    for product in category['products']:
        product_name = product['name'].replace("'", "''")
        slug = product['slug'].replace("'", "''")
        anchor = product['anchor'].replace("'", "''")
        
        sql_statements.append(f"INSERT INTO products (id, title, slug, anchor, category_id, category_name) VALUES ({product_counter}, '{product_name}', '{slug}', '{anchor}', {category_id}, '{category['name'].replace(\"'\", \"''\")}');")
        product_counter += 1

# Write to SQL file
sql_path = os.path.join(os.path.dirname(__file__), 'insert_categories_and_products.sql')
with open(sql_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_statements))

print(f"Generated SQL file: {sql_path}")
print(f"Categories: {len(data['categories'])}")
print(f"Products: {sum(len(cat['products']) for cat in data['categories'])}")
