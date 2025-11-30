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
  // HARDCODED BACKEND URL TO AVOID ENVIRONMENT ISSUES - FINAL FIX
  // This bypasses all Vercel environment processing issues
  private baseUrl = 'https://intellitask-backend.onrender.com/api';

  constructor(private http: HttpClient) {
    console.log('🚀 AuthService initialized');
    console.log('🔗 API Base URL:', this.baseUrl);
    console.log(
      '🌐 Current hostname:',
      typeof window !== 'undefined' ? window.location.hostname : 'SSR'
    );

    const token = this.getToken();
    if (token) {
      // Optionally fetch user info; for now we keep user null and will set on login/register
    }
  }

  register(username: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/register`;
    return this.http.post(url, { username, email, password }).pipe(
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
    // ABSOLUTE HARDCODED URL TO BYPASS ALL PROCESSING
    const url = `${this.baseUrl}/auth/login`;
    console.log('🔥 ABSOLUTE LOGIN URL:', url);
    console.log('🔥 REQUEST PAYLOAD:', { email, password });
    return this.http.post(url, { email, password }).pipe(
      tap((res: any) => {
        console.log('🔥 LOGIN SUCCESS RESPONSE:', res);
        if (res?.token) this.setToken(res.token);
        if (res?.user) this.currentUserSubject.next(res.user);
      }),
      catchError((err) => {
        console.log('🔥 LOGIN ERROR DETAILS:', err);
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
    const url = `${this.baseUrl}/auth/logout`;
    return this.http.post(url, {}).pipe(
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
