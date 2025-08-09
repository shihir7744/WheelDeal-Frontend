export interface CarSpecifications {
  carId: number;
  brand: string;
  model: string;
  year: number;
  
  // Engine specifications
  engineSize?: string;
  horsepower?: number;
  torque?: number;
  fuelType?: string;
  transmission?: string;
  
  // Performance specifications
  acceleration0To60?: number;
  topSpeed?: number;
  fuelEfficiencyCity?: number;
  fuelEfficiencyHighway?: number;
  fuelTankCapacity?: number;
  
  // Dimensions and capacity
  seatingCapacity?: number;
  trunkCapacity?: number;
  groundClearance?: number;
  wheelbase?: number;
  length?: number;
  width?: number;
  height?: number;
  curbWeight?: number;
  
  // Features
  features?: string;
  safetyFeatures?: string;
  entertainmentFeatures?: string;
  comfortFeatures?: string;
  technologyFeatures?: string;
  
  // Rental rates
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  depositAmount?: number;
  
  // Rental policies
  insuranceIncluded?: boolean;
  maintenanceIncluded?: boolean;
  unlimitedMileage?: boolean;
  minimumRentalDays?: number;
  maximumRentalDays?: number;
  ageRequirement?: number;
  licenseRequirement?: string;
  additionalDriverFee?: number;
  lateReturnFee?: number;
  earlyReturnDiscount?: number;
}

export interface CarSpecificationsSection {
  title: string;
  icon: string;
  specifications: CarSpecificationItem[];
}

export interface CarSpecificationItem {
  label: string;
  value: string | number | boolean;
  unit?: string;
  type: 'text' | 'number' | 'boolean' | 'list';
  description?: string;
}

export interface CarFeaturesSection {
  title: string;
  icon: string;
  features: string[];
  color: string;
} 