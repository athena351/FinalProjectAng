import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { Category, Filter, Product } from '../models/products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
  ) {}

  products: Product[] = [];
  totalCount = 0;

  page = 1;
  pageSize = 9;
  totalPages = 0;
  pages: number[] = [];

  cartMap: {
    [key: number]: {
      quantity: number;
      itemId: number;
    };
  } = {};

  ngOnInit() {
    this.getProducts();
    this.getCategories();
    this.getCart();
  }

  filters: any = {
    categoryId: null,
    rating: null,
    minPrice: null,
    maxPrice: null,
    search: null,
    inStock: false,
    sortBy: 'sortBy',
    sortDescending: false,
  };

  getProducts() {
    let query = `products/filter?Page=${this.page}&Take=${this.pageSize}`;

    if (this.filters.categoryId) {
      query += `&CategoryId=${this.filters.categoryId}`;
    }

    if (this.filters.rating) {
      query += `&MinRating=${this.filters.rating}`;
    }

    if (this.filters.minPrice) {
      query += `&MinPrice=${this.filters.minPrice}`;
    }

    if (this.filters.maxPrice) {
      query += `&MaxPrice=${this.filters.maxPrice}`;
    }

    if (this.filters.search) {
      query += `&Search=${this.filters.search}`;
    }

    if (this.filters.inStock) {
      query += `&InStock=${this.filters.inStock}`;
    }

    if (this.filters.sortBy) {
      query += `&SortBy=${this.filters.sortBy}`;
    }

    query += `&SortDescending=${this.filters.sortDescending}`;

    this.api.getAll(query).subscribe({
      next: (resp: any) => {
        this.products = resp.data.items;
        this.totalCount = resp.data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);

        this.pages = [];

        for (let i = 1; i <= this.totalPages; i++) {
          this.pages.push(i);
        }

        this.cdr.detectChanges();
      },
      error: (err: any) => console.log(err),
    });
  }

  filterByCat(id: number) {
    this.filters.categoryId = id;
    this.page = 1;
    this.getProducts();
  }

  filterByRating(rating: number) {
    this.filters.rating = rating;
    this.page = 1;
    this.getProducts();
  }

  setMinPrice(event: any) {
    this.filters.minPrice = +event.target.value;
    this.page = 1;
    this.getProducts();
  }

  setMaxPrice(event: any) {
    this.filters.maxPrice = +event.target.value;
    this.page = 1;
    this.getProducts();
  }

  clearFilters() {
    this.filters = {
      categoryId: null,
      rating: null,
      minPrice: null,
      maxPrice: null,
      search: null,
      inStock: false,
      sortBy: 'sortBy',
      sortDescending: false,
    };

    this.page = 1;
    this.getProducts();
  }

  onSearch(event: any) {
    this.filters.search = event.target.value;
    this.page = 1;
    this.getProducts();
  }

  toggleStock(event: any) {
    this.filters.inStock = event.target.checked;
    this.page = 1;
    this.getProducts();
  }

  onSort(event: any) {
    const value = event.target.value;

    if (!value) {
      this.filters.sortBy = null;
      this.filters.sortDescending = false;
    }

    this.filters.sortBy = value;

    if (value === 'price') {
      this.filters.sortBy = 'Price';
      this.filters.sortDescending = false;
    }

    if (value === 'priceHigh') {
      this.filters.sortBy = 'Price';
      this.filters.sortDescending = true;
    }

    if (value === 'name') {
      this.filters.sortBy = 'Name';
      this.filters.sortDescending = false;
    }

    if (value === 'rating') {
      this.filters.sortBy = 'Rating';
      this.filters.sortDescending = true;
    }

    if (value === 'new') {
      this.filters.sortBy = 'CreatedAt';
      this.filters.sortDescending = true;
    }

    this.page = 1;
    this.getProducts();
  }

  goToPage(p: number) {
    this.page = p;
    this.getProducts();
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getProducts();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getProducts();
    }
  }

  categories: Category[] = [];

  getCategories() {
    this.api.getAll(`categories`).subscribe({
      next: (resp: any) => {
        this.categories = resp.data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.log(err),
    });
  }

  addToCart(productId: number) {

  let body = {
    productId: productId,
    quantity: 1
  };

  this.api.postCart(body).subscribe({

    next: (resp: any) => {

      this.cartMap[productId] = {

        quantity: 1,
        itemId: resp.data

      };

      this.cdr.detectChanges();

    },

    error: (err) => {
      console.log(err);
    }

  });

}

  increase(productId: number) {
    let item = this.cartMap[productId];

    let newQuantity = item.quantity + 1;

    let body = {
      itemId: item.itemId,
      quantity: newQuantity,
    };

    this.api.updateCart(body).subscribe({
      next: () => {
        item.quantity = newQuantity;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  decrease(productId: number) {
    let item = this.cartMap[productId];

    if (item.quantity <= 1) {
      delete this.cartMap[productId];

      return;
    }

    let newQuantity = item.quantity - 1;

    let body = {
      itemId: item.itemId,
      quantity: newQuantity,
    };

    this.api.updateCart(body).subscribe({
      next: () => {
        item.quantity = newQuantity;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  getCart() {

  this.api.getCart().subscribe({

    next: (resp: any) => {

      this.cartMap = {};

      resp.data.items.forEach((item: any) => {

        this.cartMap[item.product.id] = {

          quantity: item.quantity,
          itemId: item.id

        };

      });

      this.cdr.detectChanges();

    },

    error: (err: any) => {

      console.log(err);

    }

  });

}
}
