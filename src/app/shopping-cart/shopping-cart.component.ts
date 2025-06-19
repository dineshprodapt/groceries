import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
 // cartItems: {product: Product, quantity: number}[] = [];
  cartItems: Product[] = [];

  loadingItemId: number | null = null;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCartItems();
     window.scrollTo({top: 0, behavior: 'smooth'});
      window.addEventListener("beforeunload", function (e) {
        var confirmationMessage = "\o/";
        console.log("cond");
        return confirmationMessage; // Modern browsers
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
    this.cartService.clearCart();
    this.cartItems = [];
    this.loadingItemId = null;
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems().map(item => item.product);
  }


  updateQuantity(productId: number, newQuantity: any): void {
  // Convert to number and validate
  const quantity = Math.floor(Number(newQuantity));
  
  if (isNaN(quantity) || quantity < 1) {
    this.loadCartItems(); // Reset to current value
    return;
  }
  else {
    this.cartService.updateQuantity(productId, quantity);
    this.cartItems.forEach(item => {
      if (item.id === productId) {
        item.quantity = quantity; // Update the quantity in the cartItems array
      }
    });
  }
  console.log("cartItems", this.cartItems);
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
    if (confirm('Are you sure you want to remove the products from your cart ?')) {
      this.cartService.clearCart();
      this.loadCartItems();
    }
  }

  sendToDinesh(): void { 
     if (confirm('Can I send the product list to Dinesh ?')) {
      // Here you can implement the logic to send the cart items to Dinesh
      this.loadCartItems();
      this.proceedToWhatsAppCheckout();
    }
  }

  proceedToWhatsAppCheckout() {
    const phoneNumber = '918148274881'; // Replace with your WhatsApp number
    const message = this.generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  private generateWhatsAppMessage(): string {
    var date = new Date();
    var monthName = date.toLocaleString('default', { month: 'long' });
    var year = date.getFullYear();

    let message = `🛒 Groceries Order : *${monthName} ${year}* \n\n `;
    this.cartItems.forEach(item => {
      message += `• ${item.name}  -  *${item.quantity}* × ₹${item.value} \n`;
    });

    message += `\n📦 *Total Products* : *${this.cartItems.length}*\n`;
    message += `\n Please order these products for this month. Thank you! 🙏\n\n`;
    
    return message;
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