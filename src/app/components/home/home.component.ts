import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HomeService, HomeData, HomeStats } from '../../services/home.service';
import { ModernButtonComponent } from '../shared/modern-button.component';
import { ModernCardComponent } from '../shared/modern-card.component';
import { Car } from '../../models/car.model';
import { Branch } from '../../models/branch.model';
import { DashboardStats } from '../../models/dashboard.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ModernButtonComponent, ModernCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  isLoading = true;
  homeData: HomeData | null = null;
  stats: HomeStats | null = null;

  // Dynamic features based on real data
  features = [
    {
      icon: 'fas fa-car fa-3x text-primary',
      title: 'Premium Fleet',
      description: 'Choose from our extensive collection of well-maintained, modern vehicles for every occasion.',
      dynamicValue: 0
    },
    {
      icon: 'fas fa-clock fa-3x text-success',
      title: '24/7 Support',
      description: 'Our dedicated customer support team is available round the clock to assist you.',
      dynamicValue: '24/7'
    },
    {
      icon: 'fas fa-shield-alt fa-3x text-warning',
      title: 'Fully Insured',
      description: 'All our vehicles come with comprehensive insurance coverage for your peace of mind.',
      dynamicValue: '100%'
    },
    {
      icon: 'fas fa-dollar-sign fa-3x text-info',
      title: 'Best Prices',
      description: 'Competitive rates with no hidden fees. Get the best value for your money.',
      dynamicValue: '$0'
    },
    {
      icon: 'fas fa-map-marker-alt fa-3x text-danger',
      title: 'Multiple Locations',
      description: 'Convenient pickup and drop-off locations across the city for your convenience.',
      dynamicValue: 0
    },
    {
      icon: 'fas fa-mobile-alt fa-3x text-secondary',
      title: 'Easy Booking',
      description: 'Simple and quick online booking process. Reserve your car in just a few clicks.',
      dynamicValue: '100%'
    }
  ];

  // Dynamic stats that will be populated from backend
  dynamicStats = [
    { number: '0', label: 'Premium Vehicles', icon: 'fas fa-car' },
    { number: '0', label: 'Global Locations', icon: 'fas fa-map-marker-alt' },
    { number: '0', label: 'Satisfied Customers', icon: 'fas fa-smile' },
    { number: '0', label: 'Active Bookings', icon: 'fas fa-calendar-check' }
  ];

  // Featured cars section
  featuredCars: Car[] = [];
  popularCars: Car[] = [];
  topRatedCars: Car[] = [];
  hasRatedCars: boolean = false;

  constructor(
    private authService: AuthService,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.loadHomeData();
  }

  loadHomeData(): void {
    this.isLoading = true;
    
    this.homeService.getHomeData().subscribe({
      next: (data) => {
        this.homeData = data;
        this.stats = data.stats;
        this.featuredCars = data.featuredCars;
        this.popularCars = data.popularCars;
        this.topRatedCars = data.topRatedCars;
        
        // Check if we have cars with ratings
        this.hasRatedCars = this.topRatedCars.some(car => car.averageRating && car.averageRating > 0);
        
        this.updateDynamicContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading home data:', error);
        this.isLoading = false;
        // Set fallback values
        this.setFallbackValues();
        
        // Show user-friendly error message
        setTimeout(() => {
          alert('Unable to load dynamic content. Showing default values.');
        }, 1000);
      }
    });
  }

  retryLoadData(): void {
    this.loadHomeData();
  }

  updateDynamicContent(): void {
    if (!this.stats) return;

    // Update hero stats
    this.dynamicStats[0].number = `${this.stats.totalCars}+`;
    this.dynamicStats[1].number = `${this.stats.totalBranches}+`;
    this.dynamicStats[2].number = `${this.stats.totalCustomers}+`;
    this.dynamicStats[3].number = `${this.stats.activeBookings}`;

    // Update features with dynamic values
    this.features[0].dynamicValue = this.stats.totalCars;
    this.features[4].dynamicValue = this.stats.totalBranches;
    
    // Update pricing feature with average daily rate
    if (this.homeData && this.homeData.totalRevenue > 0) {
      const avgDailyRate = Math.round(this.homeData.totalRevenue / Math.max(this.stats.totalBookings, 1));
      this.features[3].dynamicValue = `$${avgDailyRate}`;
    }
  }

  setFallbackValues(): void {
    // Set reasonable fallback values if data loading fails
    this.dynamicStats[0].number = '50+';
    this.dynamicStats[1].number = '10+';
    this.dynamicStats[2].number = '1000+';
    this.dynamicStats[3].number = '25';
    
    this.features[0].dynamicValue = 50;
    this.features[4].dynamicValue = 10;
    this.features[3].dynamicValue = '$75';
  }

  getCarImageUrl(car: Car): string {
    if (car.images && car.images.length > 0) {
      const primaryImage = car.images.find(img => img.isPrimary) || car.images[0];
      return `${environment.baseUrl}/uploads/${primaryImage.fileName}`;
    }
    return 'assets/images/default-car.jpg';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getAverageRating(car: Car): number {
    return car.averageRating || 0;
  }

  getRatingCount(car: Car): number {
    return car.ratingCount || 0;
  }

  getStarRating(car: Car): number[] {
    const rating = this.getAverageRating(car);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(1); // Full star
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(0.5); // Half star
      } else {
        stars.push(0); // Empty star
      }
    }
    return stars;
  }

  getStarClass(starValue: number): string {
    if (starValue === 1) return 'fas fa-star';
    if (starValue === 0.5) return 'fas fa-star-half-alt';
    return 'far fa-star';
  }
}

