import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertServ } from '../services/alert-serv';
import { Alert2Serv } from '../services/alert2-serv';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public alertServ: AlertServ,
  ) {}

  ngOnInit() {
    this.changePassword.get('currentPassword')?.valueChanges.subscribe(() => {
      this.incorrectCurrentPassword = false;
    });
  }

  alert = inject(Alert2Serv);

  currentPasswordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;

  fb = new FormBuilder();

  toggleCurrentPassword() {
    this.currentPasswordVisible = !this.currentPasswordVisible;
  }

  toggleNewPassword() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPassword() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  changePassword = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[!@#$%^&*(),.?":{}|<>]/),
        ],
      ],

      confirmNewPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[!@#$%^&*(),.?":{}|<>]/),
        ],
      ],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmNewPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  incorrectCurrentPassword = false;

  changePass() {
    this.changePassword.markAllAsTouched();

    this.incorrectCurrentPassword = false;

    if (this.changePassword.invalid) return;

    this.api.changePassword(this.changePassword.value).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alertServ.show('Password changed successfully', 'success');
        this.cdr.detectChanges();
      },

      error: (err) => {
        if (err.error.detail == 'Current password is incorrect.') {
          this.incorrectCurrentPassword = true;
          this.cdr.detectChanges();
        }

        console.log(err.error.detail);
      },
    });
  }

  getPasswordError(controlName: string): string {
    const control = this.changePassword.get(controlName);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Password is required';
    }

    if (control.errors['minlength']) {
      return 'Password must be at least 6 characters';
    }

    const value = control.value || '';

    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return 'Password must contain at least one special character';
    }

    return '';
  }

  deleteAcc() {
    this.alert.show({
      title: 'Delete Account',
      message: 'Are you sure you want to delete account?',
      confirmText: 'Delete Account',
      onConfirm: () => {
        this.api.deleteAccout().subscribe({
          next: (resp) => {
            console.log(resp);
            localStorage.clear();
            this.router.navigateByUrl('/home');
            this.alertServ.show('Account Deleted', 'success');
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }
}
