import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarComparisonRequest, CarComparisonResult } from '../models/car-comparison.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CarComparisonService {
  private apiUrl = environment.apiUrl + '/car-comparison';

  constructor(private http: HttpClient) {}

  compareCars(request: CarComparisonRequest): Observable<CarComparisonResult> {
    return this.http.post<CarComparisonResult>(`${this.apiUrl}/compare`, request);
  }

  compareSpecifications(carIds: number[]): Observable<CarComparisonResult> {
    const request: CarComparisonRequest = {
      carIds,
      comparisonType: 'specifications'
    };
    return this.http.post<CarComparisonResult>(`${this.apiUrl}/compare/specifications`, request);
  }

  compareFeatures(carIds: number[]): Observable<CarComparisonResult> {
    const request: CarComparisonRequest = {
      carIds,
      comparisonType: 'features'
    };
    return this.http.post<CarComparisonResult>(`${this.apiUrl}/compare/features`, request);
  }

  comparePricing(carIds: number[]): Observable<CarComparisonResult> {
    const request: CarComparisonRequest = {
      carIds,
      comparisonType: 'pricing'
    };
    return this.http.post<CarComparisonResult>(`${this.apiUrl}/compare/pricing`, request);
  }

  compareRental(carIds: number[]): Observable<CarComparisonResult> {
    const request: CarComparisonRequest = {
      carIds,
      comparisonType: 'rental'
    };
    return this.http.post<CarComparisonResult>(`${this.apiUrl}/compare/rental`, request);
  }

  formatValue(value: any, type: string, unit?: string): string {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'currency':
        return value ? `$${value}` : 'N/A';
      case 'number':
        return unit ? `${value} ${unit}` : value.toString();
      case 'percentage':
        return value ? `${value}%` : 'N/A';
      default:
        return value ? value.toString() : 'N/A';
    }
  }

  getHighlightClass(attribute: any): string {
    if (!attribute.isHighlighted) return '';
    
    switch (attribute.highlightReason) {
      case 'best':
        return 'highlight-best';
      case 'worst':
        return 'highlight-worst';
      case 'difference':
        return 'highlight-difference';
      default:
        return '';
    }
  }
} 