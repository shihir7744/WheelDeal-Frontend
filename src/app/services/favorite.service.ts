import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite, Car, FavoriteResponse } from '../models/favorite.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = environment.apiUrl + '/favorites';

  constructor(private http: HttpClient) {}

  // Add car to favorites
  addToFavorites(carId: number): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiUrl}/cars/${carId}`, {});
  }

  // Remove car from favorites
  removeFromFavorites(carId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cars/${carId}`);
  }

  // Toggle favorite status
  toggleFavorite(carId: number): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(`${this.apiUrl}/cars/${carId}/toggle`, {});
  }

  // Get all favorites for current user
  getUserFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.apiUrl);
  }

  // Get favorite cars for current user
  getUserFavoriteCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/cars`);
  }

  // Check if a car is favorited by current user
  isCarFavorited(carId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/cars/${carId}/check`);
  }

  // Get favorite count for current user
  getFavoriteCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
} 