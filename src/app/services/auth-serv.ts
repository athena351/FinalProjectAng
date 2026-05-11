import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServ {
  isLoggedIn = signal(!!localStorage.getItem('accessToken'));

  login(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem(`refreshToken`, refreshToken);
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem(`refreshToken`);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isTokenExpired(): any {
    let token = this.getToken();
    if (!token) return true;

    try {
      let payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  clearIfExpired(): void {
    if (this.isTokenExpired()) {
      this.clearTokens();
    }
  }
}
