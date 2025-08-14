import { Injectable } from '@angular/core';
import { CarImage } from '../models/car.model';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageUploadResponse, ImageType } from '../models/car-image.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  // Use the same base URL as other services, but without the /api prefix for static resources
  private readonly backendUrl = environment.baseUrl;

  constructor() { }

  /**
   * Get the primary image URL for a car
   * @param car - The car object with images array
   * @returns The URL of the primary image or fallback placeholder
   */
  getCarImageUrl(car: any): string {
    // First try to get the primary image from the car's images array
    if (car.images && car.images.length > 0) {
      // Find the primary image first
      const primaryImage = car.images.find((img: CarImage) => img.isPrimary);
      if (primaryImage) {
        return this.getImageUrl(primaryImage.filePath);
      }
      
      // If no primary image, use the first image
      const firstImage = car.images[0];
      return this.getImageUrl(firstImage.filePath);
    }
    
    // Fallback to placeholder images based on brand
    return this.getPlaceholderImage(car.brand || car.carBrand);
  }

  /**
   * Get a specific image from the car's images array
   * @param car - The car object with images array
   * @param imageType - The type of image to look for
   * @returns The URL of the specified image or fallback
   */
  getCarImageByType(car: any, imageType: 'PRIMARY' | 'GALLERY' | 'INTERIOR' | 'EXTERIOR' | 'FEATURE'): string {
    if (car.images && car.images.length > 0) {
      const image = car.images.find((img: CarImage) => img.imageType === imageType);
      if (image) {
        return this.getImageUrl(image.filePath);
      }
    }
    
    return this.getPlaceholderImage(car.brand || car.carBrand);
  }

  /**
   * Get all gallery images for a car
   * @param car - The car object with images array
   * @returns Array of gallery image URLs
   */
  getGalleryImages(car: any): string[] {
    if (car.images && car.images.length > 0) {
      return car.images
        .filter((img: CarImage) => img.imageType === 'GALLERY')
        .map((img: CarImage) => this.getImageUrl(img.filePath));
    }
    
    return [];
  }

  /**
   * Construct the full URL for an image file path
   * @param filePath - The file path from the backend
   * @returns The complete URL for the image
   */
  private getImageUrl(filePath: string): string {
    // If the filePath already starts with http, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    // Extract the filename from the filePath
    const fileName = filePath.split('/').pop();
    if (!fileName) {
      return this.getPlaceholderImage('Car');
    }
    
    // Try the direct uploads path first
    const directUrl = `${this.backendUrl}${filePath}`;
    
    // Also provide the API endpoint as an alternative
    const apiUrl = `${this.backendUrl}/api/images/${fileName}`;
    
    // For now, return the direct URL, but you can switch to apiUrl if needed
    return directUrl;
  }

  /**
   * Get a placeholder image based on brand
   * @param brand - The car brand
   * @returns URL of the placeholder image
   */
  private getPlaceholderImage(brand: string): string {
    const imageMap: { [key: string]: string } = {
      'Toyota': 'https://via.placeholder.com/300x200/4CAF50/white?text=Toyota',
      'Honda': 'https://via.placeholder.com/300x200/2196F3/white?text=Honda',
      'BMW': 'https://via.placeholder.com/300x200/9C27B0/white?text=BMW',
      'Mercedes': 'https://via.placeholder.com/300x200/FF9800/white?text=Mercedes',
      'Audi': 'https://via.placeholder.com/300x200/F44336/white?text=Audi',
      'Ford': 'https://via.placeholder.com/300x200/607D8B/white?text=Ford',
      'Chevrolet': 'https://via.placeholder.com/300x200/795548/white?text=Chevrolet',
      'Nissan': 'https://via.placeholder.com/300x200/E91E63/white?text=Nissan'
    };
    
    return imageMap[brand] || 'https://via.placeholder.com/300x200/757575/white?text=Car';
  }
} 