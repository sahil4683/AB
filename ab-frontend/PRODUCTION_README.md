# AB Frontend - Production-Ready Angular Application

Professional, enterprise-grade Angular application with clean code architecture, comprehensive error handling, and security best practices.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Production Build](#production-build)
- [Architecture](#architecture)
- [Security](#security)
- [Best Practices](#best-practices)
- [API Configuration](#api-configuration)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- **Angular 20** - Latest version with standalone components
- **Signal-based State Management** - Modern reactive state management
- **Comprehensive Error Handling** - Global error interceptors with user-friendly messages
- **Input Sanitization** - XSS prevention and input validation
- **HTTP Interceptors** - Timeout, error handling, and logging
- **Logger Service** - Structured logging with configurable log levels
- **Environment Configuration** - Dev and production environment management
- **Responsive Design** - Mobile-first approach with SCSS
- **TypeScript Strict Mode** - Full strict type checking enabled
- **SweetAlert2 Integration** - Professional modal dialogs
- **Admin Panel** - Product and category management
- **Product Catalog** - Search, filter, and contact functionality

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                          # Core utilities and services
│   │   ├── guards/
│   │   │   └── admin.guard.ts        # Route protection
│   │   ├── interceptors/
│   │   │   ├── error.interceptor.ts  # Global error handling
│   │   │   └── timeout.interceptor.ts # Request timeout management
│   │   └── services/
│   │       ├── base-api.service.ts   # Base HTTP service
│   │       ├── logger.service.ts     # Structured logging
│   │       └── sanitization.service.ts # Input validation & sanitization
│   ├── services/                      # Business logic services
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   └── contact.service.ts
│   ├── admin/                         # Admin module
│   │   ├── admin.component.ts
│   │   ├── admin.component.html
│   │   └── admin.component.scss
│   ├── products/                      # Products module
│   │   ├── products.component.ts
│   │   ├── products.component.html
│   │   └── products.component.scss
│   ├── home/                          # Home module
│   │   ├── home.component.ts
│   │   ├── home.component.html
│   │   └── home.component.scss
│   ├── app.ts                         # Root component
│   ├── app.routes.ts                  # Route definitions
│   └── app.config.ts                  # Application configuration
├── environments/
│   ├── environment.ts                 # Development environment
│   └── environment.prod.ts            # Production environment
├── styles.scss                        # Global styles
└── main.ts                            # Bootstrap file
```

## 🔧 Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Angular CLI**: v20.3.x
- **TypeScript**: v5.9.x

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Update `src/environments/environment.ts` with your API endpoint:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiTimeout: 30000,
  logLevel: 'debug',
};
```

### 3. Verify Installation

```bash
ng version
```

## 💻 Development

### Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

### Available npm Scripts

```bash
npm start              # Start development server
npm run build          # Build for production
npm run watch          # Build in watch mode
npm test               # Run unit tests
ng generate component  # Generate new component
ng generate service    # Generate new service
```

## 🏗️ Production Build

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Build Configuration

The production build includes:
- Ahead-of-time (AOT) compilation
- Tree shaking and minification
- Output hashing for cache busting
- Bundle budgets enforcement

## 🏛️ Architecture

### Core Concepts

#### 1. **Signal-based State Management**

Components use Angular Signals for reactive state:

```typescript
// Define state
protected readonly products = signal<Product[]>([]);

// Update state
this.products.set(newProducts);

// Compute derived state
filteredProducts = computed(() => {
  return this.products().filter(/* ... */);
});
```

#### 2. **Service Layer**

All HTTP operations inherit from `BaseApiService`:

```typescript
export class ProductService extends BaseApiService {
  getProducts(): Observable<Product[]> {
    return this.get<Product[]>('/products').pipe(
      tap((products) => this.logger.info(`Loaded ${products.length} products`))
    );
  }
}
```

#### 3. **Global Error Handling**

HTTP errors are caught by the `ErrorInterceptor`:

```typescript
// Automatic error handling with user-friendly messages
this.productService.getProducts().subscribe({
  next: (products) => { /* ... */ },
  error: (error) => { /* error is already handled */ }
});
```

#### 4. **Structured Logging**

Use the logger service throughout the application:

```typescript
this.logger.debug('Loading products');
this.logger.info('Products loaded successfully');
this.logger.warn('No products found');
this.logger.error('Failed to load products', error);
```

## 🔒 Security

### Implemented Security Measures

1. **Input Sanitization**
   - XSS prevention through DomSanitizer
   - Input validation and trimming
   - Special character removal

2. **HTTP Security**
   - CORS handling
   - Request timeout prevention
   - Error information disclosure prevention

3. **TypeScript Strict Mode**
   - `noImplicitAny` - Require explicit types
   - `strictNullChecks` - Catch null/undefined errors
   - `noImplicitThis` - Prevent unsafe this usage
   - `strictPropertyInitialization` - All properties must be initialized

4. **Route Guards**
   - Admin panel route protection
   - Authentication checks

### Security Best Practices

```typescript
// ✅ Always sanitize user input
const sanitized = this.sanitization.sanitizeInput(userInput);

// ✅ Validate email/phone before submission
if (!this.sanitization.isValidEmail(email)) {
  // Handle error
}

// ✅ Use dependency injection for services
constructor(private productService: ProductService) {}

// ✅ Implement proper error boundaries
subscribe({
  next: (data) => { /* ... */ },
  error: (error) => { /* Handle error */ },
  complete: () => { /* ... */ }
});
```

## ✅ Best Practices

### 1. Component Architecture

```typescript
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Signals for state
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.service
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { /* ... */ },
        error: (error) => { this.handleError(error); }
      });
  }
}
```

### 2. RxJS Operators

- Always use `takeUntil` to prevent memory leaks
- Use `tap` for side effects like logging
- Combine with `catchError` for error handling

### 3. Form Validation

```typescript
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
});
```

### 4. Component Communication

- Use `@Input()` and `@Output()` for child communication
- Use signals for parent state management
- Use services for cross-component communication

### 5. Code Style

- Use PascalCase for class names
- Use camelCase for variables and methods
- Use UPPER_CASE for constants
- Add JSDoc comments for public methods
- Keep components focused and small

## 🔌 API Configuration

### Environment Variables

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiTimeout: 30000,          // milliseconds
  logLevel: 'debug',          // 'debug' | 'info' | 'warn' | 'error'
  features: {
    adminPanel: true,
    contactForm: true,
    productCatalog: true,
  },
};
```

### API Endpoints

The application expects the following API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create new category |
| DELETE | `/api/categories/:id` | Delete category |
| POST | `/api/contact` | Submit contact request |
| GET | `/api/contact` | Get contact requests |
| PUT | `/api/contact/:id` | Update contact request |

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Test Coverage

```bash
ng test --code-coverage
```

Coverage reports will be generated in `coverage/` directory.

## 📦 Deployment

### Azure Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy using Azure CLI:
```bash
az webapp deployment source config-zip --resource-group <group> --name <app-name> --src dist.zip
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 80
CMD ["node", "server.js"]
```

### GitHub Pages

```bash
ng build --configuration production --base-href "/ab-frontend/"
```

## 📝 Code Examples

### Creating a New Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../core/services/base-api.service';
import { LoggerService } from '../core/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class YourService extends BaseApiService {
  constructor(http: HttpClient, logger: LoggerService) {
    super(http, logger);
  }

  getData(): Observable<any[]> {
    return this.get<any[]>('/endpoint').pipe(
      tap((data) => this.logger.info('Data loaded'))
    );
  }
}
```

### Creating a New Component

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss',
})
export class FeatureComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(private service: YourService) {}

  ngOnInit(): void {
    this.service
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { /* ... */ },
        error: (error) => { /* ... */ }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## 🐛 Troubleshooting

### Issue: CORS errors

**Solution**: Configure CORS on backend API or use proxy configuration

### Issue: Memory leaks in components

**Solution**: Always use `takeUntil` with destroy subject on component cleanup

### Issue: Build size too large

**Solution**: 
- Run `npm run build -- --configuration production`
- Check bundle size with `npm run build -- --stats-json`
- Analyze with `webpack-bundle-analyzer`

## 📚 Resources

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Angular Best Practices](https://angular.dev/guide/styleguide)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Support

For issues and feature requests, please create an issue in the repository.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
