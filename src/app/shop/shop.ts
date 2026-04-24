import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { Category, Filter, Product } from '../models/products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [CommonModule],
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

  ngOnInit() {
    this.getProducts();
    this.getCategories();
  }

  filters = {
    categoryId : null as number | null,
    rating : null as number | null,
    minPrice : null as number | null,
    maxPrice : null as number | null,
  }

  getProducts() {
    this.api.getAll(`products?page=${this.page}&Take=${this.pageSize}`).subscribe({
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

  filterByCat(id: number) {
    this.api.getAll(`products/filter?CategoryId=${id}`).subscribe({
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
}
