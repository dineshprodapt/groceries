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
  finalQuantity: number = 0;
  
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

  
   checkoutAll(): void {
      if (confirm('You have added '+ this.getSelectedCount() + ' products to the cart, do you want to checkout now?')) {
        console.log("products", this.products);
        console.log("selected products", this.cartService.getCartItems());
        console.log("selectedQuantities", this.selectedQuantities);
        let cartItems: Product[] = this.cartService.getCartItems().map(item => item.product);
        console.log("cartItems", cartItems);
        // Filter products based on selected quantities
        cartItems = cartItems.filter(item => {
          this.finalQuantity = this.selectedQuantities[item.id];
          item.quantity = this.finalQuantity || 1; // Set quantity to selected or default to 1
          return item;
         // delete item.quantity;
         // return this.finalQuantity > 0; // Only keep items with quantity greater than 0
        });
         this.router.navigate(['/cart']);
        // const updatedObj = Object.fromEntries(
        //   Object.entries(cartItems).filter(([key]) => key !== 'age')
        // );
      
        console.log("filtered cart items", cartItems);
        //  this.cartService.addToCart(cartItems, this.finalQuantity);
      //  const filteredProducts = this.cartService.getCartItems().forEach(items => {
      //     console.log("item", items);
      //     if(items.product.id === this.selectedQuantities[items.product.id]) {
      //       // items.product.
      //     });
      //      items.product.id = this.selectedQuantities[items.product.id];
      //   })
      //   // const filteredProducts = this.products.filter(product =>  {
      //   //   product.id === this.selectedQuantities[product.id];
      //   //   console.log("product.id", product.id);
      //   //   var quantity = this.selectedQuantities[product.id];
      //   // });
      //   console.log("filteredProducts 1", filteredProducts);
        //  this.cartService.addToCart(product, this.selectedQuantities[product.id] || 1);
        //     this.router.navigate(['/cart']);
        //     this.selectedQuantities[product.id] = 0;
        // this.products.filter(product => {
        //   const quantity = this.selectedQuantities[product.id];
        //   console.log("quantity", quantity);
        //   if (quantity > 0) {
        //     this.cartService.addToCart(product, this.selectedQuantities[product.id] || 1);
        //     this.router.navigate(['/cart']);
        //     this.selectedQuantities[product.id] = 0;
        //   }
        // });
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