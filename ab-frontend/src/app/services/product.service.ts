import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  casNumber: string;
  imageUrl: string;
  description: string;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProducts(category?: string, q?: string, sort?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    if (q) {
      params = params.set('q', q);
    }
    if (sort) {
      params = params.set('sort', sort);
    }
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
}


