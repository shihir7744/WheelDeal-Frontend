export interface BookingConfirmationRequest {
  bookingId: number;
  status: 'CONFIRMED' | 'REJECTED';
  adminNotes?: string;
}

export interface BookingConfirmationResponse {
  success: boolean;
  message: string;
  booking?: BookingDto;
}

export interface BookingDto {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  carId: number;
  carBrand: string;
  carModel: string;
  carType: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  adminNotes?: string;
  confirmedAt?: string;
  confirmedByFullName?: string;
  createdAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface BookingTimeline {
  status: BookingStatus;
  timestamp: string;
  description: string;
  actor?: string;
  notes?: string;
}

export interface PendingBookingStats {
  totalPending: number;
  pendingByBranch: { [branchId: number]: number };
} 