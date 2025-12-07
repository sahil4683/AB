import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactRequest {
  id?: number;
  countryCode: string;
  mobileNumber: string;
  productId?: number | null;
  product?: string;
  complete?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly baseUrl = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) {}

  sendContact(request: ContactRequest): Observable<any> {
    return this.http.post(this.baseUrl, request);
  }

  submitContact(contactData: { mobileNumber: string; product: string }): Observable<any> {
    return this.http.post(this.baseUrl, contactData);
  }

  getContactRequests(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(this.baseUrl);
  }

  updateContactRequest(id: number, request: ContactRequest): Observable<ContactRequest> {
    return this.http.put<ContactRequest>(`${this.baseUrl}/${id}`, request);
  }
}


