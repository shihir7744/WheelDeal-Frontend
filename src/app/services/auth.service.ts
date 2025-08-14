import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest, User } from '../models/user.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Clear any invalid tokens on startup
    this.clearInvalidToken();
    
    // Check if user is already logged in
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      // Decode token to get user info
      const userData = this.getUserFromToken(token);
      if (userData) {
        this.currentUserSubject.next(userData);
      } else {
        // If we can't decode the token, clear it
        this.logout();
      }
    }
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          const user: User = {
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            role: response.role
          };
          this.currentUserSubject.next(user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          const user: User = {
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            role: response.role
          };
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('AuthService - User logged out, token cleared');
  }

  clearInvalidToken(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      console.log('AuthService - Clearing expired token');
      localStorage.removeItem('token');
      this.currentUserSubject.next(null);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const isExpired = this.isTokenExpired(token);
      return !isExpired;
    }
    return false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  refreshUserState(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const userData = this.getUserFromToken(token);
      if (userData) {
        this.currentUserSubject.next(userData);
      } else {
        this.logout();
      }
    } else if (token && this.isTokenExpired(token)) {
      this.logout();
    }
  }

  private getUserFromToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Extract user information from JWT payload
      const user: User = {
        id: payload.id,
        email: payload.sub, // JWT subject contains the email
        fullName: payload.fullName,
        role: payload.role
      };
      
      // Validate that we have the required fields
      if (!user.id || !user.email || !user.fullName || !user.role) {
        console.error('Invalid JWT payload - missing required fields');
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch (error) {
      return true;
    }
  }
}

