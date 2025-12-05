import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactRequest {
  countryCode: string;
  mobileNumber: string;
  productId?: number | null;
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
}


