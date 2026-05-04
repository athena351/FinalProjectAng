import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertServ {
  state = signal(false);

  context = signal('');
  type = signal('');

  show(str: any, type?: any) {
    this.state.set(true);
    this.context.set(str);
    this.type.set(type);

    setTimeout(() => {
      this.hide();
    }, 6000);
  }

  hide() {
    this.state.set(false);
  }
}
