# Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

```bash
# 1. Clone & Setup
git clone https://github.com/yourorg/ab-backend.git
cd ab-backend
cp .env.template .env

# 2. Edit .env with your database credentials
nano .env

# 3. Build and Run
mvn clean install
mvn spring-boot:run -Dspring-boot.run.arguments='--spring.profiles.active=dev'

# 4. Access Application
# API Documentation: http://localhost:8080/swagger-ui.html
# API Base: http://localhost:8080/api
```

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `pom.xml` | Maven configuration & dependencies |
| `application.properties` | Main configuration |
| `application-dev.properties` | Development overrides |
| `application-prod.properties` | Production overrides |
| `README_PRODUCTION.md` | Production deployment guide |
| `API_CONTRACT.md` | API specifications |
| `DEVELOPMENT_GUIDE.md` | Developer guide |
| `TRANSFORMATION_SUMMARY.md` | What was changed |
| `DEPLOYMENT_CHECKLIST.md` | Pre-deployment checklist |

---

## 🔧 Common Commands

```bash
# Build
mvn clean package

# Run tests
mvn test

# Run with profile
mvn spring-boot:run -Dspring-boot.run.arguments='--spring.profiles.active=dev'

# Generate documentation
mvn javadoc:javadoc

# Check dependencies
mvn dependency:tree

# Docker
docker build -t ab-backend:1.0.0 .
docker-compose up -d

# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

---

## 📍 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product
- `GET /api/products/search?q=query` - Search
- `POST /api/products` - Create
- `PUT /api/products/{id}` - Update
- `DELETE /api/products/{id}` - Delete

### Categories
- `GET /api/categories` - List all
- `GET /api/categories/{id}` - Get one
- `GET /api/categories/slug/{slug}` - Get by slug
- `POST /api/categories` - Create
- `PUT /api/categories/{id}` - Update
- `DELETE /api/categories/{id}` - Delete

### Contact Requests
- `GET /api/contact-requests` - List all
- `GET /api/contact-requests/{id}` - Get one
- `POST /api/contact-requests` - Create
- `PUT /api/contact-requests/{id}` - Update
- `DELETE /api/contact-requests/{id}` - Delete

---

## 🗂️ Project Structure

```
src/main/java/com/ab/
├── controller/          ← REST endpoints
├── service/            ← Business logic
├── repository/         ← Database access
├── model/             ← JPA entities
├── dto/               ← API models
├── mapper/            ← Entity ↔ DTO
├── config/            ← Spring configs
├── exception/         ← Error handling
└── util/              ← Utilities
```

---

## 🔍 Debugging

### View Logs
```bash
# Development
tail -f logs/application.log | grep ERROR

# Production
tail -f /var/log/ab-backend/application.log
```

### Debug Mode
```bash
mvn spring-boot:run -Dspring-boot.run.arguments='--spring.profiles.active=dev' -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

### Database Query Issues
```sql
-- Check connection
SELECT 1;

-- View tables
SHOW TABLES;

-- Check indexes
SHOW INDEXES FROM products;
```

---

## ✅ Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=ProductControllerTest

# Coverage report
mvn clean test jacoco:report
# Open: target/site/jacoco/index.html
```

---

## 🌍 Environment Profiles

### Development
```bash
mvn spring-boot:run -Dspring-boot.run.arguments='--spring.profiles.active=dev'
# Features: DEBUG logging, formatted SQL, auto DDL
```

### Production
```bash
java -jar target/ab-backend-1.0.0.jar --spring.profiles.active=prod
# Features: INFO logging, optimized queries, validate DDL
```

---

## 🐳 Docker

### Build
```bash
docker build -t ab-backend:1.0.0 .
```

### Run
```bash
docker run -p 8080:8080 \
  -e DB_HOST=localhost \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=password \
  ab-backend:1.0.0
