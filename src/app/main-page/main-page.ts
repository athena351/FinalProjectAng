import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { Category } from '../models/products';


@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {

  constructor(private api : Api, private cdr : ChangeDetectorRef){}

  ngOnInit(){
    this.api.getAll("categories").subscribe({
      next : (resp:any) => {
        console.log(resp);
        this.categories = resp.data;
        this.cdr.detectChanges();
        
        
      },
      error : (err:any) => {
        console.log(err);
        
      }
    })

    this.api.getAll("products/filter?CategoryId=8").subscribe({
      next : (resp:any) => {
        console.log(resp);
        this.featuredProducts = resp.data.items;
        this.cdr.detectChanges(); 
        
      }
    })

    this.api.getAll("products/filter?CategoryId=7").subscribe({
      next : (resp:any) => {
        console.log(resp);
        this.newArrivals = resp.data.items;
        this.cdr.detectChanges();
      }
    })
  }

  categories : Category[] = [];
  showCategories : boolean = false;
  showAllText : string = "View All";

  newArrivals : any[] = [];
  showNewArrivals : boolean = false;
  showNewArrivalsText : string = "View All";

  featuredProducts : any[] = []

  toggleNewArrivals(){
    this.showNewArrivals = !this.showNewArrivals;
    this.showNewArrivalsText = this.showNewArrivals ? "Hide" : "View All";
  }

  toggleCategories(){
    this.showCategories = !this.showCategories;
    this.showAllText = this.showCategories ? "Hide" : "View All";
  }
  
}
