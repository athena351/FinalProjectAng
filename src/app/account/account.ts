import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Api } from '../services/api';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Alert2Serv } from '../services/alert2-serv';

@Component({
  selector: 'app-account',
  imports: [RouterLink, RouterLinkActive, RouterModule, RouterOutlet],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  user: any;
  alert = inject(Alert2Serv);

  ngOnInit() {
    this.api.profile().subscribe({
      next: (resp) => {
        this.user = resp.data;

        this.cdr.detectChanges();
      },
      error: (err) => [console.log(err)],
    });
  }

  getInitials(): any {
    if (!this.user) return '';

    let first = this.user.firstName?.charAt(0) || '';
    let last = this.user.lastName?.charAt(0) || '';

    return (first + last).toUpperCase();
  }

  logout() {
    this.alert.show({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      onConfirm: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigateByUrl('/login');
      },
    });
  }
}
