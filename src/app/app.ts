import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPage } from "./main-page/main-page";
import { Header } from "./header/header";
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [MainPage, Header, Footer, RouterOutlet]
})
export class App {
  protected readonly title = signal('FinalProjectAng');
}
