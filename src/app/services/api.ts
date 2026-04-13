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

}
