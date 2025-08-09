import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FavoriteService } from '../../services/favorite.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  isScrolled = false;

  favoriteCount = 0;
  bookingsCount = 0;
  activeBookingsCount = 0;
  pendingBookingsCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private favoriteService: FavoriteService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.loadFavoriteCount();
        this.loadBookingCounts();
      } else {
        this.resetCounts();
      }
    });

    // Listen for scroll to toggle scrolled style
    window.addEventListener('scroll', this.onWindowScroll, { passive: true });
  }

  private onWindowScroll = () => {
    this.isScrolled = window.scrollY > 10;
  };

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  private resetCounts(): void {
    this.favoriteCount = 0;
    this.bookingsCount = 0;
    this.activeBookingsCount = 0;
    this.pendingBookingsCount = 0;
  }

  private loadFavoriteCount(): void {
    if (!this.isLoggedIn || this.isAdminOrManager()) { this.favoriteCount = 0; return; }
    this.favoriteService.getFavoriteCount().subscribe({
      next: (count) => this.favoriteCount = count || 0,
      error: () => this.favoriteCount = 0
    });
  }

  private loadBookingCounts(): void {
    if (!this.isLoggedIn || this.isAdminOrManager()) { this.bookingsCount = 0; this.activeBookingsCount = 0; this.pendingBookingsCount = 0; return; }
    this.bookingService.getUserBookings().subscribe({
      next: (list) => {
        const bookings = list || [];
        this.bookingsCount = bookings.length;
        this.activeBookingsCount = bookings.filter(b => b.status === 'ACTIVE' || b.status === 'CONFIRMED').length;
        this.pendingBookingsCount = bookings.filter(b => b.status === 'PENDING').length;
      },
      error: () => { this.bookingsCount = 0; this.activeBookingsCount = 0; this.pendingBookingsCount = 0; }
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  getManagerBranchId(): number {
    const stored = localStorage.getItem('managerBranchId');
    return stored ? +stored : 1;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  navigateToLogin(): void {
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.closeMobileMenu();
    this.router.navigate(['/register']);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen && this.isLoggedIn) {
      this.loadFavoriteCount();
      this.loadBookingCounts();
    }
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
    this.router.navigate(['/home']);
  }

  confirmLogout(): void {
    if (confirm('Are you sure you want to sign out?')) {
      this.logout();
    }
  }

  getRoleDisplayName(role: string | undefined): string {
    if (!role) return 'User';
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'MANAGER':
        return 'Manager';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return 'User';
    }
  }

  forceLogout(): void {
    localStorage.removeItem('token');
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
  }

  isAdminOrManager(): boolean {
    return this.currentUser?.role === 'ADMIN' || this.currentUser?.role === 'MANAGER';
  }

  clearTokenForTesting(): void {
    localStorage.removeItem('token');
    this.authService.logout();
  }
}

