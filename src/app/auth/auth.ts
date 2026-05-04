import { ChangeDetectorRef, Component, effect, NgModule, signal } from '@angular/core';
import { FormBuilder, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';
import { HideHeader } from '../services/hide-header';
import { Router, RouterLink } from '@angular/router';
import { AlertServ } from '../services/alert-serv';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private hideHeader: HideHeader,
    private router: Router,
    private alert: AlertServ,
  ) {
    this.hideHeader.setHide();

    effect(() => {
      this.showAndHide.set(this.hideHeader.showHide());
    });
  }

  ngOnDestroy() {
    this.hideHeader.setShow();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  fb = new FormBuilder();
  showPassword = false;
  isCodeStep = false;
  currentEmail: string = '';
  showAndHide = signal(false);
  resendDisabled = false;
  resendTimer = 0;
  timerInterval: any;
  passwordTouched = false;
  formSubmitted = false;

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
    this.myRegister.markAllAsTouched();
    this.formSubmitted = true;
    if (!this.myRegister.invalid) {
      this.api.register(this.myRegister.value).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.alert.show(
            'Registration successful! Please check your email to verify your account.',
            'success',
          );

          this.isCodeStep = true;
          this.currentEmail = this.myRegister.value.email!;

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.alert.show("Info doesn't meet requirements", 'error');
        },
      });
    }
  }

  verifyCode() {
    this.myRegister.markAllAsTouched();
    if (!this.codeForm.invalid) {
      this.api
        .verifyCode({
          email: this.currentEmail,
          code: this.codeForm.value.code,
        })
        .subscribe({
          next: (resp: any) => {
            this.alert.show('Verified successfully', 'success');
            this.router.navigate(['/']);

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.log(err);
            this.alert.show('Invalid code', 'error');
          },
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
    if (!this.currentEmail || this.resendDisabled) return;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.resendDisabled = true;

    this.api.resendCode(this.currentEmail).subscribe({
      next: () => {
        this.alert.show('Code resent successfully', 'success');

        this.startCountdown();
      },
      error: () => {
        this.alert.show('Failed to resend code', 'error');
        this.resendDisabled = false;
      },
    });
  }

  startCountdown() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.resendTimer = 10;
    this.resendDisabled = true;

    this.timerInterval = setInterval(() => {
      this.resendTimer--;

      this.cdr.detectChanges();

      if (this.resendTimer <= 0) {
        this.resendDisabled = false;
        this.resendTimer = 0;

        clearInterval(this.timerInterval);
        this.timerInterval = null;

        this.cdr.detectChanges();
      }
    }, 1000);
  }

  isInvalid(field: string): boolean {
    let control = this.myRegister.get(field);
    return !!(control && control.touched && control.invalid);
  }

  get passwordValue(): string {
    return this.myRegister.get('password')?.value || '';
  }

  hasMinLength(): boolean {
    return this.passwordValue.length >= 6;
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.passwordValue);
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.passwordValue);
  }

  get strengthScore(): number {
    return [
      this.hasMinLength(),
      this.hasUpperCase(),
      this.hasNumber(),
      this.hasSpecialChar(),
    ].filter(Boolean).length;
  }

  getStrengthColor(): string {
    let score = this.strengthScore;

    if (score <= 1) return '#ff4d4f';
    if (score === 2) return '#faad14';
    if (score >= 3) return '#1ecb5b';

    return '#ff4d4f';
  }
}
