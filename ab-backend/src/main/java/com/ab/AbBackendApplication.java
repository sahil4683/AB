package com.ab;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.ab.model.Product;
import com.ab.repository.ProductRepository;

@SpringBootApplication
public class AbBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AbBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner seedProducts(ProductRepository productRepository) {
		return args -> {
			if (productRepository.count() == 0) {
				productRepository.save(new Product(
						"R -2-Amino-2-(Cyclohexa-1,4-Dien-1-yl)Acetic Acid",
						"26774-88-9",
						"https://via.placeholder.com/400x300?text=Product+1",
						"High purity chemical for research and industrial use.",
						"Industrial Chemicals"));

				productRepository.save(new Product(
						"2-acetamido-2-deoxy-alpha-d- Glucopyranosylchloride-3,4,6- Triacetate",
						"-",
						"https://via.placeholder.com/400x300?text=Product+2",
						"Speciality reagent used in glycosylation reactions.",
						"Laboratory Chemical"));

				productRepository.save(new Product(
						"(4s)-4-(Aminomethyl)-1,3-Oxazolidin-2-One, 1hydrochloride Salt",
						"-",
						"https://via.placeholder.com/400x300?text=Product+3",
						"Intermediate used in pharmaceutical synthesis.",
						"Pharmaceutical Ingredients"));

				productRepository.save(new Product(
						"Anti-Human Igg (Gama-Chain Specific)-Fitc",
						"-",
						"https://via.placeholder.com/400x300?text=Product+4",
						"Biological reagent for immunoassays.",
						"Speciality Chemicals"));
			}
		};
	}

}
