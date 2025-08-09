import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating, RatingStats, RatingDistribution, UserRatingStatus } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8080/api/ratings';

  constructor(private http: HttpClient) {}

  // Add or update a rating for a car
  addOrUpdateRating(carId: number, rating: number): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/cars/${carId}`, { carId, rating });
  }

  // Get average rating and count for a car
  getAverageRating(carId: number): Observable<RatingStats> {
    return this.http.get<RatingStats>(`${this.apiUrl}/cars/${carId}/average`);
  }

  // Get rating distribution for a car
  getRatingDistribution(carId: number): Observable<RatingDistribution> {
    return this.http.get<RatingDistribution>(`${this.apiUrl}/cars/${carId}/distribution`);
  }

  // Get all ratings for a car
  getCarRatings(carId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/cars/${carId}`);
  }

  // Get user's rating for a specific car
  getUserRating(carId: number): Observable<Rating> {
    return this.http.get<Rating>(`${this.apiUrl}/cars/${carId}/user`);
  }

  // Check if user has rated a car
  hasUserRated(carId: number): Observable<UserRatingStatus> {
    return this.http.get<UserRatingStatus>(`${this.apiUrl}/cars/${carId}/has-rated`);
  }

  // Delete a rating
  deleteRating(carId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cars/${carId}`);
  }
} 