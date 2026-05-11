import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Api } from '../services/api';
import { pipe } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Alert2Serv } from '../services/alert2-serv';
import { AlertServ } from '../services/alert-serv';

@Component({
  selector: 'app-full-cart',
  imports: [DecimalPipe, RouterModule],
  templateUrl: './full-cart.html',
  styleUrl: './full-cart.scss',
})
export class FullCart {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    public alertServ: AlertServ,
  ) {}

  cartItems: any[] = [];
  total = 0;
  totalCount = 0;

  ngOnInit() {
    this.loadCart();
  }

  alert = inject(Alert2Serv);

  loadCart() {
    this.api.getCart().subscribe({
      next: (resp: any) => {
        this.cartItems = resp.data.items;
        this.totalCount = resp.data.totalCount;

        this.calculateTotal();

        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
  }

  increase(item: any) {
    const newQty = item.quantity + 1;

    this.api
      .updateCart({
        itemId: item.id,
        quantity: newQty,
      })
      .subscribe({
        next: () => {
          item.quantity = newQty;
          item.totalPrice = newQty * item.price;

          this.calculateTotal();
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
  }

  decrease(item: any) {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }

    const newQty = item.quantity - 1;

    this.api
      .updateCart({
        itemId: item.id,
        quantity: newQty,
      })
      .subscribe({
        next: () => {
          item.quantity = newQty;
          item.totalPrice = newQty * item.price;

          this.calculateTotal();
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
  }

  removeItem(item: any) {
    this.alert.show({
      title: 'Delete Product',
      message: `Are you Sure you want to delete this product from cart?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.api.deleteCartItem(item.id).subscribe({
          next: () => {
            this.cartItems = this.cartItems.filter((x) => x.id !== item.id);
            this.calculateTotal();
            this.cdr.detectChanges();
          },
          error: (err) => console.log(err),
        });
      },
    });
  }

  clearCart() {
    this.cartItems.forEach((item) => {
      this.api.deleteCartItem(item.id).subscribe({
        error: (err) => console.log(err),
      });
    });

    this.cartItems = [];
    this.total = 0;
    this.totalCount = 0;

    this.cdr.detectChanges();
  }

  checkout() {
    this.alert.show({
      title: 'Confirm Order',
      message: 'Do you want to place an order?',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.api.checkout().subscribe({
          next: (resp: any) => {
            this.cartItems = [];
            this.total = 0;
            this.totalCount = 0;

            this.alertServ.show('Order placed Successfully', 'success');
            this.cdr.detectChanges();
          },
          error: (err) => console.log(err),
        });
      },
    });
  }
}
