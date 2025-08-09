import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  BookingConfirmationRequest, 
  BookingConfirmationResponse, 
  BookingDto, 
  PendingBookingStats 
} from '../models/booking-confirmation.model';

@Injectable({
  providedIn: 'root'
})
export class BookingConfirmationService {
  private apiUrl = 'http://localhost:8080/api/booking-confirmation';

  constructor(private http: HttpClient) {}

  // Get all pending bookings
  getPendingBookings(): Observable<BookingDto[]> {
    return this.http.get<BookingDto[]>(`${this.apiUrl}/pending`);
  }

  // Get pending bookings by branch
  getPendingBookingsByBranch(branchId: number): Observable<BookingDto[]> {
    return this.http.get<BookingDto[]>(`${this.apiUrl}/pending/branch/${branchId}`);
  }

  // Confirm a booking
  confirmBooking(request: BookingConfirmationRequest): Observable<BookingDto> {
    return this.http.post<BookingDto>(`${this.apiUrl}/confirm`, request);
  }

  // Reject a booking
  rejectBooking(request: BookingConfirmationRequest): Observable<BookingDto> {
    return this.http.post<BookingDto>(`${this.apiUrl}/reject`, request);
  }

  // Get pending bookings count
  getPendingBookingsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pending/count`);
  }

  // Get pending bookings count by branch
  getPendingBookingsCountByBranch(branchId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pending/count/branch/${branchId}`);
  }

  // Get pending booking stats
  getPendingBookingStats(): Observable<PendingBookingStats> {
    return this.http.get<PendingBookingStats>(`${this.apiUrl}/pending/stats`);
  }

  // Generate booking timeline
  generateBookingTimeline(booking: BookingDto): any[] {
    const timeline = [];

    // Booking created
    timeline.push({
      status: 'PENDING',
      timestamp: booking.createdAt,
      description: 'Booking request submitted',
      actor: booking.userFullName
    });

    // If confirmed
    if (booking.confirmedAt && booking.confirmedByFullName) {
      timeline.push({
        status: 'CONFIRMED',
        timestamp: booking.confirmedAt,
        description: 'Booking confirmed by admin',
        actor: booking.confirmedByFullName,
        notes: booking.adminNotes
      });
    }

    // If rejected
    if (booking.status === 'REJECTED' && booking.confirmedAt && booking.confirmedByFullName) {
      timeline.push({
        status: 'REJECTED',
        timestamp: booking.confirmedAt,
        description: 'Booking rejected by admin',
        actor: booking.confirmedByFullName,
        notes: booking.adminNotes
      });
    }

    return timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Get status badge class
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'badge bg-warning';
      case 'CONFIRMED':
        return 'badge bg-success';
      case 'ACTIVE':
        return 'badge bg-primary';
      case 'COMPLETED':
        return 'badge bg-info';
      case 'CANCELLED':
        return 'badge bg-secondary';
      case 'REJECTED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  // Get status display text
  getStatusDisplayText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pending Approval';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  }
} 