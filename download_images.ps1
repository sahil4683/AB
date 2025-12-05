# PowerShell script to download images and generate SQL updates

$imageUrls = Get-Content -Path "image_urls.txt" -Encoding UTF8
$imageDir = "ab-frontend/public/images"
$sqlFile = "update_image_urls.sql"

# Create images directory if not exists
if (!(Test-Path $imageDir)) {
    New-Item -ItemType Directory -Path $imageDir
}

# Filter for 250x250 images
$filteredUrls = $imageUrls | Where-Object { $_ -like "*250x250*" }

# Generate SQL file
$sqlContent = "-- Update image URLs to local paths`n"
$sqlContent | Out-File -FilePath $sqlFile -Encoding UTF8

# Download images and generate SQL
for ($i = 0; $i -lt $filteredUrls.Count; $i++) {
    $url = $filteredUrls[$i]
    $filename = "product_$($i+1).jpg"
    $filepath = Join-Path $imageDir $filename

    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath
        Write-Host "Downloaded $filename from $url"
    } catch {
        Write-Host "Failed to download $url : $_"
        continue
    }

    # Write SQL update
    $localUrl = "/images/$filename"
    $sqlUpdate = "UPDATE products SET image_url = '$localUrl' WHERE id = $($i+1);`n"
    $sqlUpdate | Out-File -FilePath $sqlFile -Append -Encoding UTF8
}

Write-Host "Downloaded $($filteredUrls.Count) images and generated $sqlFile"
