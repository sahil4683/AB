import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../core/services/base-api.service';
import { LoggerService } from '../core/services/logger.service';
import { Category } from './category.service';

export interface Product {
  id: number;
  title: string;
  casNumber: string;
  imageUrl: string;
  description: string;
  category: string;
  categoryEntity?: Category;
  slug: string;
  anchor: string;
}

/**
 * Product Service
 * Handles all product-related API operations
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseApiService {
  private readonly endpoint = '/products';

  constructor(http: HttpClient, logger: LoggerService) {
    super(http, logger);
  }

  /**
   * Get all products with optional filters
   */
  getProducts(category?: string, q?: string, sort?: string): Observable<Product[]> {
    const params: Record<string, string> = {};

    if (category) {
      params['category'] = category;
    }
    if (q) {
      params['q'] = q;
    }
    if (sort) {
      params['sort'] = sort;
    }

    return this.get<Product[]>(this.endpoint, params).pipe(
      tap((products) => this.logger.info(`Loaded ${products.length} products`))
    );
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: number): Observable<Product> {
    return this.get<Product>(`${this.endpoint}/${id}`).pipe(
      tap((product) => this.logger.info(`Loaded product: ${product.title}`))
    );
  }

  /**
   * Create a new product
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.post<Product>(this.endpoint, product).pipe(
      tap((created) => this.logger.info(`Product created: ${created.title}`))
    );
  }

  /**
   * Update an existing product
   */
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.put<Product>(`${this.endpoint}/${id}`, product).pipe(
      tap((updated) => this.logger.info(`Product updated: ${updated.title}`))
    );
  }

  /**
   * Delete a product
   */
  deleteProduct(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.logger.info(`Product deleted: ${id}`))
    );
  }
}


