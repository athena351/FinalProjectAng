import { ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { HideHeader } from '../services/hide-header';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Api } from '../services/api';
import { AlertServ } from '../services/alert-serv';
import { AuthServ } from '../services/auth-serv';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private hideHeader: HideHeader,
    private api: Api,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alert: AlertServ,
    public auth: AuthServ,
  ) {
    this.hideHeader.setHide();

    effect(() => {
      this.showAndHide.set(this.hideHeader.showHide());
    });
  }

  ngOnDestroy() {
    this.hideHeader.setShow();
  }

  fb = new FormBuilder();
  showPassword = false;
  isForgotMode = false;
  showAndHide = signal(false);

  myLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    this.myLogin.markAllAsTouched();

    if (this.myLogin.invalid) return;

    this.api.login(this.myLogin.value).subscribe({
      next: (resp: any) => {
        this.alert.show('Logged in successfully', 'success');

        this.auth.login(resp.data.accessToken, resp.data.refreshToken);
        this.router.navigate(['/']);
        this.api.getTokenn8n({ token : resp.data.accessToken}).subscribe({
          next : (resp : any) => {
            console.log(resp)
            
          }
        })
      },
      error: () => {
        this.alert.show('Invalid email or password', 'error');
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToForgot() {
    this.isForgotMode = true;
  }

  backToLogin() {
    this.isForgotMode = false;
  }

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  forgetPassword() {
    this.forgotForm.markAllAsTouched();

    if (this.forgotForm.invalid) return;

    let email = this.forgotForm.value.email!;

    this.api.forgetPassword(email).subscribe({
      next: () => {
        this.alert.show('Reset link sent (if email exists)', 'success');
      },
      error: () => {
        this.alert.show('Invalid email', 'error');
      },
    });
  }
}
