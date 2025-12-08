import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../core/services/base-api.service';
import { LoggerService } from '../core/services/logger.service';

export interface ContactRequest {
  id?: number;
  countryCode: string;
  mobileNumber: string;
  productId?: number | null;
  product?: string;
  complete?: boolean;
  createdAt?: string;
}

/**
 * Contact Service
 * Handles all contact request-related API operations
 */
@Injectable({
  providedIn: 'root',
})
export class ContactService extends BaseApiService {
  private readonly endpoint = '/contact';

  constructor(http: HttpClient, logger: LoggerService) {
    super(http, logger);
  }

  /**
   * Send a contact request
   */
  sendContact(request: ContactRequest): Observable<any> {
    return this.post<any>(this.endpoint, request).pipe(
      tap(() => this.logger.info('Contact request sent successfully'))
    );
  }

  /**
   * Submit contact form
   */
  submitContact(contactData: { mobileNumber: string; product: string }): Observable<any> {
    return this.post<any>(this.endpoint, contactData).pipe(
      tap(() => this.logger.info('Contact form submitted successfully'))
    );
  }

  /**
   * Get all contact requests
   */
  getContactRequests(): Observable<ContactRequest[]> {
    return this.get<ContactRequest[]>(this.endpoint).pipe(
      tap((requests) => this.logger.info(`Loaded ${requests.length} contact requests`))
    );
  }

  /**
   * Update a contact request
   */
  updateContactRequest(id: number, request: ContactRequest): Observable<ContactRequest> {
    return this.put<ContactRequest>(`${this.endpoint}/${id}`, request).pipe(
      tap(() => this.logger.info(`Contact request updated: ${id}`))
    );
  }

  /**
   * Delete a contact request
   */
  deleteContactRequest(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.logger.info(`Contact request deleted: ${id}`))
    );
  }
}


