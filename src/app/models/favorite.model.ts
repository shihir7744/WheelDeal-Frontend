export interface Favorite {
  id: number;
  userId: number;
  carId: number;
  car: Car;
  createdAt: string;
}

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
  averageRating?: number;
  ratingCount?: number;
  reviewCount?: number;
  fuelType?: string;
  transmission?: string;
  seatingCapacity?: number;
  mileage?: number;
  color?: string;
  engineSize?: string;
}

export interface FavoriteResponse {
  message?: string;
  favorite?: Favorite;
} 