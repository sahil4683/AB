import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ContactService } from './services/contact.service';
import { Product, ProductService } from './services/product.service';
import { Category, CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly contactService = inject(ContactService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  protected readonly categories = signal<string[]>(['All Products']);

  protected readonly contactForm = this.fb.nonNullable.group({
    countryCode: ['+91', Validators.required],
    mobileNumber: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
    ],
  });

  protected readonly search = signal('');
  protected readonly sort = signal<'relevance' | 'name'>('relevance');
  protected readonly selectedCategory = signal('All Products');
  protected readonly showCatalog = signal(false);
  protected readonly productModalOpen = signal(false);
  protected readonly contactModalOpen = signal(false);
  protected readonly selectedProduct = signal<Product | null>(null);
  protected readonly statusMessage = signal<string | null>(null);

  // Keep sample data locally so the UI can still render if the API is down.
  private readonly fallbackProducts: Product[] = [
    {
      id: 1,
      title: 'R -2-Amino-2-(Cyclohexa-1,4-Dien-1-yl)Acetic Acid',
      casNumber: '26774-88-9',
      imageUrl: 'https://via.placeholder.com/400x300?text=Product+1',
      description: 'High purity chemical for research and industrial use.',
      category: 'Industrial Chemicals',
    },
    {
      id: 2,
      title:
        '2-acetamido-2-deoxy-alpha-d- Glucopyranosylchloride-3,4,6- Triacetate',
      casNumber: '-',
      imageUrl: 'https://via.placeholder.com/400x300?text=Product+2',
      description: 'Speciality reagent used in glycosylation reactions.',
      category: 'Laboratory Chemical',
    },
    {
      id: 3,
      title:
        '(4s)-4-(Aminomethyl)-1,3-Oxazolidin-2-One, 1hydrochloride Salt',
      casNumber: '-',
      imageUrl: 'https://via.placeholder.com/400x300?text=Product+3',
      description: 'Intermediate used in pharmaceutical synthesis.',
      category: 'Pharmaceutical Ingredients',
    },
    {
      id: 4,
      title: 'Anti-Human Igg (Gama-Chain Specific)-Fitc',
      casNumber: '-',
      imageUrl: 'https://via.placeholder.com/400x300?text=Product+4',
      description: 'Biological reagent for immunoassays.',
      category: 'Speciality Chemicals',
    },
    {
      id: 5,
      title: 'Dehydroisoandrosterone 3- Sulfate Sodium Salt Dihydrate',
      casNumber: '-',
      imageUrl: 'https://via.placeholder.com/400x300?text=Product+5',
      description: 'Steroid derivative for pharmaceutical applications.',
      category: 'Industrial Chemicals',
    },
    {
      id: 6,
      title: 'N-2-acetamido Phenethyl-1- Hydroxy-2-naphthamide',
      casNumber: '-',
      imageUrl: 'https://via.placeholder.com/400x300?text=Product+6',
      description: 'Chemical compound for research purposes.',
      category: 'Industrial Chemicals',
    },
    {
      id: 7,
      title: '3-acetamido-5-boronic Benzoic Acid',
      casNumber: '-',
      imageUrl: 'https://via.placeholder.com/400x300?text=Product+7',
      description: 'Boronic acid derivative for synthesis.',
      category: 'Industrial Chemicals',
    },
    {
      id: 8,
      title: '2-acetamido-5- Fluorobenzoic Acid',
      casNumber: '-',
      imageUrl: 'https://via.placeholder.com/400x300?text=Product+8',
      description: 'Fluorinated benzoic acid derivative.',
      category: 'Industrial Chemicals',
    },
  ];

  private readonly products = signal<Product[]>(this.fallbackProducts);

  protected readonly filteredProducts = computed(() => {
    let list = [...this.products()];
    const category = this.selectedCategory();
    const q = this.search().trim().toLowerCase();

    if (category !== 'All Products') {
      list = list.filter((p) => p.category === category);
    }

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.casNumber.toLowerCase().includes(q),
      );
    }

    if (this.sort() === 'name') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  });

  protected readonly featuredProducts = computed(() => {
    // When search is empty, show first eight as featured; otherwise honor query.
    const q = this.search().trim().toLowerCase();
    const list = !q
      ? this.products().slice(0, 8)
      : this.products()
          .filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.casNumber.toLowerCase().includes(q),
          )
          .slice(0, 8);

    return list;
  });

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchProducts();
  }

  private fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categoryList) => {
        const categoryNames = ['All Products', ...categoryList.map(cat => cat.name)];
        this.categories.set(categoryNames);
      },
      error: () => {
        // Fallback to hardcoded categories if API fails
        this.categories.set([
          'All Products',
          'Industrial Chemicals',
          'Laboratory Chemical',
          'Pharmaceutical Ingredients',
          'Solvents',
          'Speciality Chemicals',
        ]);
        this.statusMessage.set('Using default categories while API is offline.');
      },
    });
  }

  protected goToCatalog(): void {
    this.showCatalog.set(true);
    this.selectCategory('All Products');
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.showCatalog.set(true);
  }

  protected updateSearch(term: string): void {
    this.search.set(term);
  }

  protected updateSort(val: 'relevance' | 'name'): void {
    this.sort.set(val);
  }

  protected openProductModal(product: Product): void {
    this.selectedProduct.set(product);
    this.productModalOpen.set(true);
  }

  protected openContactModal(product?: Product): void {
    if (product) {
      this.selectedProduct.set(product);
    }
    this.contactModalOpen.set(true);
    this.productModalOpen.set(false);
    this.statusMessage.set(null);
  }

  protected closeModals(): void {
    this.productModalOpen.set(false);
    this.contactModalOpen.set(false);
    this.selectedProduct.set(null);
  }

  protected closeProductModal(): void {
    this.productModalOpen.set(false);
  }

  protected closeContactModal(): void {
    this.contactModalOpen.set(false);
  }

  protected submitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const { countryCode, mobileNumber } = this.contactForm.getRawValue();
    const productId = this.selectedProduct()?.id ?? null;

    // The backend call is best-effort; fallback to a success message on failure.
    this.contactService
      .sendContact({ countryCode, mobileNumber, productId })
      .subscribe({
        next: () => {
          this.statusMessage.set(
            'Thank you! We will contact you shortly.',
          );
          this.contactModalOpen.set(false);
          this.contactForm.reset({ countryCode: '+91', mobileNumber: '' });
        },
        error: () => {
          this.statusMessage.set(
            'Request noted. We will reach out soon.',
          );
          this.contactModalOpen.set(false);
          this.contactForm.reset({ countryCode: '+91', mobileNumber: '' });
        },
      });
  }

  private fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (list) => {
        this.products.set(list && list.length ? list : this.fallbackProducts);
      },
      error: () => {
        this.products.set(this.fallbackProducts);
        this.statusMessage.set('Using sample catalog while API is offline.');
      },
    });
  }
}
