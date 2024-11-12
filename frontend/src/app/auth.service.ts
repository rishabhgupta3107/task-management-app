import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private baseUrl = 'http://localhost:8080/api/auth';
  
    constructor(private http: HttpClient, private router: Router) {}
  
    login(username: string, password: string) {
      return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { username, password });
    }
  
    logout() {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  }