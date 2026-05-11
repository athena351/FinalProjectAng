import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileResponse } from '../models/profile';

@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http: HttpClient) {}

  baseUrl: string = 'https://shopapi.stepacademy.ge/api/';

  getAll(url: string) {
    return this.http.get(this.baseUrl + url);
  }

  register(obj: any) {
    return this.http.post('https://shopapi.stepacademy.ge/api/auth/register', obj);
  }

  verifyCode(obj: any) {
    return this.http.put('https://shopapi.stepacademy.ge/api/auth/verify-email', obj);
  }

  resendCode(email: string) {
    return this.http.post(
      `https://shopapi.stepacademy.ge/api/auth/resend-email-verification/${email}`,
      {},
    );
  }

  login(obj: any) {
    return this.http.post('https://shopapi.stepacademy.ge/api/auth/login', obj);
  }

  forgetPassword(email: string) {
    return this.http.post(`https://shopapi.stepacademy.ge/api/auth/forget-password/${email}`, {});
  }

  profile() {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<ProfileResponse>(`https://shopapi.stepacademy.ge/api/users/me`, {
      headers,
    });
  }

  updateProfile(data: any) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put(`https://shopapi.stepacademy.ge/api/users`, data, { headers });
  }

  getCart() {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`https://shopapi.stepacademy.ge/api/cart`, { headers });
  }

  postCart(body: any) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`https://shopapi.stepacademy.ge/api/cart/add-to-cart`, body, { headers });
  }

  updateCart(body: any) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put(`https://shopapi.stepacademy.ge/api/cart/edit-quantity`, body, {
      headers,
    });
  }

  deleteCartItem(productId: number) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`${this.baseUrl}cart/remove-from-cart/${productId}`, { headers });
  }

  checkout() {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`https://shopapi.stepacademy.ge/api/users/checkout`, {}, { headers });
  }

  changePassword(body: any) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put(`https://shopapi.stepacademy.ge/api/users/change-password`, body, {
      headers,
    });
  }

  deleteAccout() {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`https://shopapi.stepacademy.ge/api/users/delete-profile`, { headers });
  }

  favorites() {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`https://shopapi.stepacademy.ge/api/favorites`, { headers });
  }

  addToFavorites(productId: number) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(
      `https://shopapi.stepacademy.ge/api/favorites/${productId}`,
      {},
      { headers },
    );
  }

  removeFromFavorites(productId: number) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`https://shopapi.stepacademy.ge/api/favorites/${productId}`, {
      headers,
    });
  }

  postReview(body: { productId: number; rate: number }) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`https://shopapi.stepacademy.ge/api/reviews`, body, { headers });
  }

  updateReview(body: { reviewId: number; rate: number }) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put(`https://shopapi.stepacademy.ge/api/reviews`, body, { headers });
  }

  deleteRewiew(productId: number) {
    let accessToken = localStorage.getItem('accessToken');

    let headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.delete(`https://shopapi.stepacademy.ge/api/reviews/${productId}`, { headers });
  }
}
