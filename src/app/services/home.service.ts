import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Car } from '../models/car.model';
import { Branch } from '../models/branch.model';
import { DashboardStats } from '../models/dashboard.model';

export interface HomeStats {
  totalCars: number;
  totalBranches: number;
  totalCustomers: number;
  totalBookings: number;
  availableCars: number;
  featuredCars: number;
  popularCars: number;
  averageRating: number;
  activeBookings: number;
}

export interface HomeData {
  stats: HomeStats;
  featuredCars: Car[];
  popularCars: Car[];
  topRatedCars: Car[];
  branches: Branch[];
  totalRevenue: number;
  monthlyRevenue: number;
  activeBookings: number;
  completedBookings: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private emptyDashboardStats(): DashboardStats {
    return {
      totalCars: 0,
      availableCars: 0,
      totalUsers: 0,
      totalBookings: 0,
      activeBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageBookingValue: 0,
      fleetUtilizationRate: 0,
      recentBookings: 0,
      newUsersThisMonth: 0
    };
  }

  getHomeData(): Observable<HomeData> {
    return forkJoin({
      featuredCars: this.getFeaturedCars().pipe(catchError(() => of<Car[]>([]))),
      popularCars: this.getPopularCars().pipe(catchError(() => of<Car[]>([]))),
      topRatedCars: this.getTopRatedCars().pipe(catchError(() => of<Car[]>([]))),
      branches: this.getAllBranches().pipe(catchError(() => of<Branch[]>([]))),
      dashboardStats: this.getDashboardStats().pipe(catchError(() => of<DashboardStats>(this.emptyDashboardStats())))
    }).pipe(
      map(data => {
        const stats: HomeStats = {
          totalCars: data.dashboardStats.totalCars || 0,
          totalBranches: data.branches.length,
          totalCustomers: data.dashboardStats.totalUsers || 0,
          totalBookings: data.dashboardStats.totalBookings || 0,
          availableCars: data.dashboardStats.availableCars || 0,
          featuredCars: data.featuredCars.length,
          popularCars: data.popularCars.length,
          averageRating: this.calculateAverageRating(data.featuredCars, data.popularCars),
          activeBookings: data.dashboardStats.activeBookings || 0
        };

        return {
          stats,
          featuredCars: data.featuredCars,
          popularCars: data.popularCars,
          topRatedCars: data.topRatedCars,
          branches: data.branches,
          totalRevenue: data.dashboardStats.totalRevenue || 0,
          monthlyRevenue: data.dashboardStats.monthlyRevenue || 0,
          activeBookings: data.dashboardStats.activeBookings || 0,
          completedBookings: data.dashboardStats.completedBookings || 0
        };
      })
    );
  }

  getFeaturedCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/cars/featured`);
  }

  getPopularCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/cars/popular`);
  }

  getTopRatedCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/cars`).pipe(
      map(cars => {
        const ratedCars = cars
          .filter(car => car.availability && car.averageRating && car.averageRating > 0)
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 6);
        if (ratedCars.length === 0) {
          return cars.filter(car => car.availability).slice(0, 6);
        }
        return ratedCars;
      }),
      catchError(() => of<Car[]>([]))
    );
  }

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.apiUrl}/branches`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/public`);
  }

  getCarCount(): Observable<number> {
    return this.http.get<Car[]>(`${this.apiUrl}/cars`).pipe(
      map(cars => cars.length),
      catchError(() => of(0))
    );
  }

  getAvailableCarCount(): Observable<number> {
    return this.http.get<Car[]>(`${this.apiUrl}/cars/available`).pipe(
      map(cars => cars.length),
      catchError(() => of(0))
    );
  }

  getBranchCount(): Observable<number> {
    return this.http.get<Branch[]>(`${this.apiUrl}/branches`).pipe(
      map(branches => branches.length),
      catchError(() => of(0))
    );
  }

  private calculateAverageRating(featuredCars: Car[], popularCars: Car[]): number {
    const allCars = [...featuredCars, ...popularCars];
    const carsWithRatings = allCars.filter(car => car.averageRating && car.averageRating > 0);
    if (carsWithRatings.length === 0) return 0;
    const totalRating = carsWithRatings.reduce((sum, car) => sum + (car.averageRating || 0), 0);
    return Math.round((totalRating / carsWithRatings.length) * 10) / 10;
  }

  getHomeStats(): Observable<HomeStats> {
    return this.getHomeData().pipe(map(data => data.stats));
  }

  getQuickStats(): Observable<{ totalCars: number; totalBranches: number; totalCustomers: number }> {
    return forkJoin({
      cars: this.getCarCount(),
      branches: this.getBranchCount(),
      dashboardStats: this.getDashboardStats().pipe(catchError(() => of<DashboardStats>(this.emptyDashboardStats())))
    }).pipe(
      map(data => ({
        totalCars: data.cars,
        totalBranches: data.branches,
        totalCustomers: data.dashboardStats.totalUsers || 0
      }))
    );
  }
} 