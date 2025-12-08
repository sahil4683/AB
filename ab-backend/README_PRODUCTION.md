# AB Enterprises Backend API

Professional Spring Boot REST API for managing products and customer inquiries for AB Enterprises.

## Features

- ✅ RESTful API endpoints for Product, Category, and Contact Request management
- ✅ Comprehensive input validation and error handling
- ✅ OpenAPI/Swagger documentation
- ✅ CORS support for multi-origin requests
- ✅ Structured logging with SLF4J
- ✅ Data Transfer Objects (DTOs) for API decoupling
- ✅ Service layer abstraction with business logic
- ✅ Clean Architecture patterns
- ✅ Environment-specific configurations
- ✅ Database indexes for performance optimization
- ✅ Audit trails with creation/modification timestamps
- ✅ Global exception handling

## Technology Stack

- **Java**: 17
- **Framework**: Spring Boot 3.3.4
- **Database**: MySQL 8.0+
- **Build Tool**: Maven 3.8+
- **Documentation**: OpenAPI 3.0 / Swagger UI
- **Logging**: SLF4J with Logback
- **ORM**: Hibernate with JPA
- **Testing**: JUnit 5, Testcontainers

## Project Structure

```
src/main/java/com/ab/
├── controller/          # REST API endpoints
├── service/            # Business logic layer
├── repository/         # Data access layer
├── model/             # JPA entities
├── dto/               # Data Transfer Objects
├── mapper/            # DTO mappers
├── config/            # Spring configurations
├── exception/         # Exception handling
├── util/              # Utility classes
└── AbBackendApplication.java
```

## Prerequisites

- Java Development Kit (JDK) 17+
- Maven 3.8.0+
- MySQL 8.0+
- Git

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourorg/ab-backend.git
cd ab-backend
```

### 2. Configure Database

Create MySQL database and user:
```sql
CREATE DATABASE ab_enterprises;
CREATE USER 'ab_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ab_enterprises.* TO 'ab_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Application Properties

Edit `src/main/resources/application.properties` or set environment variables:

```bash
export DB_USERNAME=ab_user
export DB_PASSWORD=secure_password
export DB_HOST=localhost
```

### 4. Build the Application

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

Or run the JAR file:
```bash
java -jar target/ab-backend-1.0.0.jar
```

Application will start on `http://localhost:8080`

## API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## API Endpoints

### Products
- `GET /api/products` - Get all products with optional filtering
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?q=query` - Search products
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/categories/slug/{slug}` - Get category by slug
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Contact Requests
- `GET /api/contact-requests` - Get all contact requests
- `GET /api/contact-requests/{id}` - Get contact request by ID
- `POST /api/contact-requests` - Submit new contact request
- `PUT /api/contact-requests/{id}` - Update contact request
- `DELETE /api/contact-requests/{id}` - Delete contact request

## Environment Profiles

### Development
```bash
mvn spring-boot:run -Dspring-boot.run.arguments='--spring.profiles.active=dev'
```
- Database: `ab_enterprises_dev`
- Logging: DEBUG level
- SQL: Formatted and displayed

### Production
```bash
java -jar target/ab-backend-1.0.0.jar --spring.profiles.active=prod
```
- Database: `ab_enterprises` (external configuration)
- Logging: INFO level
- Performance optimizations enabled
- Compression enabled

## Configuration

### CORS Configuration
Configure allowed origins in `application.properties`:
```properties
app.cors.allowed-origins=http://localhost:4200,http://localhost:3000
app.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
app.cors.max-age=3600
```

### Database Connection Pool
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
```

## Validation

The API includes comprehensive input validation:

- Required fields validation
- Email format validation
- Length constraints
- Custom validation rules

Example request:
```json
{
  "title": "Product Name",
  "casNumber": "12345-67-8",
  "description": "Product description",
  "categoryId": 1
}
```

## Error Handling

All errors follow a consistent response format:

```json
{
  "timestamp": "2024-12-08T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "One or more validation errors occurred",
  "path": "/api/products",
  "fieldErrors": [
    {
      "field": "title",
      "message": "Product title is required"
    }
  ]
}
```

## Logging

Structured logging is configured with appropriate levels:
- **ERROR**: Critical issues requiring immediate attention
- **WARN**: Potentially harmful situations
- **INFO**: General informational messages
- **DEBUG**: Detailed debugging information

View logs:
```bash
# Development
tail -f logs/application.log

# Production
tail -f /var/log/ab-backend/application.log
```

## Testing

### Run Tests
```bash
mvn test
```

### Run Tests with Coverage
```bash
mvn test jacoco:report
```

## Building for Production

### Create Docker Image (Optional)
```bash
docker build -t ab-backend:1.0.0 .
docker run -p 8080:8080 ab-backend:1.0.0
```

### Package as JAR
```bash
mvn clean package
```

JAR file location: `target/ab-backend-1.0.0.jar`

## Performance Optimization

- Database connection pooling (HikariCP)
- SQL batch processing
- Lazy loading of related entities
- Database indexes on frequently queried columns
- Response compression enabled in production

## Security Best Practices

- Input validation on all endpoints
- SQL injection prevention via parameterized queries
- CORS configuration for cross-origin requests
- Error messages don't expose sensitive information in production
- Password hashing for database credentials
- HTTPS recommended for production

## Monitoring

The application logs important operations:
- Entity CRUD operations
- Search queries
- Errors and exceptions
- Application startup and shutdown

## Troubleshooting

### Database Connection Issues
```bash
# Test MySQL connection
mysql -h localhost -u ab_user -p ab_enterprises
```

### Port Already in Use
```bash
# Change port in application.properties
server.port=8081
```

### Out of Memory
```bash
# Increase JVM memory
java -Xmx1024m -Xms512m -jar target/ab-backend-1.0.0.jar
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## Code Quality

This project follows:
- Clean Code principles
- SOLID design patterns
- Spring Boot best practices
- RESTful API conventions
- Maven project structure standards

## License

Apache License 2.0 - See LICENSE file for details

## Support

For issues, questions, or contributions, please contact:
- **Email**: support@abenterprises.com
- **Website**: https://www.abenterprises.com

## Changelog

### Version 1.0.0 (2024-12-08)
- Initial release
- Product management API
- Category management API
- Contact request API
- OpenAPI documentation
- Comprehensive error handling
- CORS support
