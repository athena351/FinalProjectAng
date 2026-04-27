import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../services/api';
import { Product } from '../models/products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  constructor(private router : ActivatedRoute, private api : Api, private cdr: ChangeDetectorRef,){
    this.router.queryParams.subscribe(data => {
      this.selectedId = data['id']
    })
  }

  selectedId : any = ""
  product : any[] = [] 
  imageUrls : [] = []

  ngOnInit(){
    this.api.getAll(`products/${this.selectedId}`).subscribe({
      next: (resp:any) => {
        this.product = [resp.data];
        this.imageUrls = resp.data.imageUrls;
        this.cdr.detectChanges();
        console.log(this.product);
        
      }
    })
  }
}
