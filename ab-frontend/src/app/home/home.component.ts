import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  productsData = signal<Product[]>([]);

  featuredProducts = computed(() => {
    return this.productsData().slice(0, 6);
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(prods => {
      this.productsData.set(prods);
    });
  }

  goToCatalog() {
    this.router.navigate(['/products']);
  }

  openProductModal(product: Product) {
    this.router.navigate(['/products']);
  }

  openContactModal(product: Product) {
    this.router.navigate(['/products']);
  }
}
