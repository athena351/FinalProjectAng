import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { User } from '../models/profile';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  constructor(private api: Api, private cdr : ChangeDetectorRef) {}

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

  fb = new FormBuilder();

  form : any;

  initForm() {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      address: [''],
      pictureUrl: [''],
      dateOfBirth: ['']
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
      dateOfBirth: this.formatDate(this.user.details?.dob)
    });
  }

  formatDate(date: string): string {
  return date ? date.split('T')[0] : '';
}

  user:any;
  initialValue: any;

  getInitials(): string {
  if (!this.user) return '';

  let first = this.user.firstName?.charAt(0) || '';
  let last = this.user.lastName?.charAt(0) || '';

  return (first + last).toUpperCase();
}

saveChanges() {

  this.api.updateProfile(this.form.value).subscribe({
    next: (resp) => {
      console.log('Saved successfully', resp);

      this.initialValue = this.form.getRawValue();
      this.form.markAsPristine();
      this.form.markAsUntouched();
    },
    error: (err) => {
      console.log('Save error', err);
    }
  });
}

discardChanges() {
  this.form.reset(this.initialValue);
}
}
