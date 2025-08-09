import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { AdvancedCarSearchFilters, FilterOptions } from '../../models/car.model';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  @Output() searchResults = new EventEmitter<AdvancedCarSearchFilters>();

  searchForm!: FormGroup;
  filterOptions: FilterOptions = {
    brands: [],
    types: [],
    fuelTypes: [],
    transmissions: [],
    colors: [],
    engineSizes: []
  };
  isLoading = false;
  showAdvancedFilters = false;

  // Sorting options
  sortOptions = [
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'year', label: 'Year' },
    { value: 'mileage', label: 'Mileage' }
  ];

  sortOrderOptions = [
    { value: 'asc', label: 'Low to High' },
    { value: 'desc', label: 'High to Low' }
  ];

  constructor(
    private fb: FormBuilder,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFilterOptions();
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      // Basic filters
      brand: [''],
      model: [''],
      type: [''],
      city: [''],
      
      // Price range
      minPrice: [''],
      maxPrice: [''],
      
      // Advanced filters
      fuelType: [''],
      transmission: [''],
      minSeatingCapacity: [''],
      maxSeatingCapacity: [''],
      minYear: [''],
      maxYear: [''],
      color: [''],
      engineSize: [''],
      
      // Rating filters
      minRating: [''],
      minRatingCount: [''],
      
      // Sorting
      sortBy: [''],
      sortOrder: [''],
      
      // Availability
      availableOnly: [true]
    });
  }

  private loadFilterOptions(): void {
    this.isLoading = true;
    
    // Load all filter options in parallel
    Promise.all([
      this.carService.getDistinctBrands().toPromise(),
      this.carService.getDistinctTypes().toPromise(),
      this.carService.getDistinctFuelTypes().toPromise(),
      this.carService.getDistinctTransmissions().toPromise(),
      this.carService.getDistinctColors().toPromise(),
      this.carService.getDistinctEngineSizes().toPromise()
    ]).then(([brands, types, fuelTypes, transmissions, colors, engineSizes]) => {
      this.filterOptions = {
        brands: brands || [],
        types: types || [],
        fuelTypes: fuelTypes || [],
        transmissions: transmissions || [],
        colors: colors || [],
        engineSizes: engineSizes || []
      };
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading filter options:', error);
      this.isLoading = false;
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const filters = this.buildSearchFilters();
      this.searchResults.emit(filters);
    }
  }

  onClearFilters(): void {
    this.searchForm.reset({
      availableOnly: true
    });
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  private buildSearchFilters(): AdvancedCarSearchFilters {
    const formValue = this.searchForm.value;
    
    return {
      brand: formValue.brand || undefined,
      model: formValue.model || undefined,
      type: formValue.type || undefined,
      city: formValue.city || undefined,
      minPrice: formValue.minPrice ? Number(formValue.minPrice) : undefined,
      maxPrice: formValue.maxPrice ? Number(formValue.maxPrice) : undefined,
      fuelType: formValue.fuelType || undefined,
      transmission: formValue.transmission || undefined,
      minSeatingCapacity: formValue.minSeatingCapacity ? Number(formValue.minSeatingCapacity) : undefined,
      maxSeatingCapacity: formValue.maxSeatingCapacity ? Number(formValue.maxSeatingCapacity) : undefined,
      minYear: formValue.minYear ? Number(formValue.minYear) : undefined,
      maxYear: formValue.maxYear ? Number(formValue.maxYear) : undefined,
      color: formValue.color || undefined,
      engineSize: formValue.engineSize || undefined,
      minRating: formValue.minRating ? Number(formValue.minRating) : undefined,
      minRatingCount: formValue.minRatingCount ? Number(formValue.minRatingCount) : undefined,
      sortBy: formValue.sortBy || undefined,
      sortOrder: formValue.sortOrder || undefined,
      availableOnly: formValue.availableOnly
    };
  }

  hasActiveFilters(): boolean {
    const formValue = this.searchForm.value;
    return !!(formValue.brand || formValue.model || formValue.type || formValue.city ||
             formValue.minPrice || formValue.maxPrice || formValue.fuelType ||
             formValue.transmission || formValue.minSeatingCapacity || formValue.maxSeatingCapacity ||
             formValue.minYear || formValue.maxYear || formValue.color || formValue.engineSize ||
             formValue.minRating || formValue.minRatingCount || formValue.sortBy);
  }

  getActiveFilterCount(): number {
    const formValue = this.searchForm.value;
    let count = 0;
    
    if (formValue.brand) count++;
    if (formValue.model) count++;
    if (formValue.type) count++;
    if (formValue.city) count++;
    if (formValue.minPrice || formValue.maxPrice) count++;
    if (formValue.fuelType) count++;
    if (formValue.transmission) count++;
    if (formValue.minSeatingCapacity || formValue.maxSeatingCapacity) count++;
    if (formValue.minYear || formValue.maxYear) count++;
    if (formValue.color) count++;
    if (formValue.engineSize) count++;
    if (formValue.minRating || formValue.minRatingCount) count++;
    if (formValue.sortBy) count++;
    
    return count;
  }
} 