import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { CartService } from '../cart.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  @ViewChild(ProductItemComponent) productItems!: ProductItemComponent[];
  selectedQuantities: {[productId: number]: number} = {};
  activeCategory: string = 'all';
  filteredProducts: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
   this.productsService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data; // Initial load, display all products
    });
    // Initialize all quantities to 0
    this.products.forEach(product => {
      this.selectedQuantities[product.id] = 0;
    });
  }

  getUniqueCategories(): string[] {
    const categories = this.products.map(product => product.category);
    return [...new Set(categories)];
  }

   filterByCategory(category: string) {
    this.activeCategory = category;
    if (category === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.getProductsByCategory(category);
    }
  }

    getProductsByCategory(category: string): Product[] {
      return this.products.filter(product => product.category === category);
  }

  // filterByCategory(category: string): void {
  //   this.selectedCategory = category;
  //   if (category === 'all') {
  //     this.productsService.getAllProducts().subscribe((data) => {
  //     this.products = data;
  //   });
  //   } else {
  //     this.products = this.productsService.getProductsByCategory(category);
  //   }
  // }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
  
   checkoutAll(): void {
      if (confirm('You have added '+ this.getSelectedCount() + ' products to the cart, do you want to checkout now?')) {
        this.filteredProducts.forEach(product => {
          const quantity = this.selectedQuantities[product.id];
          if (quantity > 0) {
            this.cartService.addToCart(product, quantity);
            this.router.navigate(['/cart']);
            this.selectedQuantities[product.id] = 0;
          }
        });
      }
  }

//  checkoutAll(): void {
//     this.products.forEach(product => {
//       const quantity = this.selectedQuantities[product.id];
//       if (quantity > 0) {
//         this.cartService.addToCart(product, quantity);
//         //this.selectedQuantities[product.id] = 0; // Reset quantity
//       }
//     });
//   }

 onQuantityChange(productId: number, quantity: number) {
  this.selectedQuantities[productId] = quantity;
  // If quantity reaches 0, you might want to handle it specially
  if (quantity === 0) {
    // Optional: Remove from selectedQuantities
    delete this.selectedQuantities[productId];
  }
}

  getSelectedCount(): number {
   // console.log("selectedQuantities", this.selectedQuantities);
    let cart_quantity = Object.values(this.selectedQuantities).filter(qty => qty > 0).length; 
    this.cartService.setData(cart_quantity);
    return cart_quantity;
  }

}