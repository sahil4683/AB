import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../services/category.service';
import { ContactService, ContactRequest } from '../services/contact.service';
import { LoggerService } from '../core/services/logger.service';
import { SanitizationService } from '../core/services/sanitization.service';
import Swal from 'sweetalert2';

/**
 * Admin Component
 * Manages products, categories, and contact requests
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  contactRequests = signal<ContactRequest[]>([]);

  // Search signals
  categorySearch = signal('');
  productSearch = signal('');
  contactSearch = signal('');

  // Loading states
  isLoadingCategories = signal(false);
  isLoadingProducts = signal(false);
  isLoadingContacts = signal(false);

  productForm: FormGroup;
  categoryForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  // Computed filtered lists
  filteredCategories = computed(() => {
    const searchTerm = this.categorySearch().toLowerCase();
    if (!searchTerm) return this.categories();
    return this.categories().filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm) ||
        cat.slug.toLowerCase().includes(searchTerm)
    );
  });

  filteredProducts = computed(() => {
    const searchTerm = this.productSearch().toLowerCase();
    if (!searchTerm) return this.products();
    return this.products().filter(
      (prod) =>
        prod.title.toLowerCase().includes(searchTerm) ||
        prod.casNumber?.toLowerCase().includes(searchTerm) ||
        prod.category?.toLowerCase().includes(searchTerm)
    );
  });

  filteredContactRequests = computed(() => {
    const searchTerm = this.contactSearch().toLowerCase();
    if (!searchTerm) return this.contactRequests();
    return this.contactRequests().filter(
      (req) =>
        req.mobileNumber?.toLowerCase().includes(searchTerm) ||
        req.countryCode?.toLowerCase().includes(searchTerm)
    );
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private logger: LoggerService,
    private sanitization: SanitizationService
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      casNumber: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', Validators.required],
    });

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', Validators.required],
      url: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadContactRequests();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load categories from API
   */
  private loadCategories(): void {
    this.isLoadingCategories.set(true);
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.isLoadingCategories.set(false);
        },
        error: (error) => {
          this.handleError('Failed to load categories', error);
          this.isLoadingCategories.set(false);
        },
      });
  }

  /**
   * Load products from API
   */
  private loadProducts(): void {
    this.isLoadingProducts.set(true);
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.isLoadingProducts.set(false);
        },
        error: (error) => {
          this.handleError('Failed to load products', error);
          this.isLoadingProducts.set(false);
        },
      });
  }

  /**
   * Load contact requests from API
   */
  private loadContactRequests(): void {
    this.isLoadingContacts.set(true);
    this.contactService
      .getContactRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests) => {
          this.contactRequests.set(requests);
          this.isLoadingContacts.set(false);
        },
        error: (error) => {
          this.handleError('Failed to load contact requests', error);
          this.isLoadingContacts.set(false);
        },
      });
  }

  /**
   * Submit product form
   */
  onSubmitProduct(): void {
    if (!this.productForm.valid) {
      this.handleError('Please fill in all required fields correctly');
      return;
    }

    const formValue = this.productForm.value;
    const selectedCategory = this.categories().find((c) => c.id === +formValue.categoryId);

    if (!selectedCategory) {
      this.handleError('Please select a valid category');
      return;
    }

    const product: Omit<Product, 'id'> = {
      title: this.sanitization.sanitizeInput(formValue.title),
      casNumber: this.sanitization.sanitizeInput(formValue.casNumber),
      imageUrl: formValue.imageUrl,
      description: this.sanitization.sanitizeInput(formValue.description),
      category: selectedCategory.name,
      categoryEntity: selectedCategory,
      slug: '',
      anchor: '',
    };

    this.productService
      .createProduct(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.productForm.reset();
          this.loadProducts();
          this.logger.info('Product created successfully');
          Swal.fire({
            title: 'Success!',
            text: 'Product added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error) => {
          this.handleError('Failed to create product', error);
        },
      });
  }

  /**
   * Submit category form
   */
  onSubmitCategory(): void {
    if (!this.categoryForm.valid) {
      this.handleError('Please fill in all required fields correctly');
      return;
    }

    const category: Omit<Category, 'id'> = {
      name: this.sanitization.sanitizeInput(this.categoryForm.value.name),
      slug: this.sanitization.sanitizeInput(this.categoryForm.value.slug),
      url: this.categoryForm.value.url,
    };

    this.categoryService
      .createCategory(category)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categoryForm.reset();
          this.loadCategories();
          this.logger.info('Category created successfully');
          Swal.fire({
            title: 'Success!',
            text: 'Category added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error) => {
          this.handleError('Failed to create category', error);
        },
      });
  }

  /**
   * Delete product with confirmation
   */
  deleteProduct(productId: number, productTitle: string): void {
    Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to delete "${productTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService
          .deleteProduct(productId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadProducts();
              this.logger.info('Product deleted successfully');
              Swal.fire({
                title: 'Deleted!',
                text: 'Product deleted successfully',
                icon: 'success',
                confirmButtonText: 'OK',
              });
            },
            error: (error) => {
              this.handleError('Failed to delete product', error);
            },
          });
      }
    });
  }

  /**
   * Delete category with confirmation
   */
  deleteCategory(categoryId: number, categoryName: string): void {
    Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete "${categoryName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService
          .deleteCategory(categoryId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadCategories();
              this.logger.info('Category deleted successfully');
              Swal.fire({
                title: 'Deleted!',
                text: 'Category deleted successfully',
                icon: 'success',
                confirmButtonText: 'OK',
              });
            },
            error: (error) => {
              this.handleError('Failed to delete category', error);
            },
          });
      }
    });
  }

  /**
   * Toggle contact request completion status
   */
  toggleContactComplete(request: ContactRequest): void {
    if (!request.id) {
      this.handleError('Invalid contact request');
      return;
    }

    const updatedRequest = {
      ...request,
      complete: !request.complete,
    };

    this.contactService
      .updateContactRequest(request.id, updatedRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadContactRequests();
          this.logger.info('Contact request updated successfully');
        },
        error: (error) => {
          this.handleError('Failed to update contact request', error);
        },
      });
  }

  /**
   * Handle errors consistently
   */
  private handleError(message: string, error?: any): void {
    this.logger.error(message, error);

    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
}
