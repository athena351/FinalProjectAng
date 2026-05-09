import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../services/api';
import { Product } from '../models/products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  constructor(
    private router: ActivatedRoute,
    private api: Api,
    private cdr: ChangeDetectorRef,
    private nav: Router,
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

quantity: number = 1;

  ngOnInit() {
    this.loadCart();

    this.api.getAll(`products/${this.selectedId}`).subscribe({
      next: (resp: any) => {
        this.product = [resp.data];
        this.selectedImage = resp.data.imageUrl;
        this.imageUrls = resp.data.imageUrls;

        this.specList = Object.entries(resp.data.specifications).map(([key, value]) => ({
          key,
          value,
        }));

        this.loadReviews(this.selectedId);
        this.loadRelatedProducts(resp.data.category.id);
        this.cdr.detectChanges();
      },
    });
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

        this.cdr.detectChanges();
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
    }
  });
}

addToCart(productId: number) {

  let body = {
    productId: productId,
    quantity: this.quantity
  };

  this.api.postCart(body).subscribe({
    next: (resp: any) => {

      let cartItemId = resp.data;

      this.cartMap[productId] = this.quantity;

      this.cartItemMap[productId] = cartItemId;

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.log(err);
    }
  });

}


increase(productId: number) {

  let newQuantity = this.cartMap[productId] + 1;

  let body = {
    itemId: this.cartItemMap[productId],
    quantity: newQuantity
  };

  this.api.updateCart(body).subscribe({
    next: () => {

      this.cartMap[productId] = newQuantity;

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.log(err);
    }
  });

}


decrease(productId: number) {

  let currentQuantity = this.cartMap[productId];

  if (currentQuantity > 1) {

    let body = {
      itemId: this.cartItemMap[productId],
      quantity: currentQuantity - 1
    };

    this.api.updateCart(body).subscribe({
      next: () => {

        this.cartMap[productId]--;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      }
    });
  }

   else {

    let itemId = this.cartItemMap[productId];

    this.api.deleteCartItem(itemId).subscribe({
      next: () => {

        delete this.cartMap[productId];
        delete this.cartItemMap[productId];

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      }
    });

  }

}
}
