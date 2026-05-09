import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartServ {
  state = signal(false)

  showCart(){
    this.state.set(true)
  }

  hideCart(){
    this.state.set(false)
  }
}
