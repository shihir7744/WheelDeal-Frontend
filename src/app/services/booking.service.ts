import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingRequest } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(bookingRequest: BookingRequest): Observable<Booking> {
    console.log('Creating booking with data:', bookingRequest);
    return this.http.post<Booking>(this.apiUrl, bookingRequest);
  }

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user`);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  updateBooking(id: number, booking: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  // Manager/Admin status update endpoints
  updateStatus(id: number, status: 'PENDING'|'CONFIRMED'|'ACTIVE'|'COMPLETED'|'CANCELLED'): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}/status`, { status });
  }

  activate(id: number): Observable<Booking> { return this.http.put<Booking>(`${this.apiUrl}/${id}/activate`, {}); }
  complete(id: number): Observable<Booking> { return this.http.put<Booking>(`${this.apiUrl}/${id}/complete`, {}); }
  cancelAsManager(id: number): Observable<Booking> { return this.http.put<Booking>(`${this.apiUrl}/${id}/cancel`, {}); }

  cancelBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBranchBookings(branchId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/branch/${branchId}`);
  }
  
  checkAvailability(carId: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/availability/${carId}`, {
      params: { startDate, endDate }
    });
  }
}

