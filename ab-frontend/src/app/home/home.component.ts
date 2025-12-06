import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../services/category.service';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  // Signals for state management
  search = signal('');
  sort = signal('relevance');
  selectedCategory = signal('All Products');
  showCatalog = signal(false);
  productModalOpen = signal(false);
  contactModalOpen = signal(false);
  selectedProduct = signal<Product | null>(null);
  statusMessage = signal('');

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

  featuredProducts = computed(() => {
    const searchTerm = this.search().toLowerCase();
    let prods = this.productsData();

    if (searchTerm) {
      prods = prods.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.casNumber?.toLowerCase().includes(searchTerm)
      );
    }

    return prods.slice(0, 6);
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private contactService: ContactService,
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
      // Access the computed signal so this effect runs when it changes
      const _ = this.filteredProducts();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  updateSearch(value: string) {
    this.search.set(value);
  }

  updateSort(value: string) {
    this.sort.set(value);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.showCatalog.set(true);
    // Scroll to top when `filteredProducts` changes
    effect(() => {
      // Access the computed signal so this effect runs when it changes
      const _ = this.filteredProducts();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  goToCatalog() {
    this.showCatalog.set(true);
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
    this.selectedProduct.set(null);
  }

  closeModals() {
    this.productModalOpen.set(false);
    this.contactModalOpen.set(false);
    this.selectedProduct.set(null);
  }

  submitContact() {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const contactData = {
        mobileNumber: `${formValue.countryCode}${formValue.mobileNumber}`,
        product: this.selectedProduct()?.title || '',
      };

      this.contactService.submitContact(contactData).subscribe({
        next: () => {
          this.statusMessage.set('Thank you! We will contact you soon.');
          this.contactForm.reset({ countryCode: '+91' });
          setTimeout(() => this.closeContactModal(), 2000);
        },
        error: () => {
          this.statusMessage.set('Error submitting contact. Please try again.');
        },
      });
    }
  }
}
