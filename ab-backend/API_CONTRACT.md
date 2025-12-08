# AB Enterprises API Contract

## Overview
This document defines the RESTful API contract for the AB Enterprises Backend API.

## Base URL
- **Development**: `http://localhost:8080/api`
- **Production**: `https://api.abenterprises.com/api`

## Authentication
Currently, the API does not require authentication. Future versions will implement JWT-based authentication.

## Rate Limiting
No rate limiting is currently implemented. Future versions may include rate limiting per IP.

## Response Format
All responses are in JSON format with consistent structure.

### Success Response (2xx)
```json
{
  "data": {},
  "status": 200,
  "message": "Success"
}
```

### Error Response (4xx, 5xx)
```json
{
  "timestamp": "2024-12-08T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation error details",
  "path": "/api/products"
}
```

## Products Endpoint

### List Products
- **Method**: GET
- **URL**: `/products`
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `q` (optional): Search query
  - `sort` (optional): Sort field (e.g., 'name')
- **Response**: 200 OK
- **Response Body**: Array of ProductDTO

### Get Product
- **Method**: GET
- **URL**: `/products/{id}`
- **Path Parameters**: `id` (Long)
- **Response**: 200 OK
- **Response Body**: ProductDTO

### Create Product
- **Method**: POST
- **URL**: `/products`
- **Request Body**: ProductDTO
- **Response**: 201 Created
- **Response Body**: ProductDTO with ID

### Update Product
- **Method**: PUT
- **URL**: `/products/{id}`
- **Path Parameters**: `id` (Long)
- **Request Body**: ProductDTO
- **Response**: 200 OK
- **Response Body**: Updated ProductDTO

### Delete Product
- **Method**: DELETE
- **URL**: `/products/{id}`
- **Path Parameters**: `id` (Long)
- **Response**: 204 No Content

### Search Products
- **Method**: GET
- **URL**: `/products/search`
- **Query Parameters**: `q` (required) - Search query
- **Response**: 200 OK
- **Response Body**: Array of ProductDTO

## Categories Endpoint

### List Categories
- **Method**: GET
- **URL**: `/categories`
- **Response**: 200 OK
- **Response Body**: Array of CategoryDTO

### Get Category
- **Method**: GET
- **URL**: `/categories/{id}`
- **Path Parameters**: `id` (Long)
- **Response**: 200 OK
- **Response Body**: CategoryDTO

### Get Category by Slug
- **Method**: GET
- **URL**: `/categories/slug/{slug}`
- **Path Parameters**: `slug` (String)
- **Response**: 200 OK
- **Response Body**: CategoryDTO

### Create Category
- **Method**: POST
- **URL**: `/categories`
- **Request Body**: CategoryDTO
- **Response**: 201 Created
- **Response Body**: CategoryDTO with ID

### Update Category
- **Method**: PUT
- **URL**: `/categories/{id}`
- **Path Parameters**: `id` (Long)
- **Request Body**: CategoryDTO
- **Response**: 200 OK
- **Response Body**: Updated CategoryDTO

### Delete Category
- **Method**: DELETE
- **URL**: `/categories/{id}`
- **Path Parameters**: `id` (Long)
- **Response**: 204 No Content

## Contact Requests Endpoint

### List Contact Requests
- **Method**: GET
- **URL**: `/contact-requests`
- **Response**: 200 OK
- **Response Body**: Array of ContactRequest

### Get Contact Request
- **Method**: GET
- **URL**: `/contact-requests/{id}`
- **Path Parameters**: `id` (Long)
- **Response**: 200 OK
- **Response Body**: ContactRequest

### Create Contact Request
- **Method**: POST
- **URL**: `/contact-requests`
- **Request Body**: ContactRequestDTO
- **Response**: 201 Created
- **Response Body**: ContactRequest

### Update Contact Request
- **Method**: PUT
- **URL**: `/contact-requests/{id}`
- **Path Parameters**: `id` (Long)
- **Request Body**: ContactRequestDTO
- **Response**: 200 OK
- **Response Body**: Updated ContactRequest

### Delete Contact Request
- **Method**: DELETE
- **URL**: `/contact-requests/{id}`
- **Path Parameters**: `id` (Long)
- **Response**: 204 No Content

## Data Models

### ProductDTO
```json
{
  "id": 1,
  "title": "Product Name",
  "casNumber": "12345-67-8",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Product description",
  "slug": "product-name",
  "anchor": "product-anchor",
  "categoryId": 1,
  "categoryName": "Category Name"
}
```

### CategoryDTO
```json
{
  "id": 1,
  "name": "Category Name",
  "slug": "category-slug",
  "url": "https://example.com/category",
  "productIds": [1, 2, 3]
}
```

### ContactRequestDTO
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Message content"
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 204 | No Content | Resource deleted |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

## Validation Rules

### Product
- `title`: Required, 3-255 characters
- `casNumber`: Required, 3-50 characters
- `description`: Max 2000 characters
- `categoryId`: Required

### Category
- `name`: Required, 2-100 characters, unique
- `slug`: Required, 2-100 characters, unique
- `url`: Required

### Contact Request
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `phone`: Max 20 characters
- `message`: Required, 10-2000 characters

## Changelog

### Version 1.0.0
- Initial API specification
- Product management
- Category management
- Contact requests
