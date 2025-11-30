import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../config/environment';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      // Optionally fetch user info; for now we keep user null and will set on login/register
    }
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/auth/register`, { username, email, password })
      .pipe(
        tap((res: any) => {
          if (res?.token) this.setToken(res.token);
          if (res?.user) this.currentUserSubject.next(res.user);
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((res: any) => {
          if (res?.token) this.setToken(res.token);
          if (res?.user) this.currentUserSubject.next(res.user);
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.clearToken();
      return of({ success: true });
    }
    return this.http.post(`${this.baseUrl}/auth/logout`, {}).pipe(
      tap(() => this.clearToken()),
      catchError((err) => {
        this.clearToken();
        return of({ error: err });
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  clearToken() {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
