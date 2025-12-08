# Code Style Guide

## Naming Conventions

### Classes
- Use **PascalCase** for class names
- Use descriptive, meaningful names
- Suffix component classes with `Component`
- Suffix service classes with `Service`
- Suffix directives with `Directive`
- Suffix pipes with `Pipe`
- Suffix guards with `Guard`

```typescript
// ✅ Good
export class ProductService { }
export class AdminComponent { }
export class AuthGuard { }
export class DateFormatPipe { }

// ❌ Bad
export class product_service { }
export class Admin_Comp { }
export class auth { }
```

### Variables and Methods
- Use **camelCase**
- Use descriptive names
- Use verb prefixes for methods (get, set, is, has, etc.)

```typescript
// ✅ Good
private currentUser: User;
getProductById(id: number): Observable<Product> { }
isValidEmail(email: string): boolean { }
hasPermission(permission: string): boolean { }

// ❌ Bad
private _user: User;
private user_data;
getProduct() { }
validate(email: string) { }
```

### Constants
- Use **UPPER_SNAKE_CASE** for constants
- Group related constants in objects

```typescript
// ✅ Good
const MAX_PRODUCTS_PER_PAGE = 20;
const API_TIMEOUT = 30000;

const DEFAULT_CONFIG = {
  PAGE_SIZE: 20,
  CACHE_TTL: 3600,
};

// ❌ Bad
const maxProductsPerPage = 20;
const api_timeout = 30000;
```

### Private Members
- Prefix private members with `private readonly` when possible
- Don't use underscore prefix (TypeScript convention)

```typescript
// ✅ Good
private readonly productService = inject(ProductService);
private readonly destroy$ = new Subject<void>();

// ❌ Bad
private _productService;
private destroy$;
```

## Type Definitions

### Interfaces
- Use `interface` for contracts
- Prefix optional properties with `?`
- Don't use `I` prefix (not conventional in modern TypeScript)

```typescript
// ✅ Good
export interface Product {
  id: number;
  title: string;
  description?: string;
}

// ❌ Bad
export interface IProduct {
  id: number;
  title: string;
  description: string | undefined;
}
```

### Types
- Use `type` for union types and aliases
- Use `interface` for object structures

```typescript
// ✅ Good
type SortOrder = 'asc' | 'desc';
type NotificationLevel = 'info' | 'warning' | 'error';

// Use interface for objects
export interface Product {
  id: number;
  title: string;
}
```

## File Organization

### File Structure
```
component-name/
├── component-name.component.ts          # Component logic
├── component-name.component.html        # Template
├── component-name.component.scss        # Styles
└── component-name.component.spec.ts     # Tests
```

### Import Order
1. Angular imports
2. Third-party imports
3. Local imports (core)
4. Local imports (features)

```typescript
// ✅ Good
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { BaseApiService } from '../core/services/base-api.service';
import { ProductService } from '../services/product.service';
```

## Component Structure

### Component Template
```typescript
@Component({
  selector: 'app-products',        // Use 'app-' prefix
  standalone: true,                 // Use standalone components
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
```

### Component Class
```typescript
export class ProductsComponent implements OnInit, OnDestroy {
  // 1. Signals first
  protected readonly products = signal<Product[]>([]);
  protected readonly isLoading = signal(false);

  // 2. Computed signals
  filteredProducts = computed(() => {
    return this.products().filter(/* ... */);
  });

  // 3. Observable cleanup subject
  private readonly destroy$ = new Subject<void>();

  // 4. Constructor (dependency injection)
  constructor(
    private productService: ProductService,
    private logger: LoggerService
  ) {}

  // 5. Lifecycle hooks
  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 6. Public methods
  loadProducts(): void {
    // Implementation
  }

  // 7. Protected/private methods
  private handleError(error: any): void {
    // Implementation
  }
}
```

## Service Structure

### Service Class
```typescript
@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseApiService {
  private readonly endpoint = '/products';

  constructor(http: HttpClient, logger: LoggerService) {
    super(http, logger);
  }

  // Public methods
  getProducts(): Observable<Product[]> {
    return this.get<Product[]>(this.endpoint);
  }

  // Private methods
  private formatData(data: any): Product {
    return { /* ... */ };
  }
}
```

## Comments and Documentation

### JSDoc Comments
```typescript
/**
 * Loads products from the API
 * @param category - Optional category filter
 * @returns Observable of products array
 */
public getProducts(category?: string): Observable<Product[]> {
  return this.get<Product[]>('/products');
}
```

### Inline Comments
```typescript
// Use for complex logic only
if (products.length > 0 && !isFiltered) {
  // Only apply default sorting if not already filtered
  this.applyDefaultSort();
}
```

### TODO Comments
```typescript
// TODO: Implement pagination
// FIXME: Handle edge case for empty products
// NOTE: This is a workaround for Angular issue #xxxxx
```

## Code Quality

