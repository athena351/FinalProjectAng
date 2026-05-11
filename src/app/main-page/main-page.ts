import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { Category } from '../models/products';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-main-page',
  imports: [RouterLink, RouterModule, DecimalPipe],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    if (localStorage.getItem('accessToken')) {
      this.loadCart();
    }
    this.api.getAll('categories').subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.categories = resp.data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this.api.getAll('products/filter?CategoryId=8').subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.featuredProducts = resp.data.items;
        this.cdr.detectChanges();
      },
    });

    this.api.getAll('products/filter?CategoryId=7').subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.newArrivals = resp.data.items;
        this.cdr.detectChanges();
      },
    });
  }

  categories: Category[] = [];
  showCategories: boolean = false;
  showAllText: string = 'View All';

  newArrivals: any[] = [];
  showNewArrivals: boolean = false;
  showNewArrivalsText: string = 'View All';

  featuredProducts: any[] = [];

  cartMap: { [key: number]: { quantity: number; itemId: number } } = {};
  cartItemMap: { [key: number]: number } = {};

  toggleNewArrivals() {
    this.showNewArrivals = !this.showNewArrivals;
    this.showNewArrivalsText = this.showNewArrivals ? 'Hide' : 'View All';
  }

  toggleCategories() {
    this.showCategories = !this.showCategories;
    this.showAllText = this.showCategories ? 'Hide' : 'View All';
  }

  goToNewArrivals() {
    localStorage.setItem('selectedCategory', '7');
    this.router.navigateByUrl('/shop');
  }

  goToNetworking() {
    localStorage.setItem('selectedCategory', '8');
    this.router.navigateByUrl('/shop');
  }

  goToCategory(categoryId: number) {
    localStorage.setItem('selectedCategory', String(categoryId));
    this.router.navigateByUrl('/shop');
  }

  goToProduct(id: number) {
    this.router.navigateByUrl(`/details?id=${id}`);
  }

  loadCart() {
    this.api.getCart().subscribe({
      next: (resp: any) => {
        resp.data.items.forEach((item: any) => {
          this.cartMap[item.product.id] = {
            quantity: item.quantity,
            itemId: item.id,
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  addToCart(productId: number) {
    this.api.postCart({ productId, quantity: 1 }).subscribe({
      next: (resp: any) => {
        this.cartMap[productId] = { quantity: 1, itemId: resp.data };
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  increase(productId: number) {
    let item = this.cartMap[productId];
    let newQuantity = item.quantity + 1;
    this.api.updateCart({ itemId: item.itemId, quantity: newQuantity }).subscribe({
      next: () => {
        this.cartMap[productId].quantity = newQuantity;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  decrease(productId: number) {
    let item = this.cartMap[productId];
    if (item.quantity > 1) {
      let newQuantity = item.quantity - 1;
      this.api.updateCart({ itemId: item.itemId, quantity: newQuantity }).subscribe({
        next: () => {
          this.cartMap[productId].quantity = newQuantity;
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    } else {
      this.api.deleteCartItem(item.itemId).subscribe({
        next: () => {
          delete this.cartMap[productId];
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    }
  }
}
