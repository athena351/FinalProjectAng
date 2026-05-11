import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api } from '../services/api';
import { Product } from '../models/products';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AlertServ } from '../services/alert-serv';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  constructor(
    private router: ActivatedRoute,
    private api: Api,
    private cdr: ChangeDetectorRef,
    private nav: Router,
    public alertServ: AlertServ,
  ) {
    this.router.queryParams.subscribe((data) => {
      this.selectedId = data['id'];
      this.loadProduct(this.selectedId);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  selectedId: any = '';
  product: any[] = [];
  imageUrls: [] = [];
  rating: number = 0;
  reviewCount: number = 0;
  selectedImage: string = '';
  activeTab: string = 'description';
  specList: { key: any; value: any }[] = [];
  ratingStats: { star: number; count: number; percent: number }[] = [];
  reviews: any[] = [];
  relatedProducts: any[] = [];
  cartMap: { [key: number]: number } = {};
  cartItemMap: { [key: number]: number } = {};

  quantityMap: { [key: number]: number } = {};

  showReviewModal: boolean = false;
  selectedRating: number = 0;
  hoverRating: number = 0;
  currentUserId: number = 0;

  showEditModal: boolean = false;
  editRating: number = 0;
  editHoverRating: number = 0;
  editReviewId: number = 0;

  myReview: any = null;
  isLoggedIn: boolean = false;

  isLoading: boolean = false;

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('accessToken');
    if (localStorage.getItem('accessToken')) {
      this.loadCart();
      this.loadFavorites();
    }
    this.loadProfile();
  }

  loadReviews(productId: number) {
    this.api.getAll(`reviews/${productId}`).subscribe({
      next: (resp: any) => {
        let items = resp.data.items;
        this.reviews = items;
        this.reviewCount = resp.data.totalCount;

        if (items.length > 0) {
          let sum = items.reduce((acc: number, item: any) => acc + item.rating, 0);
          this.rating = Number((sum / items.length).toFixed(1));

          let counts = [5, 4, 3, 2, 1].map((star) => {
            return {
              star,
              count: items.filter((i: any) => i.rating === star).length,
            };
          });

          this.ratingStats = counts.map((c) => ({
            ...c,
            percent: this.reviewCount > 0 ? (c.count / this.reviewCount) * 100 : 0,
          }));
        } else {
          this.rating = 0;
          this.ratingStats = [];
        }
        this.myReview = items.find((r: any) => r.user.id === this.currentUserId) || null;

        this.cdr.detectChanges();
      },
    });
  }

  setMainImage(img: string) {
    this.selectedImage = img;
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  loadRelatedProducts(categoryId: number) {
    this.api.getAll(`products/filter?CategoryId=${categoryId}&Take=10`).subscribe({
      next: (resp: any) => {
        let items = resp.data.items;

        this.relatedProducts = items
          .filter((p: any) => Number(p.id) !== Number(this.selectedId))
          .slice(0, 4);

        this.cdr.detectChanges();
      },
    });
  }

  goToProduct(id: number) {
    this.nav.navigateByUrl(`/details?id=${id}`);
  }

  loadProduct(id: number) {
    this.isLoading = true;

    this.api.getAll(`products/${id}`).subscribe({
      next: (resp: any) => {
        this.product = [resp.data];

        this.selectedImage = resp.data.imageUrl;
        this.imageUrls = resp.data.imageUrls;

        this.specList = Object.entries(resp.data.specifications).map(([key, value]) => ({
          key,
          value,
        }));

        this.loadReviews(id);
        this.loadRelatedProducts(resp.data.category.id);

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  zoomStyle: string = 'scale(1)';

  onMouseMove(event: MouseEvent) {
    let target = event.currentTarget as HTMLElement;
    let rect = target.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 100;
    let y = ((event.clientY - rect.top) / rect.height) * 100;

    this.zoomStyle = `scale(2) translate(${50 - x}%, ${50 - y}%)`;
  }

  onMouseLeave() {
    this.zoomStyle = 'scale(1)';
  }

  loadCart() {
    this.api.getCart().subscribe({
      next: (resp: any) => {
        let items = resp.data.items;

        items.forEach((item: any) => {
          this.cartMap[item.product.id] = item.quantity;

          this.cartItemMap[item.product.id] = item.id;
        });

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.log(err);
      },
    });
  }

  addToCart(productId: number) {
    if (!localStorage.getItem('accessToken')) {
      this.alertServ.show('Please login first', 'error');
      return;
    }

    let body = {
      productId: productId,
      quantity: this.quantityMap[productId] || 1,
    };

    this.api.postCart(body).subscribe({
      next: (resp: any) => {
        let cartItemId = resp.data;

        this.cartMap[productId] = this.quantityMap[productId] || 1;

        this.cartItemMap[productId] = cartItemId;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  increase(productId: number) {
    let newQuantity = this.cartMap[productId] + 1;

    let body = {
      itemId: this.cartItemMap[productId],
      quantity: newQuantity,
    };

    this.api.updateCart(body).subscribe({
      next: () => {
        this.cartMap[productId] = newQuantity;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  decrease(productId: number) {
    let currentQuantity = this.cartMap[productId];

    if (currentQuantity > 1) {
      let body = {
        itemId: this.cartItemMap[productId],
        quantity: currentQuantity - 1,
      };

      this.api.updateCart(body).subscribe({
        next: () => {
          this.cartMap[productId]--;

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.log(err);
        },
      });
    } else {
      let itemId = this.cartItemMap[productId];

      this.api.deleteCartItem(itemId).subscribe({
        next: () => {
          delete this.cartMap[productId];
          delete this.cartItemMap[productId];

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  increaseTempQuantity(productId: number) {
    if (!this.quantityMap[productId]) {
      this.quantityMap[productId] = 1;
    }

    this.quantityMap[productId]++;
  }

  decreaseTempQuantity(productId: number) {
    if (!this.quantityMap[productId]) {
      this.quantityMap[productId] = 1;
    }

    if (this.quantityMap[productId] > 1) {
      this.quantityMap[productId]--;
    }
  }

  isFavorite: boolean = false;

  loadFavorites() {
    this.api.favorites().subscribe({
      next: (resp: any) => {
        console.log(resp);

        let items = resp.data.items;
        this.isFavorite = items.some((fav: any) => Number(fav.id) === Number(this.selectedId));
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  toggleFavorite(productId: number) {
    if (!localStorage.getItem('accessToken')) {
      this.alertServ.show('Please login first', 'error');
      return;
    }

    if (this.isFavorite) {
      this.api.removeFromFavorites(productId).subscribe({
        next: (resp) => {
          this.isFavorite = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    } else {
      this.api.addToFavorites(productId).subscribe({
        next: (resp) => {
          this.isFavorite = true;
          this.alertServ.show('Added to Favorites', 'success');
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
    }
  }

  openReviewModal() {
    this.showReviewModal = true;
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.selectedRating = 0;
    this.hoverRating = 0;
  }

  setRating(star: number) {
    this.selectedRating = star;
  }

  submitReview(productId: number) {
    if (!this.selectedRating) return;

    let body = { productId: productId, rate: this.selectedRating };

    this.api.postReview(body).subscribe({
      next: () => {
        this.closeReviewModal();
        this.loadReviews(productId);
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  loadProfile() {
    this.api.profile().subscribe({
      next: (resp: any) => {
        this.currentUserId = resp.data.id;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  openEditModal(review: any) {
    this.editReviewId = review.id;
    this.editRating = review.rating;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editRating = 0;
    this.editHoverRating = 0;
  }

  submitEdit(productId: number) {
    if (!this.editRating) return;

    this.api.updateReview({ reviewId: this.editReviewId, rate: this.editRating }).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadReviews(productId);
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  deleteReview(reviewId: number) {
    this.api.deleteRewiew(reviewId).subscribe({
      next: () => {
        this.loadReviews(this.selectedId);
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }
}
