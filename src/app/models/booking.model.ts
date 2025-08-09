export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
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
  createdAt: string;
}

export interface BookingRequest {
  carId: number;
  startDate: string;
  endDate: string;
}

