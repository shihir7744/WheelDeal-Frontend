import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CarImage, ImageUploadResponse } from '../models/car-image.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {
  private apiUrl = environment.apiUrl + '/car-images';

  constructor(private http: HttpClient) { }

  uploadImage(carId: number, file: File, options?: {
    imageType?: string;
    isPrimary?: boolean;
    sortOrder?: number;
    altText?: string;
    caption?: string;
  }): Observable<CarImage> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.imageType) {
      formData.append('imageType', options.imageType);
    }
    if (options?.isPrimary !== undefined) {
      formData.append('isPrimary', options.isPrimary.toString());
    }
    if (options?.sortOrder !== undefined) {
      formData.append('sortOrder', options.sortOrder.toString());
    }
    if (options?.altText) {
      formData.append('altText', options.altText);
    }
    if (options?.caption) {
      formData.append('caption', options.caption);
    }

    return this.http.post<CarImage>(`${this.apiUrl}/${carId}/upload`, formData);
  }

  uploadMultipleImages(carId: number, files: File[], options?: {
    imageType?: string;
    isPrimary?: boolean;
    sortOrder?: number;
    altText?: string;
    caption?: string;
  }): Observable<CarImage[]> {
    const uploads = files.map((file, index) => {
      const fileOptions = {
        ...options,
        sortOrder: (options?.sortOrder || 0) + index
      };
      return this.uploadImage(carId, file, fileOptions);
    });

    // Return all uploads as an array
    return new Observable(observer => {
      const results: CarImage[] = [];
      let completed = 0;

      uploads.forEach(upload => {
        upload.subscribe({
          next: (image) => {
            results.push(image);
            completed++;
            if (completed === files.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      });
    });
  }

  getCarImages(carId: number): Observable<CarImage[]> {
    return this.http.get<CarImage[]>(`${this.apiUrl}/${carId}`);
  }

  getPrimaryImage(carId: number): Observable<CarImage> {
    return this.http.get<CarImage>(`${this.apiUrl}/${carId}/primary`);
  }

  getGalleryImages(carId: number): Observable<CarImage[]> {
    return this.http.get<CarImage[]>(`${this.apiUrl}/${carId}/gallery`);
  }

  updateImage(carId: number, imageId: number, updates: {
    imageType?: string;
    isPrimary?: boolean;
    sortOrder?: number;
    altText?: string;
    caption?: string;
  }): Observable<CarImage> {
    return this.http.put<CarImage>(`${this.apiUrl}/${carId}/${imageId}`, updates);
  }

  deleteImage(carId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${carId}/${imageId}`);
  }

  setPrimaryImage(carId: number, imageId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${carId}/${imageId}/primary`, {});
  }

  reorderImages(carId: number, imageIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${carId}/reorder`, imageIds);
  }

  getImageCount(carId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${carId}/count`);
  }

  getPrimaryImageCount(carId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${carId}/primary-count`);
  }

  // Helper method to get full image URL
  getImageUrl(imagePath: string): string {
    return `${environment.baseUrl}${imagePath}`;
  }

  // Helper method to validate file
  validateFile(file: File): { valid: boolean; message?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return { valid: false, message: 'File size must be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    return { valid: true };
  }
} 