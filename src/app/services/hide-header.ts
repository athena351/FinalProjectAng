import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HideHeader {

  showHide = signal(true)

  setHide(){
    this.showHide.set(false)
  }

  setShow(){
    this.showHide.set(true)
  }
}
