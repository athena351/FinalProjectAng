import { ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { FormBuilder, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
  ) {}

  fb = new FormBuilder();
  showPassword = false;
  isCodeStep = false;
  currentEmail: string = '';

  myRegister = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  codeForm = this.fb.group({
    code: ['', [Validators.required]],
  });

  register() {
    if (!this.myRegister.invalid) {
      this.api.register(this.myRegister.value).subscribe({
        next: (resp: any) => {
          console.log(resp);

          this.isCodeStep = true;
          this.currentEmail = this.myRegister.value.email!;

          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    }
  }

  verifyCode() {
    if (!this.codeForm.invalid) {
      this.api.verifyCode(this.codeForm.value).subscribe({
        next: (resp: any) => {
          console.log('Verified!', resp);

          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goBackToRegister() {
      this.isCodeStep = false;
}

resendCode() {
  if (!this.currentEmail) return;

  this.api.resendCode(this.currentEmail).subscribe({
    next: (resp: any) => {
      console.log("Code resent!", resp);
    },
    error: err => console.log(err)
  });
}

}
