import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceRecord, MaintenanceType, MaintenanceStatus } from '../models/maintenance.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = environment.apiUrl + '/maintenance';

  constructor(private http: HttpClient) {}

  // Create new maintenance record
  createMaintenanceRecord(record: Partial<MaintenanceRecord>): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceRecord>(`${this.apiUrl}/records`, record);
  }

  // Get maintenance record by ID
  getMaintenanceRecordById(id: number): Observable<MaintenanceRecord> {
    return this.http.get<MaintenanceRecord>(`${this.apiUrl}/records/${id}`);
  }

  // Get maintenance records for a specific car
  getMaintenanceRecordsByCarId(carId: number): Observable<MaintenanceRecord[]> {
    return this.http.get<MaintenanceRecord[]>(`${this.apiUrl}/cars/${carId}/records`);
  }

  // Get overdue maintenance records
  getOverdueMaintenance(): Observable<MaintenanceRecord[]> {
    return this.http.get<MaintenanceRecord[]>(`${this.apiUrl}/overdue`);
  }

  // Utility methods for maintenance types
  getMaintenanceTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'OIL_CHANGE': 'Oil Change',
      'TIRE_ROTATION': 'Tire Rotation',
      'BRAKE_SERVICE': 'Brake Service',
      'AIR_FILTER_REPLACEMENT': 'Air Filter Replacement',
      'FUEL_FILTER_REPLACEMENT': 'Fuel Filter Replacement',
      'TRANSMISSION_SERVICE': 'Transmission Service',
      'ENGINE_TUNE_UP': 'Engine Tune-up',
      'COOLANT_FLUSH': 'Coolant Flush',
      'BATTERY_REPLACEMENT': 'Battery Replacement',
      'ALIGNMENT': 'Wheel Alignment',
      'SUSPENSION_SERVICE': 'Suspension Service',
      'EXHAUST_SERVICE': 'Exhaust Service',
      'ELECTRICAL_SERVICE': 'Electrical Service',
      'AC_SERVICE': 'Air Conditioning Service',
      'HEATING_SERVICE': 'Heating Service',
      'BODY_REPAIR': 'Body Repair',
      'PAINT_JOB': 'Paint Job',
      'INTERIOR_REPAIR': 'Interior Repair',
      'GLASS_REPLACEMENT': 'Glass Replacement',
      'EMERGENCY_REPAIR': 'Emergency Repair',
      'PREVENTIVE_MAINTENANCE': 'Preventive Maintenance',
      'INSPECTION': 'Inspection',
      'OTHER': 'Other'
    };
    return typeMap[type] || type;
  }

  // Utility methods for maintenance status
  getMaintenanceStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SCHEDULED': 'Scheduled',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
      'ON_HOLD': 'On Hold',
      'PENDING_PARTS': 'Pending Parts',
      'PENDING_APPROVAL': 'Pending Approval'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'SCHEDULED': 'primary',
      'IN_PROGRESS': 'warning',
      'COMPLETED': 'success',
      'CANCELLED': 'danger',
      'ON_HOLD': 'secondary',
      'PENDING_PARTS': 'info',
      'PENDING_APPROVAL': 'warning'
    };
    return colorMap[status] || 'secondary';
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  // Format cost for display
  formatCost(cost: number | undefined): string {
    if (cost === undefined || cost === null) return 'N/A';
    return `$${cost.toFixed(2)}`;
  }

  // Get maintenance type icon
  getMaintenanceTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'OIL_CHANGE': 'fas fa-oil-can',
      'TIRE_ROTATION': 'fas fa-tire',
      'BRAKE_SERVICE': 'fas fa-brake-system',
      'AIR_FILTER_REPLACEMENT': 'fas fa-wind',
      'FUEL_FILTER_REPLACEMENT': 'fas fa-gas-pump',
      'TRANSMISSION_SERVICE': 'fas fa-cogs',
      'ENGINE_TUNE_UP': 'fas fa-engine',
      'COOLANT_FLUSH': 'fas fa-thermometer-half',
      'BATTERY_REPLACEMENT': 'fas fa-battery-full',
      'ALIGNMENT': 'fas fa-compass',
      'SUSPENSION_SERVICE': 'fas fa-car-side',
      'EXHAUST_SERVICE': 'fas fa-smog',
      'ELECTRICAL_SERVICE': 'fas fa-bolt',
      'AC_SERVICE': 'fas fa-snowflake',
      'HEATING_SERVICE': 'fas fa-fire',
      'BODY_REPAIR': 'fas fa-hammer',
      'PAINT_JOB': 'fas fa-paint-brush',
      'INTERIOR_REPAIR': 'fas fa-couch',
      'GLASS_REPLACEMENT': 'fas fa-window-maximize',
      'EMERGENCY_REPAIR': 'fas fa-exclamation-triangle',
      'PREVENTIVE_MAINTENANCE': 'fas fa-shield-alt',
      'INSPECTION': 'fas fa-search',
      'OTHER': 'fas fa-tools'
    };
    return iconMap[type] || 'fas fa-tools';
  }
} 