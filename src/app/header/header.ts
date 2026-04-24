import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Api } from '../services/api';
import { Category } from '../models/products';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private api : Api, private cdr : ChangeDetectorRef){}

  categories : Category[] = [];

  ngOnInit(){
    this.api.getAll("categories").subscribe({
      next : (resp:any) => {
        this.categories = resp.data;
        this.cdr.detectChanges();
      },
      error : (err:any) => {
        console.log(err);
      }
    });
  }
}
