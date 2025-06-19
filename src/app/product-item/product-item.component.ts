import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product!: Product;
  @Input() selectedQuantity: number = 0;
  @Output() quantityChanged = new EventEmitter<number>();
  quantityOptions: number[] = [];
  quantity: number = 1;

  constructor(private cartService: CartService) { } 
   ngOnInit() {
    // Create quantity options from 0 to maxQuantity
    this.quantityOptions = Array.from({length: this.product.maxQuantity + 1}, (_, i) => i);
  }

  addToCart() {
    //this.addToCart.emit(this.product);
    this.cartService.addToCart(this.product, this.selectedQuantity);
    console.log("Product added to cart:", this.product);
     this.selectedQuantity = 1;
    this.quantityChanged.emit(this.selectedQuantity);
  }

  increment() {
    if (this.selectedQuantity < this.product.maxQuantity) {
      this.selectedQuantity++;
      this.quantityChanged.emit(this.selectedQuantity);
    }
  }

  decrement() {
    if (this.selectedQuantity > 0) {
      this.selectedQuantity--;
      this.quantityChanged.emit(this.selectedQuantity);
    }
  }

   onQuantityChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const quantity = parseInt(select.value);
    this.quantityChanged.emit(quantity);
  }
}