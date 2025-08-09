export interface Review {
  id?: number;
  carId: number;
  rating: number;
  comment: string;
  userName?: string;
  status?: ReviewStatus;
  moderatorNotes?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ReviewStats {
  carId: number;
  averageRating: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface UserReviewStatus {
  carId: number;
  hasReviewed: boolean;
} 