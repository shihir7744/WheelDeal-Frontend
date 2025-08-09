import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user && (user.role === 'MANAGER' || user.role === 'ADMIN')) {
        return true;
      }
    }
    
    // Redirect to home if not manager or admin
    this.router.navigate(['/home']);
    return false;
  }
} 