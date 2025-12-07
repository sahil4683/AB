import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../services/category.service';
import { ContactService } from '../services/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  // Signals for state management
  search = signal('');
  sort = signal('relevance');
  selectedCategory = signal('All Products');
  productModalOpen = signal(false);
  contactModalOpen = signal(false);
  selectedProduct = signal<Product | null>(null);
  statusMessage = signal('');
  searchFocused = signal(false);

  // Data signals
  categoriesData = signal<string[]>(['All Products']);
  productsData = signal<Product[]>([]);

  // Reactive form for contact
  contactForm: FormGroup;

  // Computed signals
  filteredProducts = computed(() => {
    let prods = this.productsData();
    const cat = this.selectedCategory();
    const searchTerm = this.search().toLowerCase();
    if (cat !== 'All Products') {
      prods = prods.filter(p => {
        return p.category === cat;
      });
    }

    if (searchTerm) {
      prods = prods.filter(p =>
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
    return this.productsData().filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.casNumber?.toLowerCase().includes(searchTerm)
    );
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      countryCode: ['+91', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categoriesData.set(['All Products', ...cats.map(c => c.name)]);
    });
    this.productService.getProducts().subscribe(prods => {
      this.productsData.set(prods);
    });
    // Scroll to top when `filteredProducts` changes
    effect(() => {
      const _ = this.filteredProducts();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  updateSearch(value: string) {
    this.search.set(value);
  }

  clearSearch() {
    this.search.set('');
  }

  onSearchBarFocus() {
    this.selectedCategory.set('All Products');
    this.searchFocused.set(true);
  }

  updateSort(value: string) {
    this.sort.set(value);
  }

  selectCategory(cat: string) {
    this.selectedCategory.set(cat);
    this.clearSearch();
  }

  openProductModal(product: Product) {
    this.selectedProduct.set(product);
    this.productModalOpen.set(true);
  }

  closeProductModal() {
    this.productModalOpen.set(false);
    this.selectedProduct.set(null);
  }

  openContactModal(product: Product) {
    this.selectedProduct.set(product);
    this.contactModalOpen.set(true);
  }

  closeContactModal() {
    this.contactModalOpen.set(false);
    // this.selectedProduct.set(null);
    this.contactForm.reset({ countryCode: '+91' });
  }

  submitContactForm() {
    if (this.contactForm.valid && this.selectedProduct()) {
      const { mobileNumber, countryCode } = this.contactForm.value;
      const fullNumber = `${countryCode}${mobileNumber}`;
      const product = this.selectedProduct();

      const contactData = {
        mobileNumber: fullNumber,
        product: product!.title,
        productId: product!.id,
        countryCode: countryCode
      };

      this.contactService.submitContact(contactData).subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Your inquiry has been sent. We will contact you soon.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.closeContactModal();
      });
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
