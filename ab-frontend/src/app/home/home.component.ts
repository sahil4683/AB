import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService, Product } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { LoggerService } from '../core/services/logger.service';

/**
 * Home Component
 * Displays featured products on the home page
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  productsData = signal<Product[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private readonly destroy$ = new Subject<void>();

  featuredProducts = computed(() => {
    return this.productsData().slice(0, 6);
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load products from API
   */
  private loadProducts(): void {
    this.isLoading.set(true);
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prods) => {
          this.productsData.set(prods);
          this.logger.info(`Loaded ${prods.length} featured products`);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.handleError('Failed to load featured products', error);
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Navigate to product catalog
   */
  goToCatalog(): void {
    this.router.navigate(['/products']);
  }

  /**
   * Navigate to product details
   */
  openProductModal(product: Product): void {
    this.router.navigate(['/products']);
  }

  /**
   * Navigate to contact modal
   */
  openContactModal(product: Product): void {
    this.router.navigate(['/products']);
  }

  /**
   * Handle errors consistently
   */
  private handleError(message: string, error?: any): void {
    this.logger.error(message, error);
    this.errorMessage.set(message);

    // Clear error message after 5 seconds
    setTimeout(() => {
      this.errorMessage.set(null);
    }, 5000);
  }
}

