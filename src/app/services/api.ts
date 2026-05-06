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

  profile(){
    let accessToken = localStorage.getItem("accessToken")

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get<ProfileResponse>(`https://shopapi.stepacademy.ge/api/users/me`, {headers});
  }

  updateProfile(data : any){
    let accessToken = localStorage.getItem("accessToken")

    let headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`,
    // 'Content-Type': 'application/json'
  });

  return this.http.put(`https://shopapi.stepacademy.ge/api/users`, data,  {headers})
  }
}
