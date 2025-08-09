import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { CarComparisonService } from '../../services/car-comparison.service';
import { ImageService } from '../../services/image.service';
import { Car } from '../../models/car.model';
import { CarComparisonResult, ComparisonSection } from '../../models/car-comparison.model';

@Component({
  selector: 'app-car-comparison',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-comparison.component.html',
  styleUrls: ['./car-comparison.component.scss']
})
export class CarComparisonComponent implements OnInit {
  
  availableCars: Car[] = [];
  selectedCarIds: number[] = [];
  comparisonResult: CarComparisonResult | null = null;
  isLoading = false;
  error: string | null = null;
  
  comparisonType: 'specifications' | 'features' | 'pricing' | 'rental' | 'all' = 'all';
  activeTab = 'specifications';
  
  readonly maxCars = 5;
  readonly minCars = 2;

  constructor(
    private carService: CarService,
    private carComparisonService: CarComparisonService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadAvailableCars();
  }

  loadAvailableCars(): void {
    this.carService.getAvailableCars().subscribe({
      next: (cars) => {
        this.availableCars = cars;
      },
      error: (error) => {
        this.error = 'Failed to load available cars';
        console.error('Error loading cars:', error);
      }
    });
  }

  toggleCarSelection(carId: number): void {
    const index = this.selectedCarIds.indexOf(carId);
    
    if (index > -1) {
      // Remove car
      this.selectedCarIds.splice(index, 1);
    } else {
      // Add car if under limit
      if (this.selectedCarIds.length < this.maxCars) {
        this.selectedCarIds.push(carId);
      }
    }
  }

  isCarSelected(carId: number): boolean {
    return this.selectedCarIds.includes(carId);
  }

  canAddMoreCars(): boolean {
    return this.selectedCarIds.length < this.maxCars;
  }

  canCompare(): boolean {
    return this.selectedCarIds.length >= this.minCars;
  }

  compareCars(): void {
    if (!this.canCompare()) return;

    this.isLoading = true;
    this.error = null;

    const request = {
      carIds: this.selectedCarIds,
      comparisonType: this.comparisonType
    };

    this.carComparisonService.compareCars(request).subscribe({
      next: (result) => {
        this.comparisonResult = result;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to compare cars';
        this.isLoading = false;
        console.error('Error comparing cars:', error);
      }
    });
  }

  clearSelection(): void {
    this.selectedCarIds = [];
    this.comparisonResult = null;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getSelectedCars(): Car[] {
    return this.availableCars.filter(car => this.selectedCarIds.includes(car.id));
  }

  getComparisonSection(): ComparisonSection | null {
    if (!this.comparisonResult) return null;
    
    switch (this.activeTab) {
      case 'specifications':
        return this.comparisonResult.specifications || null;
      case 'features':
        return this.comparisonResult.features || null;
      case 'pricing':
        return this.comparisonResult.pricing || null;
      case 'rental':
        return this.comparisonResult.rental || null;
      default:
        return null;
    }
  }

  formatValue(value: any, type: string, unit?: string): string {
    return this.carComparisonService.formatValue(value, type, unit);
  }

  getHighlightClass(attribute: any): string {
    return this.carComparisonService.getHighlightClass(attribute);
  }

  getCarImage(car: Car): string {
    return this.imageService.getCarImageUrl(car);
  }
} 