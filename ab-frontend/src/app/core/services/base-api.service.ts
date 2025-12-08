import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoggerService } from './logger.service';

/**
 * Base API Service
 * Provides common HTTP operations with built-in error handling and logging
 */
@Injectable()
export abstract class BaseApiService {
  protected readonly apiUrl = environment.apiUrl;

  constructor(
    protected http: HttpClient,
    protected logger: LoggerService
  ) {}

  /**
   * Perform GET request
   */
  protected get<T>(endpoint: string, params?: HttpParams | Record<string, any>): Observable<T> {
    const url = this.getFullUrl(endpoint);
    let httpParams: HttpParams | undefined;

    if (params && !(params instanceof HttpParams)) {
      httpParams = new HttpParams({ fromObject: params });
    } else if (params instanceof HttpParams) {
      httpParams = params;
    }

    this.logger.debug(`GET ${url}`);
    return this.http.get<T>(url, { params: httpParams });
  }

  /**
   * Perform POST request
   */
  protected post<T>(endpoint: string, body: any): Observable<T> {
    const url = this.getFullUrl(endpoint);
    this.logger.debug(`POST ${url}`, body);
    return this.http.post<T>(url, body);
  }

  /**
   * Perform PUT request
   */
  protected put<T>(endpoint: string, body: any): Observable<T> {
    const url = this.getFullUrl(endpoint);
    this.logger.debug(`PUT ${url}`, body);
    return this.http.put<T>(url, body);
  }

  /**
   * Perform PATCH request
   */
  protected patch<T>(endpoint: string, body: any): Observable<T> {
    const url = this.getFullUrl(endpoint);
    this.logger.debug(`PATCH ${url}`, body);
    return this.http.patch<T>(url, body);
  }

  /**
   * Perform DELETE request
   */
  protected delete<T>(endpoint: string): Observable<T> {
    const url = this.getFullUrl(endpoint);
    this.logger.debug(`DELETE ${url}`);
    return this.http.delete<T>(url);
  }

  /**
   * Get full URL from endpoint
   */
  protected getFullUrl(endpoint: string): string {
    return endpoint.startsWith('http') ? endpoint : `${this.apiUrl}${endpoint}`;
  }
}
