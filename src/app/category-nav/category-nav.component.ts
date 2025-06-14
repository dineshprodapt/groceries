import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-category-nav',
  templateUrl: './category-nav.component.html',
  styleUrls: ['./category-nav.component.css']
})
export class CategoryNavComponent implements OnInit {
  categories: string[] = [];
  products: Product[] = [];
  @Output() categorySelected = new EventEmitter<string>();
  @Input() activeCategory: string = 'all';

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.categories = this.productsService.getAllCategories(data);
    });
    
  }

  selectCategory(category: string) {
    this.categorySelected.emit(category);
  }
}