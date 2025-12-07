import { AfterViewInit, Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../services/category.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  
  // Search signals
  categorySearch = signal('');
  productSearch = signal('');

  productForm: FormGroup;
  categoryForm: FormGroup;

  // Computed filtered lists
  filteredCategories = computed(() => {
    const searchTerm = this.categorySearch().toLowerCase();
    if (!searchTerm) return this.categories();
    return this.categories().filter(cat =>
      cat.name.toLowerCase().includes(searchTerm) ||
      cat.slug.toLowerCase().includes(searchTerm)
    );
  });

  filteredProducts = computed(() => {
    const searchTerm = this.productSearch().toLowerCase();
    if (!searchTerm) return this.products();
    return this.products().filter(prod =>
      prod.title.toLowerCase().includes(searchTerm) ||
      prod.casNumber?.toLowerCase().includes(searchTerm) ||
      prod.category?.toLowerCase().includes(searchTerm)
    );
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      casNumber: [''],
      imageUrl: [''],
      description: [''],
      categoryId: ['', Validators.required]
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      url: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  ngAfterViewInit(): void {
   
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }

  onSubmitProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const selectedCategory = this.categories().find(c => c.id === +formValue.categoryId);

      const product: Omit<Product, 'id'> = {
        title: formValue.title,
        casNumber: formValue.casNumber,
        imageUrl: formValue.imageUrl,
        description: formValue.description,
        category: selectedCategory ? selectedCategory.name : '',
        categoryEntity: selectedCategory,
        slug: '',
        anchor: ''
      };

      this.productService.createProduct(product).subscribe(() => {
        this.productForm.reset();
        this.loadProducts();
        Swal.fire({
          title: 'Success!',
          text: 'Product added successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      });
    }
  }

  onSubmitCategory(): void {
    if (this.categoryForm.valid) {
      const category: Omit<Category, 'id'> = {
        name: this.categoryForm.value.name,
        slug: this.categoryForm.value.slug,
        url: this.categoryForm.value.url
      };

      this.categoryService.createCategory(category).subscribe(() => {
        this.categoryForm.reset();
        this.loadCategories();
        Swal.fire({
          title: 'Success!',
          text: 'Category added successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      });
    }
  }

  deleteProduct(productId: number, productTitle: string): void {
    Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to delete "${productTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(() => {
          this.loadProducts();
          Swal.fire({
            title: 'Deleted!',
            text: 'Product deleted successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }, (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete product',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }

  deleteCategory(categoryId: number, categoryName: string): void {
    Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete "${categoryName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(categoryId).subscribe(() => {
          this.loadCategories();
          Swal.fire({
            title: 'Deleted!',
            text: 'Category deleted successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }, (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete category',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }
}