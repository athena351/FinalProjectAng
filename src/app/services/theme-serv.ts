import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeServ {
  isDark = signal(false);

  constructor() {
    let saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.isDark.set(true);
      document.body.setAttribute('data-theme', 'dark');
    }
  }

  toggle() {
    this.isDark.set(!this.isDark());
    if (this.isDark()) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
