# Multi-stage build for optimized Docker image

# Stage 1: Build
FROM eclipse-temurin:17-jdk-focal AS builder

WORKDIR /build

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN apt-get update && apt-get install -y maven && \
    mvn dependency:resolve

# Copy source code
COPY src src

# Build application
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-focal

WORKDIR /app

# Create non-root user for security
RUN useradd -m -u 1000 appuser

# Copy JAR from builder
COPY --from=builder /build/target/ab-backend-1.0.0.jar app.jar

# Set permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD java -cp app.jar org.springframework.boot.loader.JarLauncher

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
