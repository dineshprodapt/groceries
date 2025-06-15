import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cartItems: {product: Product, quantity: number}[] = [];
  loadingItemId: number | null = null;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
    this.cartService.clearCart();
    this.cartItems = [];
    this.loadingItemId = null;
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
  }


  updateQuantity(productId: number, newQuantity: any): void {
  // Convert to number and validate
  const quantity = Math.floor(Number(newQuantity));
  
  if (isNaN(quantity) || quantity < 1) {
    this.loadCartItems(); // Reset to current value
    return;
  }

  this.loadingItemId = productId;
   setTimeout(() => {
      this.cartService.updateQuantity(productId, quantity);
      this.loadCartItems();
      this.loadingItemId = null;
  }, 300); // Simulate network delay
}

// Prevent invalid key inputs
validateNumberInput(event: KeyboardEvent): void {
  const forbiddenKeys = ['e', 'E', '+', '-'];
  if (forbiddenKeys.includes(event.key)) {
    event.preventDefault();
  }
}

  removeFromCart(productId: number): void {
    this.loadingItemId = productId;
    setTimeout(() => {
      this.cartService.removeFromCart(productId);
      this.loadCartItems();
      this.loadingItemId = null;
    }, 300);
  }

  clearCart(): void {
    if (confirm('Hey Bharu! Are you sure you want to remove the products from your cart ?')) {
      this.cartService.clearCart();
      this.loadCartItems();
    }
  }

  sendToDinesh(): void { 
     if (confirm('Hey Bharu! Can I send the product list to Dinesh ?')) {
      // Here you can implement the logic to send the cart items to Dinesh
      // For now, we will just clear the cart
      this.cartService.clearCart();
      this.loadCartItems();
      alert('Products sent to Dinesh successfully!');
      // Optionally, you can redirect to a different page or show a success message 
    }
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  // Optional: Track swipe gestures for delete
  onTouchStart(event: TouchEvent, productId: number): void {
    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.currentProductId = productId;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.currentProductId) return;
    
    const touch = event.touches[0];
    const diff = this.startX - touch.clientX;
    
    if (diff > 100) { // Swiped left 100px
      this.removeFromCart(this.currentProductId);
      this.currentProductId = null;
    }
  }

  // Private properties for swipe handling
  private startX = 0;
  private currentProductId: number | null = null;
}