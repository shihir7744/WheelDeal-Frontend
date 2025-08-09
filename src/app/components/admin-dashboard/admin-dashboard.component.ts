import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { UserService } from '../../services/user.service';
import { CarService } from '../../services/car.service';
import { BookingService } from '../../services/booking.service';
import { FinancialService } from '../../services/financial.service';
import { BranchService } from '../../services/branch.service';
import { CarImageService } from '../../services/car-image.service';
import { DashboardStats } from '../../models/dashboard.model';
import { User } from '../../models/user.model';
import { Car } from '../../models/car.model';
import { Booking } from '../../models/booking.model';
import { FinancialTransaction } from '../../models/financial.model';
import { Branch } from '../../models/branch.model';
import { CarImage } from '../../models/car-image.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  // Dashboard Stats
  dashboardStats: DashboardStats | null = null;
  isLoading = true;
  error: string | null = null;

  // Navigation
  activeTab: string = 'overview';

  // User Management
  users: User[] = [];
  selectedUser: User | null = null;
  isUserModalOpen = false;
  userForm: any = {};

  // Car Management
  cars: Car[] = [];
  selectedCar: Car | null = null;
  isCarModalOpen = false;
  carForm: any = {};
  branches: Branch[] = [];

  // Image Upload
  selectedFiles: File[] = [];
  carImages: CarImage[] = [];
  uploadProgress = 0;
  isDragOver = false;

  // Branch Management
  selectedBranch: Branch | null = null;
  isBranchModalOpen = false;
  branchForm: any = {};

  // Booking Management
  bookings: Booking[] = [];
  selectedBooking: Booking | null = null;
  isBookingModalOpen = false;
  statusSelect: any;

  // Financial Reports
  financialTransactions: FinancialTransaction[] = [];
  financialReport: any = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Scroll indicators
  canScrollLeft = false;
  canScrollRight = false;

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
    private carService: CarService,
    private bookingService: BookingService,
    private financialService: FinancialService,
    private branchService: BranchService,
    private carImageService: CarImageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadUsers();
    this.loadCars();
    this.loadBookings();
    this.loadFinancialData();
    this.loadBranches();
    
    // Check scroll position after view is initialized
    setTimeout(() => {
      this.checkScrollPosition();
      this.setupScrollListener();
    }, 100);
  }

  // Dashboard Stats
  loadDashboardStats(): void {
    this.isLoading = true;
    this.error = null;

    this.dashboardService.getAdminDashboard().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard statistics. Please check your connection and try again.';
        this.isLoading = false;
      }
    });
  }

  // User Management
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalItems = users.length;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users. Please try again.';
      }
    });
  }

  openUserModal(user?: User): void {
    this.selectedUser = user || null;
    this.userForm = user ? { ...user } : {};
    this.isUserModalOpen = true;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
    this.selectedUser = null;
    this.userForm = {};
  }

  saveUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserModal();
          this.showSuccessMessage('User updated successfully!');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.showErrorMessage('Failed to update user. Please try again.');
        }
      });
    } else {
      this.userService.createUser(this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserModal();
          this.showSuccessMessage('User created successfully!');
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.showErrorMessage('Failed to create user. Please try again.');
        }
      });
    }
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  // Car Management
  loadCars(): void {
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.cars = cars;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.error = 'Failed to load cars. Please try again.';
      }
    });
  }

  loadBranches(): void {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
      },
      error: (error) => {
        console.error('Error loading branches:', error);
      }
    });
  }

  openCarModal(car?: Car): void {
    this.selectedCar = car || null;
    
    if (car) {
      // Editing existing car - copy all properties
      this.carForm = { ...car };
      this.loadCarImages(car.id);
    } else {
      // Creating new car - initialize with default values
      this.carForm = {
        availability: true,
        isFeatured: false,
        isNewArrival: false,
        isPopular: false,
        insuranceIncluded: false,
        maintenanceIncluded: false,
        unlimitedMileage: false,
        minimumRentalDays: 1,
        maximumRentalDays: 30,
        ageRequirement: 21,
        additionalDriverFee: 0,
        lateReturnFee: 0,
        earlyReturnDiscount: 0
      };
      this.carImages = [];
    }
    
    this.isCarModalOpen = true;
    
    // Reset image upload state
    this.selectedFiles = [];
    this.uploadProgress = 0;
    
    // Scroll to top of modal body after a short delay
    setTimeout(() => {
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
    }, 100);
  }

  closeCarModal(): void {
    this.isCarModalOpen = false;
    this.selectedCar = null;
    this.carForm = {};
    this.selectedFiles = [];
    this.carImages = [];
    this.uploadProgress = 0;
  }

  loadCarImages(carId: number): void {
    this.carImageService.getCarImages(carId).subscribe({
      next: (images) => {
        this.carImages = images;
      },
      error: (error) => {
        console.error('Error loading car images:', error);
      }
    });
  }

  // Image Upload Methods
  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.addFiles(files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    this.addFiles(files);
  }

  addFiles(files: File[]): void {
    files.forEach(file => {
      const validation = this.carImageService.validateFile(file);
      if (validation.valid) {
        this.selectedFiles.push(file);
      } else {
        alert(validation.message);
      }
    });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getImageUrl(imagePath: string): string {
    return this.carImageService.getImageUrl(imagePath);
  }

  uploadImages(): void {
    if (this.selectedFiles.length === 0 || !this.selectedCar) return;

    this.uploadProgress = 0;
    const totalFiles = this.selectedFiles.length;
    let uploadedFiles = 0;

    this.carImageService.uploadMultipleImages(this.selectedCar.id, this.selectedFiles).subscribe({
      next: (images) => {
        uploadedFiles++;
        this.uploadProgress = (uploadedFiles / totalFiles) * 100;
        
        if (uploadedFiles === totalFiles) {
          this.selectedFiles = [];
          this.loadCarImages(this.selectedCar!.id);
          this.uploadProgress = 0;
        }
      },
      error: (error) => {
        console.error('Error uploading images:', error);
        alert('Error uploading images. Please try again.');
        this.uploadProgress = 0;
      }
    });
  }

  deleteImage(imageId: number): void {
    if (!this.selectedCar) return;
    
    if (confirm('Are you sure you want to delete this image?')) {
      this.carImageService.deleteImage(this.selectedCar.id, imageId).subscribe({
        next: () => {
          this.loadCarImages(this.selectedCar!.id);
        },
        error: (error) => {
          console.error('Error deleting image:', error);
          alert('Error deleting image. Please try again.');
        }
      });
    }
  }

  setPrimaryImage(imageId: number): void {
    if (!this.selectedCar) return;
    
    this.carImageService.setPrimaryImage(this.selectedCar.id, imageId).subscribe({
      next: () => {
        this.loadCarImages(this.selectedCar!.id);
      },
      error: (error) => {
        console.error('Error setting primary image:', error);
        alert('Error setting primary image. Please try again.');
      }
    });
  }

  saveCar(): void {
    // Validate required fields
    const requiredFields = ['brand', 'model', 'year', 'type', 'price', 'branchId'];
    const missingFields = requiredFields.filter(field => !this.carForm[field]);
    
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field => field.charAt(0).toUpperCase() + field.slice(1)).join(', ');
      alert(`Please fill in all required fields: ${fieldNames}`);
      return;
    }

    // Validate numeric fields
    if (this.carForm.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    if (this.carForm.year < 1900 || this.carForm.year > new Date().getFullYear() + 1) {
      alert('Please enter a valid year');
      return;
    }

    if (this.selectedCar) {
      this.carService.updateCar(this.selectedCar.id, this.carForm).subscribe({
        next: () => {
          this.loadCars();
          this.closeCarModal();
          this.showSuccessMessage('Car updated successfully!');
        },
        error: (error) => {
          console.error('Error updating car:', error);
          this.showErrorMessage('Failed to update car. Please try again.');
        }
      });
    } else {
      this.carService.createCar(this.carForm).subscribe({
        next: (car) => {
          this.loadCars();
          // Upload images after car is created
          if (this.selectedFiles.length > 0) {
            this.selectedCar = car;
            this.uploadImages();
          }
          this.closeCarModal();
          this.showSuccessMessage('Car created successfully!');
        },
        error: (error) => {
          console.error('Error creating car:', error);
          this.showErrorMessage('Failed to create car. Please try again.');
        }
      });
    }
  }

  deleteCar(carId: number): void {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(carId).subscribe({
        next: () => {
          this.loadCars();
        },
        error: (error) => {
          console.error('Error deleting car:', error);
        }
      });
    }
  }

  // Branch Management
  openBranchModal(branch?: Branch): void {
    this.selectedBranch = branch || null;
    this.branchForm = branch ? { ...branch } : {};
    this.isBranchModalOpen = true;
  }

  closeBranchModal(): void {
    this.isBranchModalOpen = false;
    this.selectedBranch = null;
    this.branchForm = {};
  }

  saveBranch(): void {
    // Validate required fields
    if (!this.branchForm.name || !this.branchForm.city || !this.branchForm.address) {
      alert('Please fill in all required fields: Name, City, and Address');
      return;
    }

    if (this.selectedBranch) {
      this.branchService.updateBranch(this.selectedBranch.id, this.branchForm).subscribe({
        next: () => {
          this.loadBranches();
          this.closeBranchModal();
        },
        error: (error) => {
          console.error('Error updating branch:', error);
          alert('Error updating branch. Please check the console for details.');
        }
      });
    } else {
      this.branchService.createBranch(this.branchForm).subscribe({
        next: () => {
          this.loadBranches();
          this.closeBranchModal();
        },
        error: (error) => {
          console.error('Error creating branch:', error);
          alert('Error creating branch. Please check the console for details.');
        }
      });
    }
  }

  deleteBranch(branchId: number): void {
    if (confirm('Are you sure you want to delete this branch?')) {
      this.branchService.deleteBranch(branchId).subscribe({
        next: () => {
          this.loadBranches();
        },
        error: (error) => {
          console.error('Error deleting branch:', error);
        }
      });
    }
  }

  // Booking Management
  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

  openBookingModal(booking: Booking): void {
    this.selectedBooking = booking;
    this.isBookingModalOpen = true;
  }

  closeBookingModal(): void {
    this.isBookingModalOpen = false;
    this.selectedBooking = null;
  }

  updateBookingStatus(bookingId: number, status: string): void {
    this.bookingService.updateBooking(bookingId, { status: status as any }).subscribe({
      next: () => {
        this.loadBookings();
        this.closeBookingModal();
      },
      error: (error: any) => {
        console.error('Error updating booking status:', error);
      }
    });
  }

  // Financial Management
  loadFinancialData(): void {
    this.financialService.getCurrentMonthReport().subscribe({
      next: (report) => {
        this.financialReport = report;
      },
      error: (error) => {
        console.error('Error loading financial report:', error);
      }
    });

    this.financialService.searchTransactions({}).subscribe({
      next: (response) => {
        this.financialTransactions = response.content || [];
      },
      error: (error) => {
        console.error('Error loading financial transactions:', error);
      }
    });
  }

  // Navigation
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.error = null; // Clear errors when switching tabs
  }

  // Error Handling
  clearError(): void {
    this.error = null;
  }

  retryLoadData(): void {
    this.error = null;
    this.loadDashboardStats();
    this.loadUsers();
    this.loadCars();
    this.loadBookings();
    this.loadFinancialData();
    this.loadBranches();
  }

  // Success and Error Messages
  showSuccessMessage(message: string): void {
    // You can implement a toast notification system here
    alert(message); // Temporary implementation
  }

  showErrorMessage(message: string): void {
    this.error = message;
  }

  // Scroll detection methods
  checkScrollPosition(): void {
    const navTabs = document.querySelector('.nav-tabs-container') as HTMLElement;
    if (navTabs) {
      this.canScrollLeft = navTabs.scrollLeft > 0;
      this.canScrollRight = navTabs.scrollLeft < (navTabs.scrollWidth - navTabs.clientWidth);
    }
  }

  scrollLeft(): void {
    const navTabs = document.querySelector('.nav-tabs-container') as HTMLElement;
    if (navTabs) {
      navTabs.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(() => this.checkScrollPosition(), 300);
    }
  }

  scrollRight(): void {
    const navTabs = document.querySelector('.nav-tabs-container') as HTMLElement;
    if (navTabs) {
      navTabs.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(() => this.checkScrollPosition(), 300);
    }
  }

  setupScrollListener(): void {
    const navTabs = document.querySelector('.nav-tabs-container') as HTMLElement;
    if (navTabs) {
      navTabs.addEventListener('scroll', () => {
        this.checkScrollPosition();
      });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.checkScrollPosition();
      }, 100);
    });
  }

  // Utility Methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getUtilizationColor(rate: number): string {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-danger';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'text-success';
      case 'COMPLETED': return 'text-info';
      case 'CANCELLED': return 'text-danger';
      case 'PENDING': return 'text-warning';
      default: return 'text-muted';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN': return 'text-danger';
      case 'MANAGER': return 'text-warning';
      case 'CUSTOMER': return 'text-info';
      default: return 'text-muted';
    }
  }

  // Pagination
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.users.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
} 