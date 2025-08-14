import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car, CarSearchFilters, AdvancedCarSearchFilters, FilterOptions } from '../models/car.model';
import { CarSpecifications } from '../models/car-specifications.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = environment.apiUrl + '/cars';

  constructor(private http: HttpClient) {}

  searchCars(filters?: CarSearchFilters): Observable<Car[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.brand) params = params.set('brand', filters.brand);
      if (filters.model) params = params.set('model', filters.model);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.branchId) params = params.set('branchId', filters.branchId.toString());
      if (filters.city) params = params.set('city', filters.city);
    }

    return this.http.get<Car[]>(`${this.apiUrl}/search`, { params });
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  createCar(car: Partial<Car>): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car);
  }

  updateCar(id: number, car: Partial<Car>): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAvailableCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/available`);
  }

  // Advanced search methods
  advancedSearch(filters: AdvancedCarSearchFilters): Observable<Car[]> {
    return this.http.post<Car[]>(`${this.apiUrl}/advanced-search`, filters);
  }

  // Filter options methods
  getDistinctBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/brands`);
  }

  getDistinctTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/types`);
  }

  getDistinctFuelTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/fuel-types`);
  }

  getDistinctTransmissions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/transmissions`);
  }

  getDistinctColors(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/colors`);
  }

  getDistinctEngineSizes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/engine-sizes`);
  }

  getAllFilterOptions(): Observable<FilterOptions> {
    return this.http.get<FilterOptions>(`${this.apiUrl}/filters/all`);
  }
  
  // Enhanced car methods
  getFeaturedCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/featured`);
  }
  
  getNewArrivals(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/new-arrivals`);
  }
  
  getPopularCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/popular`);
  }
  
  getCarSpecifications(carId: number): Observable<CarSpecifications> {
    return this.http.get<CarSpecifications>(`${this.apiUrl}/${carId}/specifications`);
  }
}

