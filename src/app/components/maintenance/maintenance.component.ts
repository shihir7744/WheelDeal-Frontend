import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from '../../services/maintenance.service';
import { CarService } from '../../services/car.service';
import { MaintenanceRecord, MaintenanceType, MaintenanceStatus } from '../../models/maintenance.model';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  maintenanceRecords: MaintenanceRecord[] = [];
  cars: Car[] = [];
  overdueRecords: MaintenanceRecord[] = [];
  isLoading = false;
  error: string | null = null;
  showAddForm = false;
  selectedCarId: number | null = null;
  
  maintenanceForm: FormGroup;
  
  maintenanceTypes = Object.values(MaintenanceType);
  maintenanceStatuses = Object.values(MaintenanceStatus);

  constructor(
    private maintenanceService: MaintenanceService,
    private carService: CarService,
    private fb: FormBuilder
  ) {
    this.maintenanceForm = this.fb.group({
      carId: ['', Validators.required],
      maintenanceType: ['', Validators.required],
      serviceProvider: ['', Validators.required],
      serviceDate: ['', Validators.required],
      nextServiceDate: [''],
      mileageAtService: [''],
      description: [''],
      cost: [''],
      invoiceNumber: [''],
      technicianNotes: [''],
      partsReplaced: [''],
      laborHours: [''],
      warrantyCovered: [false],
      status: [MaintenanceStatus.COMPLETED]
    });
  }

  ngOnInit(): void {
    this.loadCars();
    this.loadOverdueMaintenance();
  }

  loadCars(): void {
    this.isLoading = true;
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load cars';
        this.isLoading = false;
        console.error('Error loading cars:', error);
      }
    });
  }

  onCarSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement && selectElement.value) {
      this.loadMaintenanceRecords(Number(selectElement.value));
    } else {
      this.selectedCarId = null;
      this.maintenanceRecords = [];
    }
  }

  loadMaintenanceRecords(carId: number): void {
    this.isLoading = true;
    this.selectedCarId = carId;
    this.maintenanceService.getMaintenanceRecordsByCarId(carId).subscribe({
      next: (records) => {
        this.maintenanceRecords = records;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load maintenance records';
        this.isLoading = false;
        console.error('Error loading maintenance records:', error);
      }
    });
  }

  loadOverdueMaintenance(): void {
    this.maintenanceService.getOverdueMaintenance().subscribe({
      next: (records) => {
        this.overdueRecords = records;
      },
      error: (error) => {
        console.error('Error loading overdue maintenance:', error);
      }
    });
  }

  showAddMaintenanceForm(): void {
    this.showAddForm = true;
    this.maintenanceForm.reset();
    this.maintenanceForm.patchValue({
      status: MaintenanceStatus.COMPLETED,
      warrantyCovered: false
    });
  }

  hideAddForm(): void {
    this.showAddForm = false;
    this.maintenanceForm.reset();
  }

  onSubmit(): void {
    if (this.maintenanceForm.valid) {
      this.isLoading = true;
      const formData = this.maintenanceForm.value;
      
      // Convert date strings to proper format
      if (formData.serviceDate) {
        formData.serviceDate = new Date(formData.serviceDate).toISOString().split('T')[0];
      }
      if (formData.nextServiceDate) {
        formData.nextServiceDate = new Date(formData.nextServiceDate).toISOString().split('T')[0];
      }

      this.maintenanceService.createMaintenanceRecord(formData).subscribe({
        next: (record) => {
          this.maintenanceRecords.unshift(record);
          this.hideAddForm();
          this.isLoading = false;
          this.loadOverdueMaintenance(); // Refresh overdue records
        },
        error: (error) => {
          this.error = 'Failed to create maintenance record';
          this.isLoading = false;
          console.error('Error creating maintenance record:', error);
        }
      });
    }
  }

  getMaintenanceTypeLabel(type: string): string {
    return this.maintenanceService.getMaintenanceTypeLabel(type);
  }

  getMaintenanceStatusLabel(status: string): string {
    return this.maintenanceService.getMaintenanceStatusLabel(status);
  }

  getStatusColor(status: string): string {
    return this.maintenanceService.getStatusColor(status);
  }

  getMaintenanceTypeIcon(type: string): string {
    return this.maintenanceService.getMaintenanceTypeIcon(type);
  }

  formatDate(dateString: string): string {
    return this.maintenanceService.formatDate(dateString);
  }

  formatCost(cost: number | undefined): string {
    return this.maintenanceService.formatCost(cost);
  }

  getSelectedCar(): Car | undefined {
    return this.cars.find(car => car.id === this.selectedCarId);
  }
} 