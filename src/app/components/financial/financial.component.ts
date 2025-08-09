import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FinancialService } from '../../services/financial.service';
import { CarService } from '../../services/car.service';
import { 
  FinancialTransaction, 
  FinancialReport, 
  FinancialFilter, 
  TransactionType, 
  TransactionStatus,
  TransactionTypeOption,
  TransactionStatusOption 
} from '../../models/financial.model';
import { Car } from '../../models/car.model';


@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
  
  // Data properties
  transactions: FinancialTransaction[] = [];
  currentReport: FinancialReport | null = null;
  cars: Car[] = [];
  branches: any[] = [];
  
  // UI state
  isLoading = false;
  error: string | null = null;
  showAddTransactionForm = false;
  showFilters = false;
  currentView: 'transactions' | 'reports' = 'transactions';
  
  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  
  // Forms
  transactionForm: FormGroup;
  filterForm: FormGroup;
  
  // Options
  transactionTypes: TransactionTypeOption[] = [];
  transactionStatuses: TransactionStatusOption[] = [];
  
  // Date ranges for quick reports
  dateRanges = [
    { label: 'Last 30 Days', value: 'last30' },
    { label: 'Current Month', value: 'currentMonth' },
    { label: 'Current Year', value: 'currentYear' },
    { label: 'Custom Range', value: 'custom' }
  ];
  selectedDateRange = 'last30';

  constructor(
    private financialService: FinancialService,
    private carService: CarService,
    private fb: FormBuilder
  ) {
    this.transactionForm = this.fb.group({
      transactionType: ['', []],
      amount: ['', []],
      currency: ['USD', []],
      description: ['', []],
      referenceNumber: ['', []],
      paymentMethod: ['', []],
      status: [TransactionStatus.COMPLETED, []],
      carId: ['', []],
      userId: ['', []],
      branchId: ['', []],
      transactionDate: ['', []]
    });

    this.filterForm = this.fb.group({
      transactionType: ['', []],
      status: ['', []],
      carId: ['', []],
      branchId: ['', []],
      startDate: ['', []],
      endDate: ['', []]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadTransactions();
    this.loadCurrentReport();
  }

  loadInitialData(): void {
    this.transactionTypes = this.financialService.getTransactionTypeOptions();
    this.transactionStatuses = this.financialService.getTransactionStatusOptions();
    
    this.carService.getAllCars().subscribe({
      next: (cars) => this.cars = cars,
      error: (error) => console.error('Error loading cars:', error)
    });
    
    // TODO: Load branches when BranchService is available
    this.branches = [];
  }

  loadTransactions(): void {
    this.isLoading = true;
    const filter: FinancialFilter = {
      page: this.currentPage,
      size: this.pageSize,
      ...this.filterForm.value
    };

    this.financialService.searchTransactions(filter).subscribe({
      next: (response) => {
        this.transactions = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load transactions';
        this.isLoading = false;
        console.error('Error loading transactions:', error);
      }
    });
  }

  loadCurrentReport(): void {
    switch (this.selectedDateRange) {
      case 'last30':
        this.financialService.getLast30DaysReport().subscribe({
          next: (report) => this.currentReport = report,
          error: (error) => console.error('Error loading report:', error)
        });
        break;
      case 'currentMonth':
        this.financialService.getCurrentMonthReport().subscribe({
          next: (report) => this.currentReport = report,
          error: (error) => console.error('Error loading report:', error)
        });
        break;
      case 'currentYear':
        this.financialService.getCurrentYearReport().subscribe({
          next: (report) => this.currentReport = report,
          error: (error) => console.error('Error loading report:', error)
        });
        break;
      case 'custom':
        // Handle custom date range
        break;
    }
  }

  onDateRangeChange(): void {
    this.loadCurrentReport();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  onFilterSubmit(): void {
    this.currentPage = 0;
    this.loadTransactions();
  }

  onFilterReset(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadTransactions();
  }

  showAddTransaction(): void {
    this.showAddTransactionForm = true;
    this.transactionForm.reset();
    this.transactionForm.patchValue({
      status: TransactionStatus.COMPLETED,
      currency: 'USD',
      transactionDate: new Date().toISOString().split('T')[0]
    });
  }

  hideAddTransaction(): void {
    this.showAddTransactionForm = false;
    this.transactionForm.reset();
  }

  onSubmitTransaction(): void {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      const formData = this.transactionForm.value;
      
      this.financialService.createTransaction(formData).subscribe({
        next: (transaction) => {
          this.transactions.unshift(transaction);
          this.hideAddTransaction();
          this.isLoading = false;
          this.loadCurrentReport(); // Refresh report
        },
        error: (error) => {
          this.error = 'Failed to create transaction';
          this.isLoading = false;
          console.error('Error creating transaction:', error);
        }
      });
    }
  }

  switchView(view: 'transactions' | 'reports'): void {
    this.currentView = view;
  }

  // Utility methods
  getTransactionTypeLabel(type: string): string {
    return this.financialService.getTransactionTypeLabel(type);
  }

  getTransactionStatusLabel(status: string): string {
    return this.financialService.getTransactionStatusLabel(status);
  }

  getStatusColor(status: string): string {
    return this.financialService.getStatusColor(status);
  }

  getTransactionTypeIcon(type: string): string {
    return this.financialService.getTransactionTypeIcon(type);
  }

  formatCurrency(amount: number): string {
    return this.financialService.formatCurrency(amount);
  }

  formatDate(dateString: string): string {
    return this.financialService.formatDate(dateString);
  }

  formatDateTime(dateString: string): string {
    return this.financialService.formatDateTime(dateString);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
} 