import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];

  productForm: FormGroup;
  categoryForm: FormGroup;

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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  onSubmitProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const selectedCategory = this.categories.find(c => c.id === +formValue.categoryId);

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
}