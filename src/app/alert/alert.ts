import { Component, effect } from '@angular/core';
import { AlertServ } from '../services/alert-serv';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [FormsModule, CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  constructor(private alert: AlertServ) {
    effect(() => {
      this.message = this.alert.context();
      this.type = this.alert.type();
    });
  }

  message = '';
  type = '';

  close() {
    this.alert.hide();
  }
}
