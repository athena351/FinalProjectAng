import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { Product } from '../models/products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  
  constructor(private api : Api, private cdr : ChangeDetectorRef) { }

  products : Product[] = [];
  totalCount = 0
  

  ngOnInit(){
    this.api.getAll("products").subscribe({
      next : (resp:any) => {
        console.log(resp.data.items);
        this.products = resp.data.items;
        this.totalCount = resp.data.totalCount
        this.cdr.detectChanges();
      },
      error : (err:any) => {
        console.log(err);
      }
    });
  }
} 

