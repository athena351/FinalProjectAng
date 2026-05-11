import { ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Api } from '../services/api';
import { Category } from '../models/products';
import { HideHeader } from '../services/hide-header';
import { AlertServ } from '../services/alert-serv';
import { AuthServ } from '../services/auth-serv';
import { CartServ } from '../services/cart-serv';
import { ThemeServ } from '../services/theme-serv';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private hideHeader: HideHeader,
    private alert: AlertServ,
    public auth: AuthServ,
    public cartServ: CartServ,
    private router: Router,
    public themeServ: ThemeServ,
  ) {
    effect(() => {
      this.showAndHide.set(this.hideHeader.showHide());
    });
  }

  categories: Category[] = [];
  showAndHide = signal(true);

  user: any = null;
  searchQuery: string = '';

  ngOnInit() {
    this.api.getAll('categories').subscribe({
      next: (resp: any) => {
        this.categories = resp.data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    if (this.auth.isLoggedIn()) {
      this.api.profile().subscribe({
        next: (resp: any) => {
          this.user = resp.data;
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    }
  }

  getInitials(): string {
    if (!this.user) return '';
    let first = this.user.firstName?.charAt(0) || '';
    let last = this.user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  onSearch(event: any) {
    let query = event.target.value;
    if (query.trim()) {
      localStorage.setItem('searchQuery', query);
      this.router.navigateByUrl('/shop');
    }
  }

  goToCategory(categoryId: number) {
    localStorage.setItem('selectedCategory', String(categoryId));
    this.router.navigateByUrl('/shop');
  }

  menuOpen: boolean = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
