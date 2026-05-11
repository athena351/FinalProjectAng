import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Alert2Serv {
  state = signal<{
    visible: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
  });

  show(options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) {
    this.state.set({
      visible: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      onConfirm: options.onConfirm,
    });
  }

  hide() {
    this.state.set({ ...this.state(), visible: false });
  }
}
