export interface Rating {
  id?: number;
  carId: number;
  rating: number;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RatingStats {
  carId: number;
  averageRating: number;
  ratingCount: number;
}

export interface RatingDistribution {
  carId: number;
  distribution: { [key: number]: number };
}

export interface UserRatingStatus {
  carId: number;
  hasRated: boolean;
} 