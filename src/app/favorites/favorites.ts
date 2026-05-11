import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  favorites: any[] = [];
  totalCount = 0;
  cartMap: { [key: number]: number } = {};
  cartItemMap: { [key: number]: number } = {};

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.api.favorites().subscribe({
      next: (resp: any) => {
        this.favorites = resp.data.items;
        this.totalCount = resp.totalCount;

        this.loadCart();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeFromFavorites(productId: number) {
    this.api.removeFromFavorites(productId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter((item: any) => item.id !== productId);
        this.totalCount--;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  goToProduct(id: number) {
    this.router.navigateByUrl(`/details?id=${id}`);
  }

  loadCart() {
    this.api.getCart().subscribe({
      next: (resp: any) => {
        resp.data.items.forEach((item: any) => {
          this.cartMap[item.product.id] = item.quantity;
          this.cartItemMap[item.product.id] = item.id;
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  addToCart(productId: number) {
    this.api.postCart({ productId, quantity: 1 }).subscribe({
      next: (resp: any) => {
        this.cartMap[productId] = 1;
        this.cartItemMap[productId] = resp.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  increase(productId: number) {
    let newQuantity = this.cartMap[productId] + 1;
    this.api.updateCart({ itemId: this.cartItemMap[productId], quantity: newQuantity }).subscribe({
      next: () => {
        this.cartMap[productId] = newQuantity;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  decrease(productId: number) {
    if (this.cartMap[productId] > 1) {
      let newQuantity = this.cartMap[productId] - 1;
      this.api
        .updateCart({ itemId: this.cartItemMap[productId], quantity: newQuantity })
        .subscribe({
          next: () => {
            this.cartMap[productId] = newQuantity;
            this.cdr.detectChanges();
          },
          error: (err) => console.log(err),
        });
    } else {
      this.api.deleteCartItem(this.cartItemMap[productId]).subscribe({
        next: () => {
          delete this.cartMap[productId];
          delete this.cartItemMap[productId];
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    }
  }
}
