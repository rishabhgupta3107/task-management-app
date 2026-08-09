import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface RegisterPayload {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  dob?: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;
  private readonly tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<{ jwt: string }>(`${this.baseUrl}/login`, { username, password })
      .pipe(map((response) => localStorage.setItem(this.tokenKey, response.jwt)));
  }

  register(payload: RegisterPayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, payload);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /** Decodes the JWT payload and checks the `exp` claim without any extra dependency. */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) {
        return false;
      }
      return payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
