import { Component, OnInit, OnDestroy, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService, Product } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { ContactService } from '../services/contact.service';
import { LoggerService } from '../core/services/logger.service';
import { SanitizationService } from '../core/services/sanitization.service';
import Swal from 'sweetalert2';

/**
 * Products Component
 * Displays product catalog with filtering, search, and contact functionality
 */
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Signals for state management
  search = signal('');
  sort = signal('relevance');
  selectedCategory = signal('All Products');
  productModalOpen = signal(false);
  contactModalOpen = signal(false);
  selectedProduct = signal<Product | null>(null);
  statusMessage = signal('');
  searchFocused = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Data signals
  categoriesData = signal<string[]>(['All Products']);
  productsData = signal<Product[]>([]);

  // Reactive form for contact
  contactForm: FormGroup;

  // Cleanup subject
  private readonly destroy$ = new Subject<void>();

  // Computed signals
  filteredProducts = computed(() => {
    let prods = this.productsData();
    const cat = this.selectedCategory();
    const searchTerm = this.search().toLowerCase();

    if (cat !== 'All Products') {
      prods = prods.filter((p) => p.category === cat);
    }

    if (searchTerm) {
      prods = prods.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.casNumber?.toLowerCase().includes(searchTerm)
      );
    }

    if (this.sort() === 'name') {
      prods = [...prods].sort((a, b) => a.title.localeCompare(b.title));
    }

    return prods;
  });

  suggestedProducts = computed(() => {
    const searchTerm = this.search().toLowerCase();
    if (!searchTerm) return [];
    return this.productsData().filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.casNumber?.toLowerCase().includes(searchTerm)
    );
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private router: Router,
    private fb: FormBuilder,
    private logger: LoggerService,
    private sanitization: SanitizationService
  ) {
    this.contactForm = this.fb.group({
      countryCode: ['+91', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.setupScrollToTop();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load categories from API
   */
  private loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cats) => {
          this.categoriesData.set(['All Products', ...cats.map((c) => c.name)]);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.handleError('Failed to load categories', error);
          this.isLoading.set(false);
        },
      });
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
          this.isLoading.set(false);
        },
        error: (error) => {
          this.handleError('Failed to load products', error);
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Setup scroll to top effect
   */
  private setupScrollToTop(): void {
    effect(() => {
      const _ = this.filteredProducts();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /**
   * Update search input
   */
  updateSearch(value: string): void {
    const sanitized = this.sanitization.sanitizeInput(value);
    this.search.set(sanitized);
  }

  /**
   * Clear search input
   */
  clearSearch(): void {
    this.search.set('');
  }

  /**
   * Handle search bar focus
   */
  onSearchBarFocus(): void {
    this.selectedCategory.set('All Products');
    this.searchFocused.set(true);
  }

  /**
   * Update sort option
   */
  updateSort(value: string): void {
    this.sort.set(value);
  }

  /**
   * Select category
   */
  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.clearSearch();
  }

  /**
   * Open product detail modal
   */
  openProductModal(product: Product): void {
    this.selectedProduct.set(product);
    this.productModalOpen.set(true);
  }

  /**
   * Close product detail modal
   */
  closeProductModal(): void {
    this.productModalOpen.set(false);
    this.selectedProduct.set(null);
  }

  /**
   * Open contact form modal
   */
  openContactModal(product: Product): void {
    this.selectedProduct.set(product);
    this.contactModalOpen.set(true);
  }

  /**
   * Close contact form modal
   */
  closeContactModal(): void {
    this.contactModalOpen.set(false);
    this.contactForm.reset({ countryCode: '+91' });
  }

  /**
   * Submit contact form
   */
  submitContactForm(): void {
    if (!this.contactForm.valid || !this.selectedProduct()) {
      this.handleError('Please fill in all required fields');
      return;
    }

    const { mobileNumber, countryCode } = this.contactForm.value;

    // Validate phone number
    if (!this.sanitization.isValidPhoneNumber(mobileNumber)) {
      this.handleError('Invalid phone number format');
      return;
    }

    const fullNumber = `${countryCode}${mobileNumber}`;
    const product = this.selectedProduct();

    const contactData = {
      mobileNumber: fullNumber,
      product: product!.title,
      productId: product!.id,
      countryCode: countryCode,
    };

    this.isLoading.set(true);

    this.contactService
      .submitContact(contactData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.logger.info('Contact request submitted successfully');
          Swal.fire({
            title: 'Success!',
            text: 'Your inquiry has been sent. We will contact you soon.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.closeContactModal();
          this.isLoading.set(false);
        },
        error: (error) => {
          this.handleError('Failed to submit contact form', error);
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Navigate to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Handle errors consistently
   */
  private handleError(message: string, error?: any): void {
    this.logger.error(message, error);
    this.errorMessage.set(message);

    if (error?.message) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    // Clear error message after 5 seconds
    setTimeout(() => {
      this.errorMessage.set(null);
    }, 5000);
  }
}

