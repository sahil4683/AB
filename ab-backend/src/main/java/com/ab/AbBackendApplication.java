package com.ab;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot application entry point.
 * Initializes the AB Enterprises Backend API.
 */
@Slf4j
@SpringBootApplication
public class AbBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AbBackendApplication.class, args);
		log.info("AB Enterprises Backend API started successfully");
	}
}
