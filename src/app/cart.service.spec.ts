import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.removeItem('groceries-basket.cart.v1');
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  afterEach(() => localStorage.removeItem('groceries-basket.cart.v1'));

  const product = { id: 1, name: 'Rice', value: '100', image: 'rice.jpg',
    category: 'Grains', maxQuantity: 10, quantity: 0, vendor: 'Store' };

  it('restores products and quantities after a page reload', () => {
    service.addToCart(product, 2);
    service.updateQuantity(1, 4);
    const restored = new CartService();
    expect(restored.getCartItems()[0].quantity).toBe(4);
    expect(restored.getCartItems()[0].product.quantity).toBe(4);
    restored.getCartUpdates().subscribe(items => expect(items.length).toBe(1));
  });

  it('persists removal and explicit clearing', () => {
    service.addToCart(product, 2);
    service.removeFromCart(1);
    expect(new CartService().getCartItems()).toEqual([]);
    service.addToCart(product, 1);
    service.clearCart();
    expect(new CartService().getCartItems()).toEqual([]);
  });

  it('ignores malformed stored data', () => {
    for (const value of ['broken JSON', '{}', '[null, {"quantity":2}]']) {
      localStorage.setItem('groceries-basket.cart.v1', value);
      expect(new CartService().getCartItems()).toEqual([]);
    }
  });

  it('keeps working when storage is blocked', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('blocked');
    spyOn(Storage.prototype, 'setItem').and.throwError('blocked');
    const cart = new CartService();
    cart.addToCart(product, 2);
    expect(cart.getTotalItems()).toBe(2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
