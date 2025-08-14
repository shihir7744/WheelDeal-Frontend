import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ReviewStats, UserReviewStatus, ReviewStatus } from '../models/review.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl + '/reviews';

  constructor(private http: HttpClient) {}

  // Add or update a review for a car
  addOrUpdateReview(carId: number, rating: number, comment: string): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/cars/${carId}`, { carId, rating, comment });
  }

  // Get approved reviews for a car
  getApprovedReviews(carId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/cars/${carId}`);
  }

  // Get all reviews for a car (admin/moderator only)
  getAllCarReviews(carId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/cars/${carId}/all`);
  }

  // Get user's review for a specific car
  getUserReview(carId: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/cars/${carId}/user`);
  }

  // Get pending reviews for moderation
  getPendingReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/pending`);
  }

  // Moderate a review (approve/reject)
  moderateReview(reviewId: number, status: ReviewStatus, moderatorNotes?: string): Observable<Review> {
    const params: any = { status };
    if (moderatorNotes) {
      params.moderatorNotes = moderatorNotes;
    }
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}/moderate`, null, { params });
  }

  // Get average rating for a car from approved reviews
  getAverageRating(carId: number): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.apiUrl}/cars/${carId}/average`);
  }

  // Check if user has reviewed a car
  hasUserReviewed(carId: number): Observable<UserReviewStatus> {
    return this.http.get<UserReviewStatus>(`${this.apiUrl}/cars/${carId}/has-reviewed`);
  }

  // Delete a review
  deleteReview(carId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cars/${carId}`);
  }
} 