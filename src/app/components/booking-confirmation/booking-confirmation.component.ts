import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingConfirmationService } from '../../services/booking-confirmation.service';
import { BookingDto, BookingConfirmationRequest, BookingStatus } from '../../models/booking-confirmation.model';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  pendingBookings: BookingDto[] = [];
  isLoading = false;
  error: string | null = null;
  selectedBooking: BookingDto | null = null;
  confirmationForm: FormGroup;
  showConfirmationModal = false;
  showRejectionModal = false;
  actionInProgress = false;

  constructor(
    private bookingConfirmationService: BookingConfirmationService,
    private fb: FormBuilder
  ) {
    this.confirmationForm = this.fb.group({
      adminNotes: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadPendingBookings();
  }

  loadPendingBookings(): void {
    this.isLoading = true;
    this.error = null;

    this.bookingConfirmationService.getPendingBookings().subscribe({
      next: (bookings) => {
        this.pendingBookings = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pending bookings:', error);
        this.error = 'Failed to load pending bookings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  openConfirmationModal(booking: BookingDto): void {
    this.selectedBooking = booking;
    this.confirmationForm.reset();
    this.showConfirmationModal = true;
  }

  openRejectionModal(booking: BookingDto): void {
    this.selectedBooking = booking;
    this.confirmationForm.reset();
    this.showRejectionModal = true;
  }

  closeModals(): void {
    this.showConfirmationModal = false;
    this.showRejectionModal = false;
    this.selectedBooking = null;
    this.confirmationForm.reset();
  }

  confirmBooking(): void {
    if (!this.selectedBooking || !this.confirmationForm.valid) {
      return;
    }

    this.actionInProgress = true;
    const request: BookingConfirmationRequest = {
      bookingId: this.selectedBooking.id,
      status: 'CONFIRMED',
      adminNotes: this.confirmationForm.value.adminNotes
    };

    this.bookingConfirmationService.confirmBooking(request).subscribe({
      next: (updatedBooking) => {
        // Remove the booking from pending list
        this.pendingBookings = this.pendingBookings.filter(
          booking => booking.id !== this.selectedBooking!.id
        );
        this.closeModals();
        this.actionInProgress = false;
        // You could show a success message here
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
        this.error = 'Failed to confirm booking. Please try again.';
        this.actionInProgress = false;
      }
    });
  }

  rejectBooking(): void {
    if (!this.selectedBooking || !this.confirmationForm.valid) {
      return;
    }

    this.actionInProgress = true;
    const request: BookingConfirmationRequest = {
      bookingId: this.selectedBooking.id,
      status: 'REJECTED',
      adminNotes: this.confirmationForm.value.adminNotes
    };

    this.bookingConfirmationService.rejectBooking(request).subscribe({
      next: (updatedBooking) => {
        // Remove the booking from pending list
        this.pendingBookings = this.pendingBookings.filter(
          booking => booking.id !== this.selectedBooking!.id
        );
        this.closeModals();
        this.actionInProgress = false;
        // You could show a success message here
      },
      error: (error) => {
        console.error('Error rejecting booking:', error);
        this.error = 'Failed to reject booking. Please try again.';
        this.actionInProgress = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    return this.bookingConfirmationService.getStatusBadgeClass(status);
  }

  getStatusDisplayText(status: string): string {
    return this.bookingConfirmationService.getStatusDisplayText(status);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateTotalAmount(booking: BookingDto): string {
    // This would need to be calculated based on your pricing logic
    // For now, we'll return a placeholder
    return '$150.00'; // This should be calculated from car price and duration
  }

  getRentalDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  }
} 