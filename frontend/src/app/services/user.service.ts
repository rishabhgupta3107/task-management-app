import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UpdateProfilePayload, UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/api/users`;

  /** Cached copy of the current profile so the shell/avatar can read it synchronously. */
  private cached: UserProfile | null = null;

  constructor(private http: HttpClient) {}

  get current(): UserProfile | null {
    return this.cached;
  }

  getMe(): Observable<UserProfile> {
    return this.http
      .get<UserProfile>(`${this.baseUrl}/me`)
      .pipe(tap((profile) => (this.cached = profile)));
  }

  updateMe(payload: UpdateProfilePayload): Observable<UserProfile> {
    return this.http
      .put<UserProfile>(`${this.baseUrl}/me`, payload)
      .pipe(tap((profile) => (this.cached = profile)));
  }

  clear(): void {
    this.cached = null;
  }
}
