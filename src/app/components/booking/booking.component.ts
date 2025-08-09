import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  selectedBooking: Booking | null = null;
  isLoading = false;
  isCancelling = false;
  error: string | null = null;
  currentFilter = 'all';

  statusFilters = [
    { value: 'all', label: 'All Bookings', icon: 'fas fa-list' },
    { value: 'PENDING', label: 'Pending', icon: 'fas fa-hourglass-half' },
    { value: 'CONFIRMED', label: 'Confirmed', icon: 'fas fa-check' },
    { value: 'ACTIVE', label: 'Active', icon: 'fas fa-play-circle' },
    { value: 'COMPLETED', label: 'Completed', icon: 'fas fa-check-circle' },
    { value: 'CANCELLED', label: 'Cancelled', icon: 'fas fa-times-circle' }
  ];

  bookingStats = [
    { icon: 'fas fa-calendar-check fa-2x text-primary', count: 0, label: 'Total Bookings' },
    { icon: 'fas fa-hourglass-half fa-2x text-warning', count: 0, label: 'Pending' },
    { icon: 'fas fa-check fa-2x text-info', count: 0, label: 'Confirmed' },
    { icon: 'fas fa-play-circle fa-2x text-success', count: 0, label: 'Active' },
    { icon: 'fas fa-check-circle fa-2x text-info', count: 0, label: 'Completed' },
    { icon: 'fas fa-times-circle fa-2x text-danger', count: 0, label: 'Cancelled' }
  ];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.error = 'Please log in to view your bookings';
      return;
    }
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.error = null;

    this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.updateStats();
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.error = 'Failed to load bookings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  updateStats(): void {
    const countBy = (s: string) => this.bookings.filter(b => b.status === s).length;
    this.bookingStats[0].count = this.bookings.length;
    this.bookingStats[1].count = countBy('PENDING');
    this.bookingStats[2].count = countBy('CONFIRMED');
    this.bookingStats[3].count = countBy('ACTIVE');
    this.bookingStats[4].count = countBy('COMPLETED');
    this.bookingStats[5].count = countBy('CANCELLED');
  }

  setFilter(filter: string): void { this.currentFilter = filter; this.applyFilter(); }

  applyFilter(): void {
    if (this.currentFilter === 'all') {
      this.filteredBookings = [...this.bookings];
    } else {
      this.filteredBookings = this.bookings.filter(booking => booking.status === this.currentFilter);
    }
  }

  getFilterCount(filter: string): number {
    if (filter === 'all') return this.bookings.length;
    return this.bookings.filter(booking => booking.status === filter).length;
  }

  viewBookingDetails(booking: Booking): void {
    this.selectedBooking = booking;
    const modal = document.getElementById('bookingDetailsModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  // Helper methods for template conditions
  isPending(b: Booking): boolean { return b.status === 'PENDING'; }
  isConfirmed(b: Booking): boolean { return b.status === 'CONFIRMED'; }

  cancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.isCancelling = true;
      this.bookingService.cancelBooking(booking.id).subscribe({
        next: () => {
          this.isCancelling = false;
          const index = this.bookings.findIndex(b => b.id === booking.id);
          if (index !== -1) {
            this.bookings[index].status = 'CANCELLED';
            this.updateStats();
            this.applyFilter();
          }
          const modal = document.getElementById('bookingDetailsModal');
          if (modal) {
            const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) bootstrapModal.hide();
          }
          alert('Booking cancelled successfully!');
        },
        error: (error) => {
          this.isCancelling = false;
          console.error('Error cancelling booking:', error);
          alert('Failed to cancel booking. Please try again.');
        }
      });
    }
  }

  canCancelBooking(booking: Booking): boolean {
    // Allow cancel before start for pending/confirmed/active
    const today = new Date();
    const startDate = new Date(booking.startDate);
    const beforeStart = startDate > today;
    return beforeStart && (booking.status === 'PENDING' || booking.status === 'CONFIRMED' || booking.status === 'ACTIVE');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'CONFIRMED': return 'bg-info';
      case 'PENDING': return 'bg-warning text-dark';
      case 'ACTIVE': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      case 'COMPLETED': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getCarImage(car: any): string { return this.imageService.getCarImageUrl(car); }

  getEmptyStateMessage(): string {
    if (!this.authService.isLoggedIn()) return 'Please log in to view your bookings';
    return 'You don\'t have any bookings yet. Start by exploring our car collection!';
  }
}

