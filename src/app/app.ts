import { Component, effect, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { AlertServ } from './services/alert-serv';
import { Alert } from './alert/alert';
import { Cart } from "./cart/cart";
import { Alert2 } from "./alert2/alert2";

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [MainPage, Header, Footer, RouterOutlet, Alert, Cart, Alert2],
})
export class App {
  protected readonly title = signal('FinalProjectAng');

  constructor(private alert: AlertServ) {
    effect(() => {
      this.state.set(this.alert.state());
    });
  }

  state = signal(false);
}
