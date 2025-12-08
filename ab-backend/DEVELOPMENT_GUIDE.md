# Development Guide - AB Enterprises Backend

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Environment Setup](#development-environment-setup)
3. [Running the Application](#running-the-application)
4. [Project Structure](#project-structure)
5. [Code Standards](#code-standards)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites
- Java 17 (JDK)
- Maven 3.8.0+
- MySQL 8.0+
- Git
- IDE (IntelliJ IDEA, VS Code, or Eclipse)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/yourorg/ab-backend.git
cd ab-backend

# Copy environment template
cp .env.template .env

# Edit .env with your local configuration
# Configure database credentials
```

## Development Environment Setup

### 1. Install MySQL

#### Windows
```bash
# Using Chocolatey
choco install mysql

# Or download from https://dev.mysql.com/downloads/mysql/
```

#### macOS
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

#### Linux
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### 2. Create Database

```bash
mysql -u root -p

mysql> CREATE DATABASE ab_enterprises_dev;
mysql> CREATE USER 'ab_dev'@'localhost' IDENTIFIED BY 'dev_password';
mysql> GRANT ALL PRIVILEGES ON ab_enterprises_dev.* TO 'ab_dev'@'localhost';
mysql> FLUSH PRIVILEGES;
```

### 3. Configure IDE

#### IntelliJ IDEA
1. Open project in IntelliJ
2. Go to File > Project Structure > SDKs
3. Set JDK 17
4. Install Spring Boot plugin (optional)
5. Go to Run > Edit Configurations > Add new "Spring Boot" configuration

#### VS Code
1. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - REST Client

#### Eclipse
1. Install Spring Tools Suite (STS)
2. Import project as Maven project

### 4. Maven Configuration

Verify Maven installation:
```bash
mvn -version
```

Update Maven settings (optional):
```bash
mvn clean install -DskipTests
```

## Running the Application

### Using Maven
```bash
# Development mode
mvn spring-boot:run -Dspring-boot.run.arguments='--spring.profiles.active=dev'

# With custom properties
mvn spring-boot:run \
  -Dspring-boot.run.arguments='--spring.profiles.active=dev --server.port=8081'
```

### Using IDE

#### IntelliJ IDEA
1. Right-click on `AbBackendApplication.java`
2. Select "Run 'AbBackendApplication'"

#### VS Code
1. Open terminal (Ctrl + `)
2. Run: `mvn spring-boot:run`

### Using JAR
```bash
# Build
mvn clean package

# Run
java -jar target/ab-backend-1.0.0.jar --spring.profiles.active=dev
```

### Verify Application is Running
```bash
# Check health
curl http://localhost:8080/swagger-ui.html

# Check API
curl http://localhost:8080/api/products
```

## Project Structure

```
ab-backend/
├── src/
│   ├── main/
│   │   ├── java/com/ab/
│   │   │   ├── AbBackendApplication.java
│   │   │   ├── controller/
│   │   │   │   ├── ProductController.java
│   │   │   │   ├── CategoryController.java
│   │   │   │   └── ContactController.java
│   │   │   ├── service/
│   │   │   │   ├── ProductService.java
│   │   │   │   ├── CategoryService.java
│   │   │   │   └── ContactRequestService.java
│   │   │   ├── repository/
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── CategoryRepository.java
│   │   │   │   └── ContactRequestRepository.java
│   │   │   ├── model/
│   │   │   │   ├── Product.java
│   │   │   │   ├── Category.java
│   │   │   │   └── ContactRequest.java
│   │   │   ├── dto/
│   │   │   │   ├── ProductDTO.java
│   │   │   │   ├── CategoryDTO.java
│   │   │   │   └── ContactRequestDTO.java
│   │   │   ├── mapper/
│   │   │   │   ├── ProductMapper.java
│   │   │   │   └── CategoryMapper.java
│   │   │   ├── config/
│   │   │   │   ├── OpenAPIConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── DataLoader.java
│   │   │   ├── exception/
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   └── util/
│   │   │       └── SlugGenerator.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── DB/
│   └── test/
│       └── java/com/ab/
│           └── controller/
│               └── ProductControllerTest.java
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── README_PRODUCTION.md
├── API_CONTRACT.md
└── .env.template
```

## Code Standards

### Naming Conventions
- **Classes**: PascalCase (ProductController.java)
- **Methods**: camelCase (getAllProducts())
- **Constants**: UPPER_SNAKE_CASE (MAX_SIZE)
- **Variables**: camelCase (productId)

### Coding Style
- Line length: Max 120 characters
- Indentation: 4 spaces
- Use meaningful variable names
- Write self-documenting code

### Documentation
```java
/**
 * Brief description of the class/method.
 *
 * @param parameter Description of parameter
 * @return Description of return value
 */
```

### Example
```java
/**
 * Retrieves all products with optional filtering.
 *
 * @param category optional category filter
 * @param query optional search query
 * @return list of product DTOs
 */
public List<ProductDTO> getAllProducts(String category, String query) {
    // Implementation
}
```

## Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=ProductControllerTest
```

### Run Specific Test Method
```bash
mvn test -Dtest=ProductControllerTest#testGetAllProducts
```

### Generate Coverage Report
```bash
mvn clean test jacoco:report
# Report: target/site/jacoco/index.html
```

### Test Example
```java
@Test
@DisplayName("Should get all products successfully")
void testGetAllProducts() throws Exception {
    List<ProductDTO> products = Arrays.asList(sampleProductDTO);
    when(productService.getAllProducts(null, null, null))
            .thenReturn(products);

    mockMvc.perform(get("/products")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));

    verify(productService, times(1)).getAllProducts(null, null, null);
}
```

## Debugging

### Enable Debug Logging
Edit `application-dev.properties`:
```properties
logging.level.com.ab=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Debug in IDE

#### IntelliJ IDEA
1. Set breakpoint (click line number)
2. Right-click on `AbBackendApplication.java` > Debug

#### VS Code
1. Install Debugger for Java
2. Create launch configuration in `.vscode/launch.json`
3. Press F5 to debug

### View Application Logs
```bash
# Real-time logging
tail -f logs/application.log

# Search for errors
tail -f logs/application.log | grep ERROR
```

## Common Tasks

### Add New Entity

1. Create model in `model/` directory:
```java
@Entity
@Table(name = "table_name")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
}
```

2. Create repository in `repository/`:
```java
@Repository
public interface MyEntityRepository extends JpaRepository<MyEntity, Long> {
}
```

3. Create DTO in `dto/`:
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyEntityDTO {
    private Long id;
    private String name;
}
```

4. Create service in `service/`:
```java
@Slf4j
@Service
@RequiredArgsConstructor
public class MyEntityService {
    private final MyEntityRepository repository;
    
    public List<MyEntity> getAll() {
        return repository.findAll();
    }
}
```

5. Create controller in `controller/`:
```java
@Slf4j
@RestController
@RequestMapping("/my-entities")
@RequiredArgsConstructor
@Tag(name = "My Entity Management")
public class MyEntityController {
    private final MyEntityService service;
    
    @GetMapping
    public ResponseEntity<List<MyEntity>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
```

### Modify Database Schema

1. Update entity model
2. JPA will handle DDL if `spring.jpa.hibernate.ddl-auto=update`
3. Or create migration script

### Add Validation

Use `jakarta.validation.constraints`:
```java
@NotBlank(message = "Name is required")
@Size(min = 2, max = 100)
private String name;
```

### Add Custom Exception

1. Create exception class:
```java
public class CustomException extends RuntimeException {
    public CustomException(String message) {
        super(message);
    }
}
```

2. Handle in GlobalExceptionHandler

### Performance Optimization

- Add database indexes
- Use lazy loading for relationships
- Enable query caching
- Monitor slow queries

## Useful Commands

```bash
# Build without tests
mvn clean install -DskipTests

# Check dependencies
mvn dependency:tree

# Format code
mvn formatter:format

# Update dependencies
mvn versions:update-properties

# Generate documentation
mvn javadoc:javadoc

# Clean build artifacts
mvn clean

# Run specific profile
mvn clean install -P prod
```

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [OpenAPI/Swagger](https://swagger.io/)
- [RESTful API Best Practices](https://restfulapi.net/)

## Support

For development questions or issues:
1. Check existing documentation
2. Search for similar issues in Git history
3. Contact development team at dev@abenterprises.com
