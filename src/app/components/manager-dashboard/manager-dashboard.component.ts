import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard.model';
import { BookingConfirmationService } from '../../services/booking-confirmation.service';
import { BookingDto } from '../../models/booking-confirmation.model';
import { FinancialService } from '../../services/financial.service';
import { FinancialReport, FinancialTransaction } from '../../models/financial.model';
import { BranchService } from '../../services/branch.service';
import { Branch } from '../../models/branch.model';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  // Navigation
  activeTab: 'overview' | 'bookings' | 'financial' | 'branch' = 'overview';
  canScrollLeft = false;
  canScrollRight = false;

  dashboardStats: DashboardStats | null = null;
  isLoading = true;
  error: string | null = null;
  branchId: number | null = null;

  // Branch Management
  branch: Branch | null = null;
  branchLoading = false;
  branchError: string | null = null;
  branchEditing = false;
  branchForm: Partial<Branch> = {};
  savingBranch = false;

  pendingBookings: BookingDto[] = [];
  bookingsLoading = false;
  bookingError: string | null = null;

  confirmedBookings: Booking[] = [];
  confirmedLoading = false;
  confirmedError: string | null = null;

  // Bookings filters/pagination
  bookingStatusFilter: ('ALL'|'PENDING'|'CONFIRMED'|'ACTIVE'|'COMPLETED'|'CANCELLED') = 'ALL';
  bookingSearch = '';
  bookingsPage = 1;
  bookingsPageSize = 10;

  financialReport: FinancialReport | null = null;
  reportLoading = false;
  financialError: string | null = null;

  transactions: FinancialTransaction[] = [] as any;
  txLoading = false;
  transactionsError: string | null = null;

  // Quick fleet pane
  branchCars: any[] = [];
  fleetLoading = false;
  fleetError: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private bookingConfirmationService: BookingConfirmationService,
    private financialService: FinancialService,
    private branchService: BranchService,
    private bookingService: BookingService,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.branchId = +params['branchId'];
      if (this.branchId) {
        this.loadDashboardStats();
        this.loadPendingBookings();
        this.loadConfirmedBookings();
        this.loadFinancialSummary();
        this.loadRecentTransactions();
        this.loadBranch();
        this.loadBranchFleet();
        setTimeout(() => {
          this.checkScrollPosition();
          this.setupScrollListener();
        }, 100);
      } else {
        this.error = 'Branch ID is required';
        this.isLoading = false;
      }
    });
  }

  // Tabs
  switchTab(tab: 'overview' | 'bookings' | 'financial' | 'branch'): void {
    this.activeTab = tab;
    setTimeout(() => this.checkScrollPosition(), 50);
  }

  checkScrollPosition(): void {
    const navTabs = document.querySelector('.nav-tabs-container') as HTMLElement;
    if (navTabs) {
      this.canScrollLeft = navTabs.scrollLeft > 0;
      this.canScrollRight = navTabs.scrollLeft < (navTabs.scrollWidth - navTabs.clientWidth);
    }
  }

  scrollLeft(): void {
    const navTabs = document.querySelector('.nav-tabs-container') as HTMLElement;
    if (navTabs) {
      navTabs.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(() => this.checkScrollPosition(), 300);
    }
  }

  scrollRight(): void {
    const navTabs = document.querySelector('.nav-tabs-container') as HTMLElement;
    if (navTabs) {
      navTabs.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(() => this.checkScrollPosition(), 300);
    }
  }

  setupScrollListener(): void {
    const navTabs = document.querySelector('.nav-tabs-container') as HTMLElement;
    if (navTabs) {
      navTabs.addEventListener('scroll', () => this.checkScrollPosition());
    }
    window.addEventListener('resize', () => setTimeout(() => this.checkScrollPosition(), 100));
  }

  loadDashboardStats(): void {
    if (!this.branchId) return;
    this.isLoading = true; this.error = null;
    this.dashboardService.getManagerDashboard(this.branchId).subscribe({
      next: (stats) => { this.dashboardStats = stats; this.isLoading = false; },
      error: (error) => { console.error('Error loading manager dashboard stats:', error); this.error = 'Failed to load dashboard statistics'; this.isLoading = false; }
    });
  }

  // Branch Management
  loadBranch(): void {
    if (!this.branchId) return;
    this.branchLoading = true; this.branchError = null;
    this.branchService.getBranchById(this.branchId).subscribe({
      next: (b) => { this.branch = b; this.branchLoading = false; },
      error: (err) => { console.error(err); this.branchError = 'Failed to load branch details'; this.branchLoading = false; }
    });
  }

  openBranchEdit(): void {
    if (!this.branch) return;
    this.branchForm = { name: this.branch.name, city: this.branch.city, address: this.branch.address };
    this.branchEditing = true;
  }

  cancelBranchEdit(): void {
    this.branchEditing = false;
    this.branchForm = {};
  }

  saveBranch(): void {
    if (!this.branch || !this.branchId) return;
    const { name, city, address } = this.branchForm;
    if (!name || !city || !address) {
      alert('Please fill in Name, City, and Address');
      return;
    }
    this.savingBranch = true; this.branchError = null;
    this.branchService.updateBranch(this.branchId, { name, city, address }).subscribe({
      next: (updated) => {
        this.branch = updated;
        this.branchEditing = false;
        this.savingBranch = false;
      },
      error: (err) => { console.error(err); this.branchError = 'Failed to save branch changes'; this.savingBranch = false; }
    });
  }

  loadPendingBookings(): void {
    if (!this.branchId) return;
    this.bookingsLoading = true; this.bookingError = null;
    this.bookingConfirmationService.getPendingBookingsByBranch(this.branchId).subscribe({
      next: (list) => { this.pendingBookings = list; this.bookingsLoading = false; },
      error: (err) => { console.error(err); this.bookingError = 'Failed to load pending bookings'; this.bookingsLoading = false; }
    });
  }

  loadConfirmedBookings(): void {
    if (!this.branchId) return;
    this.confirmedLoading = true; this.confirmedError = null;
    this.bookingService.getBranchBookings(this.branchId).subscribe({
      next: (list) => {
        let items = (list || []).filter(b => ['CONFIRMED','ACTIVE','COMPLETED','CANCELLED'].includes(b.status));
        if (this.bookingStatusFilter !== 'ALL') {
          items = items.filter(b => b.status === this.bookingStatusFilter);
        }
        if (this.bookingSearch) {
          const q = this.bookingSearch.toLowerCase();
          items = items.filter(b =>
            (b.userFullName && b.userFullName.toLowerCase().includes(q)) ||
            (b.carBrand && b.carBrand.toLowerCase().includes(q)) ||
            (b.carModel && b.carModel.toLowerCase().includes(q)) ||
            (''+b.id).includes(q)
          );
        }
        // simple client-side pagination
        const start = (this.bookingsPage - 1) * this.bookingsPageSize;
        const end = start + this.bookingsPageSize;
        this.confirmedBookings = items.slice(start, end);
        this.confirmedLoading = false;
      },
      error: (err) => { console.error(err); this.confirmedError = 'Failed to load confirmed bookings'; this.confirmedLoading = false; }
    });
  }

  onFilterChange(): void { this.bookingsPage = 1; this.loadConfirmedBookings(); }
  changeBookingsPage(page: number): void { this.bookingsPage = page; this.loadConfirmedBookings(); }

  confirm(b: BookingDto): void {
    const req = { bookingId: b.id, status: 'CONFIRMED', adminNotes: 'Approved by manager' } as any;
    this.bookingConfirmationService.confirmBooking(req).subscribe({
      next: () => { this.loadPendingBookings(); this.loadDashboardStats(); this.loadConfirmedBookings(); },
      error: () => { this.bookingError = 'Failed to confirm booking'; }
    });
  }

  reject(b: BookingDto): void {
    const reason = prompt('Add a note for rejection (optional):') || '';
    const req = { bookingId: b.id, status: 'REJECTED', adminNotes: reason } as any;
    this.bookingConfirmationService.rejectBooking(req).subscribe({
      next: () => { this.loadPendingBookings(); this.loadDashboardStats(); },
      error: () => { this.bookingError = 'Failed to reject booking'; }
    });
  }

  loadFinancialSummary(): void {
    this.reportLoading = true; this.financialError = null;
    this.financialService.getCurrentMonthReport().subscribe({
      next: (report) => { this.financialReport = report; this.reportLoading = false; },
      error: (err) => { console.error(err); this.financialError = 'Failed to load financial summary'; this.reportLoading = false; }
    });
  }

  loadRecentTransactions(): void {
    if (!this.branchId) return;
    this.txLoading = true; this.transactionsError = null;
    this.financialService.searchTransactions({ branchId: this.branchId, page: 0, size: 10 }).subscribe({
      next: (page) => { this.transactions = page.content || []; this.txLoading = false; },
      error: (err) => { console.error(err); this.transactionsError = 'Failed to load transactions'; this.txLoading = false; }
    });
  }

  // Quick fleet
  loadBranchFleet(): void {
    if (!this.branchId) return;
    this.fleetLoading = true; this.fleetError = null;
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.branchCars = (cars || []).filter(c => c.branchId === this.branchId);
        this.fleetLoading = false;
      },
      error: (e) => { console.error(e); this.fleetError = 'Failed to load branch fleet'; this.fleetLoading = false; }
    });
  }

  toggleAvailability(car: any): void {
    const availability = !car.availability;
    this.carService.updateCar(car.id, { availability }).subscribe({
      next: (updated) => { car.availability = updated.availability; },
      error: (e) => { console.error(e); alert('Failed to update availability'); }
    });
  }

  // Manager booking status actions
  private updateBookingStatus(bookingId: number, status: 'ACTIVE'|'COMPLETED'|'CANCELLED'): void {
    this.bookingService.updateStatus(bookingId, status).subscribe({
      next: () => { this.loadConfirmedBookings(); this.loadDashboardStats(); },
      error: (err) => { console.error(err); alert('Failed to update booking status'); }
    });
  }

  setActive(b: Booking): void { this.bookingService.activate(b.id).subscribe({ next: ()=>{ this.loadConfirmedBookings(); this.loadDashboardStats(); }, error: (e)=>{ console.error(e); alert('Failed to activate'); } }); }
  setCompleted(b: Booking): void { this.bookingService.complete(b.id).subscribe({ next: ()=>{ this.loadConfirmedBookings(); this.loadDashboardStats(); }, error: (e)=>{ console.error(e); alert('Failed to complete'); } }); }
  setCancelled(b: Booking): void { this.bookingService.cancelAsManager(b.id).subscribe({ next: ()=>{ this.loadConfirmedBookings(); this.loadDashboardStats(); }, error: (e)=>{ console.error(e); alert('Failed to cancel'); } }); }

  // Formatting helpers
  formatCurrency(amount: number): string { return this.financialService.formatCurrency(amount); }
  formatDateTime(date: string): string { return this.financialService.formatDateTime(date); }
  getStatusColor(status: string): string { return this.financialService.getStatusColor(status); }
  getTransactionTypeLabel(type: string): string { return this.financialService.getTransactionTypeLabel(type); }
  getTransactionStatusLabel(status: string): string { return this.financialService.getTransactionStatusLabel(status); }
  getTransactionTypeIcon(type: string): string { return this.financialService.getTransactionTypeIcon(type); }

  getBookingBadgeClass(status: string): string {
    const map: any = {
      PENDING: 'bg-warning',
      CONFIRMED: 'bg-info',
      ACTIVE: 'bg-success',
      COMPLETED: 'bg-primary',
      CANCELLED: 'bg-danger',
      REJECTED: 'bg-secondary'
    };
    return map[status] || 'bg-secondary';
  }

  formatPercentage(value: number): string { return `${value.toFixed(1)}%`; }

  getUtilizationColor(rate: number): string {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-danger';
  }

  getAvailabilityColor(available: number, total: number): string {
    const percentage = total > 0 ? (available / total) * 100 : 0;
    if (percentage >= 50) return 'text-success';
    if (percentage >= 25) return 'text-warning';
    return 'text-danger';
  }
} 