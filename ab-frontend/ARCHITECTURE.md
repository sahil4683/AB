# Architecture Documentation

## Overview

This document describes the architecture and design patterns used in the AB Frontend application.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       Angular Application                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │  Components    │  │  Components    │  │  Components    │    │
│  │                │  │                │  │                │    │
│  │ - Home         │  │ - Products     │  │ - Admin        │    │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘    │
│           │                    │                    │             │
├───────────┼────────────────────┼────────────────────┼──────────┤
│           └────────────────────┼────────────────────┘           │
│                                │                                 │
│                    ┌───────────▼───────────┐                    │
│                    │   Services Layer      │                    │
│                    │                       │                    │
│                    │  - ProductService     │                    │
│                    │  - CategoryService    │                    │
│                    │  - ContactService     │                    │
│                    └───────────┬───────────┘                    │
│                                │                                 │
│                                │                                 │
│                    ┌───────────▼───────────┐                    │
│                    │   BaseApiService      │                    │
│                    │                       │                    │
│                    │ - get()               │                    │
│                    │ - post()              │                    │
│                    │ - put()               │                    │
│                    │ - delete()            │                    │
│                    └───────────┬───────────┘                    │
│                                │                                 │
├────────────────────────────────┼─────────────────────────────────┤
│                    HTTP Interceptors                             │
│                                │                                 │
│        ┌───────────────────────┼──────────────────────┐         │
│        │                       │                      │         │
│  ┌─────▼──────┐      ┌────────▼──────┐     ┌────────▼─────┐   │
│  │   Error    │      │   Timeout     │     │   Logger     │   │
│  │Interceptor │      │ Interceptor   │     │  (Optional)  │   │
│  └─────┬──────┘      └────────┬──────┘     └────────┬─────┘   │
│        │                      │                      │         │
│        └──────────────────────┼──────────────────────┘         │
│                               │                                 │
├───────────────────────────────┼──────────────────────────────────┤
│                               │                                  │
│          ┌────────────────────▼────────────────────┐            │
│          │         HTTP Client (Angular)           │            │
│          └────────────────────┬────────────────────┘            │
│                               │                                  │
└───────────────────────────────┼──────────────────────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
         ┌───────▼────────┐          ┌────────▼───────┐
         │  Backend API   │          │ External APIs  │
         │                │          │                │
         │ (Spring Boot)  │          │  (if needed)   │
         └────────────────┘          └────────────────┘
```

## Layers

### 1. Presentation Layer (Components)

**Location**: `src/app/{component-name}/`

**Responsibilities**:
- Display data to users
- Handle user interactions
- Manage local component state
- Delegate business logic to services

**Key Components**:
- `HomeComponent` - Landing page
- `ProductsComponent` - Product catalog and search
- `AdminComponent` - Admin panel

**Example**:
```typescript
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  products = signal<Product[]>([]);
  
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      products => this.products.set(products)
    );
  }
}
```

### 2. Service Layer

**Location**: `src/app/services/`

**Responsibilities**:
- Handle business logic
- Communicate with backend API
- Manage data transformations
- Provide logging and error handling

**Key Services**:
- `ProductService` - Product operations
- `CategoryService` - Category operations
- `ContactService` - Contact request handling

**Example**:
```typescript
@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseApiService {
  getProducts(): Observable<Product[]> {
    return this.get<Product[]>('/products').pipe(
      tap((products) => this.logger.info(`Loaded ${products.length} products`)),
      catchError((error) => {
        this.logger.error('Failed to load products', error);
        return throwError(() => error);
      })
    );
  }
}
```

### 3. Core Services Layer

**Location**: `src/app/core/services/`

**Responsibilities**:
- Provide base functionality
- Logging
- Input sanitization
- Error handling utilities

**Key Services**:
- `BaseApiService` - Base HTTP operations
- `LoggerService` - Structured logging
- `SanitizationService` - Input validation and sanitization

### 4. HTTP Interceptor Layer

**Location**: `src/app/core/interceptors/`

**Responsibilities**:
- Global request/response handling
- Error handling
- Request timeout management
- Logging

**Interceptors**:
- `ErrorInterceptor` - Catch and handle all HTTP errors
- `TimeoutInterceptor` - Add timeout to requests

## State Management

### Signal-Based State Management

The application uses Angular Signals for reactive state management:

```typescript
// Define signals
protected readonly products = signal<Product[]>([]);
protected readonly isLoading = signal(false);
protected readonly error = signal<string | null>(null);

// Computed signals
filteredProducts = computed(() => {
  return this.products().filter(p => p.category === 'active');
});

// Update signals
this.products.set(newProducts);
```

**Benefits**:
- Fine-grained reactivity
- Better performance
- Automatic dependency tracking
- Type-safe state management

### Memory Management

All components implement proper cleanup:

```typescript
private readonly destroy$ = new Subject<void>();

