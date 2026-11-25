import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'shopping', component: ProductListComponent },
  { path: 'groceries/cart', redirectTo: 'cart', pathMatch: 'full' },
  { path: 'cart', component: ShoppingCartComponent },
  { path: '**', redirectTo: 'shopping', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
