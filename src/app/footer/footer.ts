import { Component, effect, signal } from '@angular/core';
import { HideHeader } from '../services/hide-header';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  constructor(private hideHeader : HideHeader) {
    effect(() => {
      this.showAndHide.set(this.hideHeader.showHide())
    })
  }

  showAndHide = signal(true)
}
