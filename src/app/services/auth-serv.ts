import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServ {
  isLoggedIn = signal(!!localStorage.getItem("accessToken"));
  

  login(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.isLoggedIn.set(false);
  }
}
