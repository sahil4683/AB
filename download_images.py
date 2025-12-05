import os
import requests
from urllib.parse import urlparse

def download_images():
    # Read image URLs
    with open('image_urls.txt', 'r', encoding='utf-16') as f:
        urls = [line.strip() for line in f if line.strip()]

    # Filter for 250x250 images
    image_urls = [url for url in urls if '250x250' in url]

    # Create images directory if not exists
    images_dir = 'ab-frontend/public/images'
    os.makedirs(images_dir, exist_ok=True)

    # Generate SQL file
    sql_file = 'update_image_urls.sql'
    with open(sql_file, 'w') as sql_f:
        sql_f.write("-- Update image URLs to local paths\n")

        for i, url in enumerate(image_urls, start=1):
            filename = f"product_{i}.jpg"
            filepath = os.path.join(images_dir, filename)

            # Download image
            try:
                urllib.request.urlretrieve(url, filepath)
                print(f"Downloaded {filename} from {url}")
            except Exception as e:
                print(f"Failed to download {url}: {e}")
                continue

            # Write SQL update
            local_url = f"/images/{filename}"
            sql_f.write(f"UPDATE products SET image_url = '{local_url}' WHERE id = {i};\n")

    print(f"Downloaded {len(image_urls)} images and generated {sql_file}")

if __name__ == "__main__":
    download_images()
