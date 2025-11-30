import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Intercepts HTTP requests to attach the JWT Authorization header 
 * for protected routes, ensuring the backend receives the necessary token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  // Inject the AuthService to retrieve the current token
  constructor(private auth: AuthService) {}
  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 1. Retrieve the JWT from the AuthService
    const token = this.auth.getToken();
    
    // If no token exists (e.g., this is the login request itself), proceed with the original request
    if (!token) {
      return next.handle(req);
    }
    
    // 2. Clone the request and set the Authorization header
    // The token is sent in the standard 'Bearer' format.
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    
    // 3. Pass the cloned request with the header to the next handler
    return next.handle(cloned);
  }
}