import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'groceries-basket.cart.v1';
  cartItems: {product: Product, quantity: number}[] = this.restoreCart();
  private cartSubject = new BehaviorSubject<{ product: Product, quantity: number }[]>(this.cartItems);
  public sharedData = new BehaviorSubject<any>('');
  currentData = this.sharedData.asObservable();

  constructor() { }

  private restoreCart(): {product: Product, quantity: number}[] {
    try {
      const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      if (!Array.isArray(items)) return [];
      return items.filter(item => item && item.product &&
        Number.isInteger(item.product.id) &&
        ['name', 'value', 'image', 'category', 'vendor'].every(key =>
          typeof item.product[key] === 'string') &&
        Number.isInteger(item.quantity) && item.quantity > 0)
        .map(item => ({ product: { ...item.product, quantity: item.quantity }, quantity: item.quantity }));
    } catch {
      return [];
    }
  }

  private saveCart(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
    } catch {
      // Keep the cart usable when browser storage is unavailable or full.
    }
    this.cartSubject.next([...this.cartItems]);
  }

   setData(data: any) {
    this.sharedData.next(data);
  }

  getData() {
    return this.sharedData.getValue();
  }

 // Update methods to emit new values
  addToCart(cartItem: Product, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    const existingItem = this.cartItems.find(item => item.product.id === cartItem.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.product.quantity = existingItem.quantity;
    } else {
      this.cartItems.push({ product: { ...cartItem, quantity }, quantity });
    }
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  // Add this new method to get the Observable
  getCartUpdates() {
    return this.cartSubject.asObservable();
  }
  
  updateQuantity(productId: number, newQuantity: number): void {
    if (!Number.isInteger(newQuantity) || newQuantity < 1) return;
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = newQuantity;
      item.product.quantity = newQuantity;
      this.saveCart();
    }
  }

  getCartItems(): {product: Product, quantity: number}[] {
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
    this.saveCart();
  }
}