ngOnInit(): void {
  this.service
    .getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => { /* ... */ });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## Error Handling Strategy

### Global Error Handling

All HTTP errors are caught by the `ErrorInterceptor`:

```typescript
intercept(request: HttpRequest<any>, next: HttpHandler) {
  return next.handle(request).pipe(
    catchError((error: HttpErrorResponse) => {
      this.handleError(error);
      return throwError(() => this.formatError(error));
    })
  );
}
```

### Component-Level Error Handling

Components handle specific business logic errors:

```typescript
this.service.submitForm(data).subscribe({
  next: (result) => {
    this.handleSuccess(result);
  },
  error: (error) => {
    this.logger.error('Form submission failed', error);
    this.errorMessage.set(error.message);
  }
});
```

### User-Friendly Error Messages

```typescript
private getErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized. Please log in again.';
    case 404:
      return 'Resource not found.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}
```

## Security Architecture

### Input Sanitization

```typescript
constructor(private sanitization: SanitizationService) {}

// Sanitize user input
const cleanInput = this.sanitization.sanitizeInput(userInput);

// Validate email
if (!this.sanitization.isValidEmail(email)) {
  // Handle invalid email
}
```

### Route Protection

```typescript
const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
];
```

### TypeScript Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "strictPropertyInitialization": true
  }
}
```

## HTTP Communication Flow

```
Component
  ↓
Service Method (getProducts)
  ↓
BaseApiService.get()
  ↓
HttpClient.get()
  ↓
TimeoutInterceptor (add timeout)
  ↓
Backend API
  ↓
Response/Error
  ↓
ErrorInterceptor (handle errors)
  ↓
tap() operator (logging)
  ↓
Component receives data/error
  ↓
Update signals
  ↓
Template updates (automatic with signals)
```

## Data Flow Example

### Product Catalog Filtering

```typescript
// 1. Component receives user input
updateSearch(value: string) {
  this.search.set(this.sanitization.sanitizeInput(value));
}

// 2. Computed signal automatically recalculates
filteredProducts = computed(() => {
  return this.products().filter(p =>
    p.title.toLowerCase().includes(this.search().toLowerCase())
  );
});

// 3. Template subscribes to computed signal
// <div *ngFor="let product of filteredProducts()">

// 4. Display updates automatically
```

## Dependency Injection

All services are injected using constructor injection:

```typescript
constructor(
  private productService: ProductService,
  private logger: LoggerService,
  private sanitization: SanitizationService
) {}
```

**Benefits**:
- Testability
- Decoupling
- Type safety
- Framework-managed lifetime

## Type Safety

The application uses strict TypeScript configuration:

```typescript
// ✅ Explicit types required
interface Product {
  id: number;
  title: string;
  description: string;
}

// ✅ No implicit any
function processProduct(product: Product): void {
  console.log(product.title);
}

// ❌ This would cause compilation error
processProduct({ title: 'test' }); // Missing required fields
```

## Performance Optimization

### 1. Tree Shaking
- Unused code is removed during build
- Modules are properly structured

### 2. Change Detection
- OnPush strategy recommended for components
- Signals minimize unnecessary checks

### 3. Bundle Size
```bash
# Check bundle size
ng build --stats-json
webpack-bundle-analyzer dist/*/stats.json
```

### 4. Lazy Loading (Future Enhancement)
```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
  }
];
```

## Testing Strategy

### Unit Tests
- Test services independently
- Mock HTTP calls
- Test component logic separately

### Integration Tests
- Test component and service interaction
- Test template rendering

### E2E Tests
- Test complete user workflows
- Test across different browsers

## Deployment Architecture

### Development
- Local API: `http://localhost:8080/api`
- Development server on `http://localhost:4200`

### Production
- Production API: `https://api.yourdomain.com/api`
- Optimized bundle with minification and tree-shaking
- Output hashing for cache busting

## Configuration Management

### Environment Files

**Development** (`environment.ts`):
```typescript
{
  production: false,
  apiUrl: 'http://localhost:8080/api',
  logLevel: 'debug'
}
```

**Production** (`environment.prod.ts`):
```typescript
{
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  logLevel: 'error'
}
```

## Future Improvements

1. **State Management**
   - Consider NgRx for complex state
   - Implement Redux pattern if needed

2. **Performance**
   - Implement lazy loading for routes
   - Add virtual scrolling for large lists
   - Implement service workers for PWA

3. **Testing**
   - Increase unit test coverage to 80%+
   - Add E2E tests with Cypress
   - Add performance testing

4. **Security**
   - Implement JWT-based authentication
   - Add CSRF protection
   - Implement OAuth2 integration

5. **Features**
   - Add real-time updates with WebSockets
   - Implement file upload functionality
   - Add advanced search/filtering
   - Implement pagination

---

**Version**: 1.0.0  
**Last Updated**: December 2024
