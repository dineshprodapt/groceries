import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product!: Product;
  @Input() selectedQuantity!: number;
  @Output() quantityChanged = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<Product>();
  quantityOptions: number[] = [];
  quantity: number = 1;

   ngOnInit() {
    // Create quantity options from 0 to maxQuantity
    this.quantityOptions = Array.from({length: this.product.maxQuantity + 1}, (_, i) => i);
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

   onQuantityChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const quantity = parseInt(select.value);
    this.quantityChanged.emit(quantity);
  }
}