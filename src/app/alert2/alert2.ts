import { Component, effect, inject } from '@angular/core';
import { Alert2Serv } from '../services/alert2-serv';

@Component({
  selector: 'app-alert2',
  imports: [],
  templateUrl: './alert2.html',
  styleUrl: './alert2.scss',
})
export class Alert2 {
  alert = inject(Alert2Serv);

  confirm() {
    this.alert.state().onConfirm();
    this.alert.hide();
  }

  cancel() {
    this.alert.hide();
  }
}

