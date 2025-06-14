import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products: Product[] = [];

  constructor(private http: HttpClient) {}

   getAllProducts(): Observable<any> {
    return this.http.get('assets/mock_data/products.json');
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getAllCategories(data:Product[]): string[] {
    
  const categories = data.map(product => product.category);
  return [...new Set(categories)]; // Remove duplicates
}
}