```

### Docker Compose
```bash
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose ps             # Status
```

---

## 🔒 Security Checklist

- [ ] Change default database passwords
- [ ] Update CORS allowed origins
- [ ] Use HTTPS in production
- [ ] Secure environment variables
- [ ] Implement Spring Security (for sensitive data)
- [ ] Regular security scanning
- [ ] Backup strategy in place

---

## 📊 Key Technologies

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Spring Boot | 3.3.4 |
| Language | Java | 17 |
| Database | MySQL | 8.0+ |
| Build | Maven | 3.8+ |
| ORM | Hibernate/JPA | Latest |
| Logging | SLF4J/Logback | Latest |
| API Docs | OpenAPI/Swagger | 3.0 |

---

## 🆘 Troubleshooting

### Port 8080 Already in Use
```bash
# Kill process
lsof -ti:8080 | xargs kill -9

# Or use different port
mvn spring-boot:run -Dspring-boot.run.arguments='--server.port=8081'
```

### Database Connection Failed
```bash
# Verify credentials
mysql -h localhost -u root -p

# Check application.properties
# Verify MySQL is running
sudo service mysql status
```

### Build Fails
```bash
# Clean and rebuild
mvn clean install -DskipTests

# Check Java version
java -version  # Should be 17+

# Check Maven version
mvn -version
```

### Out of Memory
```bash
# Increase heap size
export MAVEN_OPTS="-Xmx1024m"
mvn clean install
```

---

## 📞 Support Resources

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs
- **Documentation**: See README_PRODUCTION.md
- **API Contract**: See API_CONTRACT.md
- **Dev Guide**: See DEVELOPMENT_GUIDE.md

---

## 📝 Configuration Examples

### Database Dev
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ab_enterprises_dev
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

### Database Prod
```properties
spring.datasource.url=jdbc:mysql://${DB_HOST}:3306/${DB_NAME}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
```

### CORS
```properties
app.cors.allowed-origins=http://localhost:4200,https://app.example.com
app.cors.allowed-methods=GET,POST,PUT,DELETE
app.cors.max-age=3600
```

---

## ⚡ Performance Tips

1. **Database Queries**: Check indexes on frequently queried columns
2. **Connection Pool**: Adjust HikariCP settings based on load
3. **Caching**: Implement Spring Cache for frequently accessed data
4. **Pagination**: Add pagination for large result sets
5. **Batch Processing**: Use batch inserts/updates for bulk operations

---

## 🚨 Emergency Procedures

### Application Crash
```bash
# 1. Check logs
tail -f logs/application.log

# 2. Check database connectivity
mysql -h localhost -u root -p

# 3. Restart application
mvn spring-boot:run
```

### Database Issues
```bash
# 1. Check MySQL status
sudo service mysql status

# 2. Check connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# 3. Restart MySQL
sudo service mysql restart
```

### High Memory Usage
```bash
# Check process
ps aux | grep java

# Kill and restart with lower memory
kill -9 <PID>
java -Xmx512m -jar target/ab-backend-1.0.0.jar
```

---

## 📅 Maintenance Schedule

- **Daily**: Monitor logs and health
- **Weekly**: Check performance metrics
- **Monthly**: Update dependencies and patches
- **Quarterly**: Major version updates and security reviews

---

## 🎯 Next Steps

1. ✅ Review TRANSFORMATION_SUMMARY.md
2. ✅ Read README_PRODUCTION.md
3. ✅ Study API_CONTRACT.md
4. ✅ Follow DEVELOPMENT_GUIDE.md
5. ✅ Review DEPLOYMENT_CHECKLIST.md
6. ✅ Check code in each package
7. ✅ Run tests: `mvn test`
8. ✅ Start application: `mvn spring-boot:run`
9. ✅ Visit Swagger: http://localhost:8080/swagger-ui.html
10. ✅ Test endpoints with Postman or curl

---

**Version**: 1.0.0  
**Last Updated**: December 8, 2024  
**Status**: ✅ Production Ready
