import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
cartItems: {product: Product, quantity: number}[] = [];
  private cartSubject = new BehaviorSubject<{ product: Product, quantity: number }[]>(this.cartItems);
  public sharedData = new BehaviorSubject<any>('');
  currentData = this.sharedData.asObservable();

  constructor() { }

   setData(data: any) {
    this.sharedData.next(data);
  }

  getData() {
    return this.sharedData.getValue();
  }

 // Update methods to emit new values
  addToCart(cartItem: Product, quantity: number): void {
    console.log("addtpcart");
    const existingItem = this.cartItems.find(item => item.product.id === cartItem.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product: cartItem, quantity: quantity });
    }
    this.cartSubject.next([...this.cartItems]); // Emit new value
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.cartSubject.next([...this.cartItems]); // Emit new value
  }

  // Add this new method to get the Observable
  getCartUpdates() {
    return this.cartSubject.asObservable();
  }
  
  updateQuantity(productId: number, newQuantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = newQuantity;
    }
  }

  getCartItems(): {product: Product}[] {
    return this.cartItems;
  }
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
   // return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
   return 0;
  }

  clearCart(): void {
    this.cartItems = [];
  }
}