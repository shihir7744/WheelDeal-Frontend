export interface MaintenanceRecord {
  id: number;
  carId: number;
  carBrand: string;
  carModel: string;
  carLicensePlate: string;
  maintenanceType: MaintenanceType;
  serviceProvider: string;
  serviceDate: string;
  nextServiceDate?: string;
  mileageAtService?: number;
  description?: string;
  cost?: number;
  invoiceNumber?: string;
  technicianNotes?: string;
  partsReplaced?: string;
  laborHours?: number;
  warrantyCovered?: boolean;
  status: MaintenanceStatus;
  performedById?: number;
  performedByFullName?: string;
  createdAt: string;
  updatedAt: string;
}

export enum MaintenanceType {
  OIL_CHANGE = 'OIL_CHANGE',
  TIRE_ROTATION = 'TIRE_ROTATION',
  BRAKE_SERVICE = 'BRAKE_SERVICE',
  AIR_FILTER_REPLACEMENT = 'AIR_FILTER_REPLACEMENT',
  FUEL_FILTER_REPLACEMENT = 'FUEL_FILTER_REPLACEMENT',
  TRANSMISSION_SERVICE = 'TRANSMISSION_SERVICE',
  ENGINE_TUNE_UP = 'ENGINE_TUNE_UP',
  COOLANT_FLUSH = 'COOLANT_FLUSH',
  BATTERY_REPLACEMENT = 'BATTERY_REPLACEMENT',
  ALIGNMENT = 'ALIGNMENT',
  SUSPENSION_SERVICE = 'SUSPENSION_SERVICE',
  EXHAUST_SERVICE = 'EXHAUST_SERVICE',
  ELECTRICAL_SERVICE = 'ELECTRICAL_SERVICE',
  AC_SERVICE = 'AC_SERVICE',
  HEATING_SERVICE = 'HEATING_SERVICE',
  BODY_REPAIR = 'BODY_REPAIR',
  PAINT_JOB = 'PAINT_JOB',
  INTERIOR_REPAIR = 'INTERIOR_REPAIR',
  GLASS_REPLACEMENT = 'GLASS_REPLACEMENT',
  EMERGENCY_REPAIR = 'EMERGENCY_REPAIR',
  PREVENTIVE_MAINTENANCE = 'PREVENTIVE_MAINTENANCE',
  INSPECTION = 'INSPECTION',
  OTHER = 'OTHER'
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
  PENDING_PARTS = 'PENDING_PARTS',
  PENDING_APPROVAL = 'PENDING_APPROVAL'
}

export interface MaintenanceTypeOption {
  value: MaintenanceType;
  label: string;
  icon: string;
}

export interface MaintenanceStatusOption {
  value: MaintenanceStatus;
  label: string;
  color: string;
  icon: string;
}

export interface MaintenanceStatistics {
  totalRecords: number;
  completedRecords: number;
  scheduledRecords: number;
  inProgressRecords: number;
  totalCost: number;
}

export interface MaintenanceFilter {
  carId?: number;
  maintenanceType?: MaintenanceType;
  status?: MaintenanceStatus;
  serviceProvider?: string;
  startDate?: string;
  endDate?: string;
} 