import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(private http : HttpClient){}

  baseUrl : string = "https://shopapi.stepacademy.ge/api/"

  getAll(url : string) {
    return this.http.get(this.baseUrl+url)
  }

  register(obj : any){
         return this.http.post("https://shopapi.stepacademy.ge/api/auth/register", obj)
      }

  verifyCode(obj : any){
    return this.http.put("https://shopapi.stepacademy.ge/api/auth/verify-email", obj)
  }

  resendCode(email: string) {
  return this.http.post(
    `https://shopapi.stepacademy.ge/api/auth/resend-email-verification/${email}`, {});
}

login(obj : any){
  return this.http.post('https://shopapi.stepacademy.ge/api/auth/login', obj);
}

forgetPassword(email: string){
  return this.http.post(`https://shopapi.stepacademy.ge/api/auth/forget-password/${email}`, {})
}

}
