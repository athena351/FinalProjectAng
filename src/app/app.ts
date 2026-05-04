import { Component, effect, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { AlertServ } from './services/alert-serv';
import { Alert } from './alert/alert';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [MainPage, Header, Footer, RouterOutlet, Alert],
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
