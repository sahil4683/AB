import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../core/services/base-api.service';
import { LoggerService } from '../core/services/logger.service';

export interface Category {
  id: number;
  name: string;
  slug: string;
  url: string;
}

/**
 * Category Service
 * Handles all category-related API operations
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseApiService {
  private readonly endpoint = '/categories';

  constructor(http: HttpClient, logger: LoggerService) {
    super(http, logger);
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.get<Category[]>(this.endpoint).pipe(
      tap((categories) => this.logger.info(`Loaded ${categories.length} categories`))
    );
  }

  /**
   * Create a new category
   */
  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.post<Category>(this.endpoint, category).pipe(
      tap((created) => this.logger.info(`Category created: ${created.name}`))
    );
  }

  /**
   * Update an existing category
   */
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.put<Category>(`${this.endpoint}/${id}`, category).pipe(
      tap((updated) => this.logger.info(`Category updated: ${updated.name}`))
    );
  }

  /**
   * Delete a category
   */
  deleteCategory(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.logger.info(`Category deleted: ${id}`))
    );
  }
}
