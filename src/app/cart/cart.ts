import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { CartServ } from '../services/cart-serv';
import { Api } from '../services/api';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  constructor(
    public cartServ: CartServ,
    private api: Api,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.api.getCart().subscribe({
      next: (resp: any) => {
        // console.log(resp.data.items);
        this.cartItems = resp.data.items;
        this.totalCount = resp.data.totalCount;

        this.total = resp.data.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  cartItems: any[] = [];
  total = 0;
  totalCount = 0;

  increase(item: any) {
    item.quantity++;

    let body = {
      itemId: item.id,
      quantity: item.quantity,
    };

    this.api.updateCart(body).subscribe({
      next: () => {
        item.totalPrice = item.quantity * item.price;

        this.calculateTotal();

        this.cdr.detectChanges();
      },

      error: (err) => {
        item.quantity--;
        console.log(err);
      },
    });
  }

  decrease(item: any) {
    if (item.quantity <= 1) return;

    item.quantity--;

    let body = {
      itemId: item.id,
      quantity: item.quantity,
    };

    this.api.updateCart(body).subscribe({
      next: () => {
        item.totalPrice = item.quantity * item.price;

        this.calculateTotal();

        this.cdr.detectChanges();
      },

      error: (err) => {
        item.quantity++;
        console.log(err);
      },
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

    this.totalCount = this.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }

  remove(item: any) {
    this.api.deleteCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((x) => x.id !== item.id);

        this.calculateTotal();

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }
}
