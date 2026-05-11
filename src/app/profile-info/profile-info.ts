import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Api } from '../services/api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertServ } from '../services/alert-serv';

@Component({
  selector: 'app-profile-info',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.scss',
})
export class ProfileInfo {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    public alertServ: AlertServ,
  ) {}

  fb = new FormBuilder();

  form: any;
  user: any;
  initialValue: any;

  ngOnInit() {
    this.initForm();

    this.api.profile().subscribe({
      next: (resp) => {
        this.user = resp.data;

        this.patchForm();
        this.initialValue = this.form.getRawValue();
        this.form.markAsPristine();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  initForm() {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      address: [''],
      pictureUrl: [''],
      dateOfBirth: [''],
    });
  }

  patchForm() {
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phoneNumber: this.user.details?.phoneNumber,
      address: this.user.details?.address,
      pictureUrl: this.user.details?.pictureUrl,
      dateOfBirth: this.formatDate(this.user.details?.dob),
    });
  }

  formatDate(date: string): string {
    return date ? date.split('T')[0] : '';
  }

  getInitials(): string {
    if (!this.user) return '';

    let first = this.user.firstName?.charAt(0) || '';
    let last = this.user.lastName?.charAt(0) || '';

    return (first + last).toUpperCase();
  }

  saveChanges() {
    this.api.updateProfile(this.form.getRawValue()).subscribe({
      next: (resp) => {
        this.initialValue = this.form.getRawValue();
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.alertServ.show('Profile Updated Successfully', 'success');

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  discardChanges() {
    this.form.reset(this.initialValue);
  }
}
