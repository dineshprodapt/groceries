import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CartService } from './cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  showScrollToTop = false;
  private cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollToTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  ngOnInit(): void {
    this.cartItemCount = this.cartService.getTotalItems();
    this.cartSubscription = this.cartService.getCartUpdates().subscribe(items => {
      this.cartItemCount = this.cartService.getTotalItems();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
