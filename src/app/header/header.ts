import { ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Api } from '../services/api';
import { Category } from '../models/products';
import { HideHeader } from '../services/hide-header';
import { AlertServ } from '../services/alert-serv';
import { AuthServ } from '../services/auth-serv';
import { CartServ } from '../services/cart-serv';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private api : Api, private cdr : ChangeDetectorRef, private hideHeader : HideHeader, private alert : AlertServ, public auth : AuthServ, public cartServ : CartServ){
    effect(() => {
      this.showAndHide.set(this.hideHeader.showHide());
    });
  }


  categories : Category[] = [];
  showAndHide = signal(true);

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
