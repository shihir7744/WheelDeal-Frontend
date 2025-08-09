import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { Car, AdvancedCarSearchFilters } from '../../models/car.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-car-search',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StarRatingComponent, AdvancedSearchComponent, FavoriteButtonComponent],
  templateUrl: './car-search.component.html',
  styleUrls: ['./car-search.component.scss']
})
export class CarSearchComponent implements OnInit {
  searchForm!: FormGroup;
  bookingForm!: FormGroup;
  cars: Car[] = [];
  selectedCar: Car | null = null;
  isLoading = false;
  isBooking = false;
  isCheckingAvailability = false;
  availabilityStatus: 'available' | 'unavailable' | 'checking' | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  minDate = new Date().toISOString().split('T')[0];

  carBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Chevrolet', 'Nissan'];
  carTypes = ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Truck', 'Coupe'];
  cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private bookingService: BookingService,
    private authService: AuthService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.searchCars();
  }

  initializeForms(): void {
    this.searchForm = this.fb.group({
      brand: [''],
      type: [''],
      city: [''],
      maxPrice: ['']
    });

    this.bookingForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
    
    // Listen for date changes to check availability
    this.bookingForm.valueChanges.subscribe(() => {
      this.checkAvailabilityOnDateChange();
    });
  }

  searchCars(): void {
    this.isLoading = true;
    const filters = this.searchForm.value;
    
    // Convert empty strings to null
    Object.keys(filters).forEach(key => {
      if (filters[key] === '') {
        filters[key] = null;
      }
    });

    this.carService.searchCars(filters).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching cars:', error);
        this.isLoading = false;
      }
    });
  }

  onAdvancedSearch(filters: AdvancedCarSearchFilters): void {
    this.isLoading = true;
    
    this.carService.advancedSearch(filters).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in advanced search:', error);
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.searchCars();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  bookCar(car: Car): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.selectedCar = car;
    this.bookingForm.reset();
    this.availabilityStatus = null;
    
    // Show booking modal
    const modal = document.getElementById('bookingModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  submitBooking(): void {
    if (!this.selectedCar || !this.bookingForm.valid) {
      console.log('Form validation failed:', this.bookingForm.errors);
      return;
    }
    
    // Additional validation: ensure end date is after start date
    const startDate = this.bookingForm.value.startDate;
    const endDate = this.bookingForm.value.endDate;
    if (new Date(endDate) <= new Date(startDate)) {
      alert('End date must be after start date');
      return;
    }

    this.isBooking = true;
    
    const bookingData = {
      carId: this.selectedCar.id,
      startDate: this.bookingForm.value.startDate,
      endDate: this.bookingForm.value.endDate
    };

    // First check availability before creating booking
    this.checkAvailabilityAndBook(bookingData);
  }
  
  private checkAvailabilityAndBook(bookingData: any): void {
    this.bookingService.checkAvailability(
      bookingData.carId, 
      bookingData.startDate, 
      bookingData.endDate
    ).subscribe({
      next: (availabilityResponse) => {
        if (availabilityResponse.isAvailable) {
          // Car is available, proceed with booking
          this.createBooking(bookingData);
        } else {
          // Show conflict details
          this.showAvailabilityConflict(availabilityResponse);
          this.isBooking = false;
        }
      },
      error: (error) => {
        console.error('Error checking availability:', error);
        this.isBooking = false;
        alert('Error checking availability. Please try again.');
      }
    });
  }

  private createBooking(bookingData: any): void {
    this.bookingService.createBooking(bookingData).subscribe({
      next: (booking) => {
        this.isBooking = false;
        
        // Hide modal
        const modal = document.getElementById('bookingModal');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
          bootstrapModal.hide();
        }
        
        // Show success message and redirect
        alert('Booking created successfully!');
        this.router.navigate(['/bookings']);
      },
      error: (error) => {
        this.isBooking = false;
        console.error('Booking error:', error);
        
        // Handle specific booking conflict errors
        if (error.status === 409) {
          alert('This car is not available for the selected dates. Please choose different dates.');
        } else {
          alert('Failed to create booking. Please try again.');
        }
      }
    });
  }
  
  private showAvailabilityConflict(availabilityResponse: any): void {
    const conflictMessage = `This car is not available for the selected dates.\n\nConflicting bookings:\n` +
      availabilityResponse.conflictingBookings.map((booking: any) => 
        `- ${booking.startDate} to ${booking.endDate}`
      ).join('\n');
    
    alert(conflictMessage);
  }
  
  private checkAvailabilityOnDateChange(): void {
    const startDate = this.bookingForm.get('startDate')?.value;
    const endDate = this.bookingForm.get('endDate')?.value;
    
    if (startDate && endDate && this.selectedCar) {
      this.isCheckingAvailability = true;
      this.availabilityStatus = 'checking';
      
      this.bookingService.checkAvailability(
        this.selectedCar.id,
        startDate,
        endDate
      ).subscribe({
        next: (response) => {
          this.isCheckingAvailability = false;
          this.availabilityStatus = response.isAvailable ? 'available' : 'unavailable';
        },
        error: (error) => {
          this.isCheckingAvailability = false;
          this.availabilityStatus = null;
          console.error('Error checking availability:', error);
        }
      });
    } else {
      this.availabilityStatus = null;
    }
  }

  getCarImage(car: Car): string {
    return this.imageService.getCarImageUrl(car);
  }

  get bookingDays(): number {
    const startDate = this.bookingForm.get('startDate')?.value;
    const endDate = this.bookingForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    return 0;
  }

  get totalPrice(): number {
    if (this.selectedCar && this.bookingDays > 0) {
      return this.selectedCar.price * this.bookingDays;
    }
    return 0;
  }
}

