export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  type: string;
  price: number;
  availability: boolean;
  branchId: number;
  branchName: string;
  branchCity: string;
  imageUrl?: string;
  averageRating?: number;
  ratingCount?: number;
  reviewCount?: number;
  
  // Images array from backend
  images?: CarImage[];
  
  // Enhanced specifications
  fuelType?: string;
  transmission?: string;
  seatingCapacity?: number;
  mileage?: number;
  color?: string;
  engineSize?: string;
  horsepower?: number;
  torque?: number;
  acceleration0To60?: number;
  topSpeed?: number;
  fuelEfficiencyCity?: number;
  fuelEfficiencyHighway?: number;
  fuelTankCapacity?: number;
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
  
  // Rental information
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isPopular?: boolean;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  depositAmount?: number;
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

export interface CarImage {
  id: number;
  carId: number;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  imageType: 'PRIMARY' | 'GALLERY' | 'INTERIOR' | 'EXTERIOR' | 'FEATURE';
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarSearchFilters {
  brand?: string;
  model?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  branchId?: number;
  city?: string;
}

export interface AdvancedCarSearchFilters {
  // Basic filters
  brand?: string;
  model?: string;
  type?: string;
  city?: string;
  branchId?: number;
  
  // Price range
  minPrice?: number;
  maxPrice?: number;
  
  // Advanced filters
  fuelType?: string;
  transmission?: string;
  minSeatingCapacity?: number;
  maxSeatingCapacity?: number;
  minYear?: number;
  maxYear?: number;
  color?: string;
  engineSize?: string;
  
  // Rating filters
  minRating?: number;
  minRatingCount?: number;
  
  // Sorting
  sortBy?: 'price' | 'rating' | 'year' | 'mileage';
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  size?: number;
  
  // Availability
  availableOnly?: boolean;
}

export interface FilterOptions {
  brands: string[];
  types: string[];
  fuelTypes: string[];
  transmissions: string[];
  colors: string[];
  engineSizes: string[];
}

