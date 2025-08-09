import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user && user.role === 'ADMIN') {
        return true;
      }
    }
    
    // Redirect to home if not admin
    this.router.navigate(['/home']);
    return false;
  }
} 