### Variable Declaration
- Always declare with `const` by default
- Use `let` only if reassignment is needed
- Never use `var`

```typescript
// ✅ Good
const products = signal<Product[]>([]);
let searchTerm = '';

// ❌ Bad
var products = [];
let products = signal<Product[]>([]);
```

### Arrow Functions
- Use arrow functions for callbacks
- Use regular functions for methods

```typescript
// ✅ Good
this.products().map(p => p.title)
this.service.getProducts().subscribe(data => { /* ... */ })

// Method in class
getProduct(id: number): Product { }

// ❌ Bad
this.products().map(function(p) { return p.title; })
```

### Optional Chaining and Nullish Coalescing
```typescript
// ✅ Good - Use optional chaining
const category = product?.category?.name;

// ✅ Good - Use nullish coalescing
const title = product?.title ?? 'Unknown';

// ❌ Bad
const category = product && product.category && product.category.name;
const title = product?.title || 'Unknown';
```

## Error Handling

### Observable Error Handling
```typescript
// ✅ Good
this.service.getProducts()
  .pipe(
    catchError(error => {
      this.logger.error('Failed to load products', error);
      return throwError(() => new Error('Product loading failed'));
    })
  )
  .subscribe({
    next: (data) => { /* ... */ },
    error: (error) => { /* ... */ }
  });

// ❌ Bad
this.service.getProducts().subscribe(
  data => { /* ... */ },
  error => console.log(error) // Not using logger
);
```

### Form Validation
```typescript
// ✅ Good
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});

if (this.form.valid) {
  this.submitForm();
}

// ❌ Bad
if (email && email.includes('@')) {
  // Manual validation
}
```

## RxJS Best Practices

### Subscription Management
```typescript
// ✅ Good - Use takeUntil
this.service.getData()
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => { /* ... */ });

// ✅ Good - Use async pipe in template
{{ data$ | async }}

// ❌ Bad - Manual subscription without cleanup
subscription = this.service.getData().subscribe(data => { /* ... */ });
```

### Operators
```typescript
// ✅ Good - Proper operator usage
this.service.getProducts()
  .pipe(
    tap(data => this.logger.info('Data loaded')),
    map(products => products.filter(p => p.active)),
    catchError(error => {
      this.logger.error('Error', error);
      return throwError(() => error);
    })
  );

// ❌ Bad
this.service.getProducts()
  .subscribe(data => {
    data.forEach(p => {
      if (p.active) {
        console.log(p);
      }
    });
  });
```

## Template Style Guide

### Event Binding
```html
<!-- ✅ Good -->
<button (click)="loadProducts()">Load</button>
<input (change)="updateSearch($event.target.value)" />

<!-- ❌ Bad -->
<button onclick="loadProducts()">Load</button>
<button (click)="loadProducts; return false;">Load</button>
```

### Property Binding
```html
<!-- ✅ Good -->
<div [class.active]="isActive()">Active</div>
<input [value]="productName()" [disabled]="isLoading()" />

<!-- ❌ Bad -->
<div class="{{isActive() ? 'active' : ''}}">Active</div>
<input value="{{productName}}" disabled="{{isLoading}}" />
```

### Conditional Rendering
```html
<!-- ✅ Good -->
<div *ngIf="products().length > 0">
  <p *ngFor="let product of products()">{{ product.title }}</p>
</div>
<div *ngIf="products().length === 0">No products found</div>

<!-- ❌ Bad -->
<div *ngIf="products()">
  <p *ngFor="let product of products">{{ product.title }}</p>
</div>
```

## Performance Guidelines

### Change Detection
```typescript
// ✅ Good - Use OnPush for better performance
@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})

// ❌ Bad - Default change detection
@Component({
  selector: 'app-product',
  // ...
})
```

### Avoid Memory Leaks
```typescript
// ✅ Good
private readonly destroy$ = new Subject<void>();

ngOnInit(): void {
  this.subscription = this.service
    .getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => { /* ... */ });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// ❌ Bad
subscription: Subscription;

ngOnInit(): void {
  this.subscription = this.service.getData().subscribe(/* ... */);
}
// No cleanup in ngOnDestroy
```

## Security Guidelines

### Input Sanitization
```typescript
// ✅ Good
const sanitized = this.sanitization.sanitizeInput(userInput);
const validated = this.sanitization.isValidEmail(email);

// ❌ Bad
const userInput = document.getElementById('input').value;
if (userInput.includes('@')) { /* accept as email */ }
```

### Error Information
```typescript
// ✅ Good - User-friendly message
'Failed to load products. Please try again later.'

// ❌ Bad - Technical details exposed
'Error: XMLHttpRequest failed with status 500 at endpoint /api/products/12345'
```

## Testing Guidelines

### Test Structure
```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch products', (done) => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      done();
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, title: 'Product 1' }]);
  });
});
```

---

**Version**: 1.0.0  
**Last Updated**: December 2024
