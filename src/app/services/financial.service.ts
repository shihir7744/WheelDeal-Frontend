import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  FinancialTransaction, 
  FinancialReport, 
  FinancialFilter, 
  TransactionType, 
  TransactionStatus,
  TransactionTypeOption,
  TransactionStatusOption 
} from '../models/financial.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private apiUrl = environment.apiUrl + '/financial';

  constructor(private http: HttpClient) {}

  // Transaction operations
  createTransaction(transaction: Partial<FinancialTransaction>): Observable<FinancialTransaction> {
    return this.http.post<FinancialTransaction>(`${this.apiUrl}/transactions`, transaction);
  }

  getTransactionById(id: number): Observable<FinancialTransaction> {
    return this.http.get<FinancialTransaction>(`${this.apiUrl}/transactions/${id}`);
  }

  searchTransactions(filter: FinancialFilter): Observable<any> {
    let params = new HttpParams();
    
    if (filter.transactionType) {
      params = params.set('transactionType', filter.transactionType);
    }
    if (filter.status) {
      params = params.set('status', filter.status);
    }
    if (filter.carId) {
      params = params.set('carId', filter.carId.toString());
    }
    if (filter.userId) {
      params = params.set('userId', filter.userId.toString());
    }
    if (filter.branchId) {
      params = params.set('branchId', filter.branchId.toString());
    }
    if (filter.startDate) {
      params = params.set('startDate', filter.startDate);
    }
    if (filter.endDate) {
      params = params.set('endDate', filter.endDate);
    }
    if (filter.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.size) {
      params = params.set('size', filter.size.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/transactions`, { params });
  }

  getTransactionsByDateRange(startDate: string, endDate: string): Observable<FinancialTransaction[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<FinancialTransaction[]>(`${this.apiUrl}/transactions/date-range`, { params });
  }

  // Report operations
  generateFinancialReport(startDate: string, endDate: string): Observable<FinancialReport> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<FinancialReport>(`${this.apiUrl}/reports`, { params });
  }

  getCurrentMonthReport(): Observable<FinancialReport> {
    return this.http.get<FinancialReport>(`${this.apiUrl}/reports/current-month`);
  }

  getCurrentYearReport(): Observable<FinancialReport> {
    return this.http.get<FinancialReport>(`${this.apiUrl}/reports/current-year`);
  }

  getLast30DaysReport(): Observable<FinancialReport> {
    return this.http.get<FinancialReport>(`${this.apiUrl}/reports/last-30-days`);
  }

  // Utility methods
  getTransactionTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'RENTAL_INCOME': 'Rental Income',
      'DEPOSIT': 'Deposit',
      'LATE_FEE': 'Late Fee',
      'DAMAGE_FEE': 'Damage Fee',
      'FUEL_FEE': 'Fuel Fee',
      'INSURANCE_FEE': 'Insurance Fee',
      'ADDITIONAL_DRIVER_FEE': 'Additional Driver Fee',
      'MAINTENANCE_COST': 'Maintenance Cost',
      'REPAIR_COST': 'Repair Cost',
      'REFUND': 'Refund',
      'CANCELLATION_FEE': 'Cancellation Fee',
      'ADMINISTRATIVE_FEE': 'Administrative Fee',
      'TAX': 'Tax',
      'DISCOUNT': 'Discount',
      'OTHER_INCOME': 'Other Income',
      'OTHER_EXPENSE': 'Other Expense'
    };
    return labels[type] || type;
  }

  getTransactionStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'Pending',
      'COMPLETED': 'Completed',
      'FAILED': 'Failed',
      'CANCELLED': 'Cancelled',
      'REFUNDED': 'Refunded',
      'PARTIALLY_REFUNDED': 'Partially Refunded',
      'DISPUTED': 'Disputed',
      'PROCESSING': 'Processing'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'warning',
      'COMPLETED': 'success',
      'FAILED': 'danger',
      'CANCELLED': 'secondary',
      'REFUNDED': 'info',
      'PARTIALLY_REFUNDED': 'primary',
      'DISPUTED': 'warning',
      'PROCESSING': 'info'
    };
    return colors[status] || 'secondary';
  }

  getTransactionTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'RENTAL_INCOME': 'fas fa-car',
      'DEPOSIT': 'fas fa-credit-card',
      'LATE_FEE': 'fas fa-clock',
      'DAMAGE_FEE': 'fas fa-tools',
      'FUEL_FEE': 'fas fa-gas-pump',
      'INSURANCE_FEE': 'fas fa-shield-alt',
      'ADDITIONAL_DRIVER_FEE': 'fas fa-user-plus',
      'MAINTENANCE_COST': 'fas fa-wrench',
      'REPAIR_COST': 'fas fa-hammer',
      'REFUND': 'fas fa-undo',
      'CANCELLATION_FEE': 'fas fa-times-circle',
      'ADMINISTRATIVE_FEE': 'fas fa-file-invoice',
      'TAX': 'fas fa-percentage',
      'DISCOUNT': 'fas fa-tag',
      'OTHER_INCOME': 'fas fa-plus-circle',
      'OTHER_EXPENSE': 'fas fa-minus-circle'
    };
    return icons[type] || 'fas fa-money-bill';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTransactionTypeOptions(): TransactionTypeOption[] {
    return [
      { value: TransactionType.RENTAL_INCOME, label: 'Rental Income', icon: 'fas fa-car', color: 'success' },
      { value: TransactionType.DEPOSIT, label: 'Deposit', icon: 'fas fa-credit-card', color: 'primary' },
      { value: TransactionType.LATE_FEE, label: 'Late Fee', icon: 'fas fa-clock', color: 'warning' },
      { value: TransactionType.DAMAGE_FEE, label: 'Damage Fee', icon: 'fas fa-tools', color: 'danger' },
      { value: TransactionType.FUEL_FEE, label: 'Fuel Fee', icon: 'fas fa-gas-pump', color: 'info' },
      { value: TransactionType.INSURANCE_FEE, label: 'Insurance Fee', icon: 'fas fa-shield-alt', color: 'primary' },
      { value: TransactionType.ADDITIONAL_DRIVER_FEE, label: 'Additional Driver Fee', icon: 'fas fa-user-plus', color: 'info' },
      { value: TransactionType.MAINTENANCE_COST, label: 'Maintenance Cost', icon: 'fas fa-wrench', color: 'warning' },
      { value: TransactionType.REPAIR_COST, label: 'Repair Cost', icon: 'fas fa-hammer', color: 'danger' },
      { value: TransactionType.REFUND, label: 'Refund', icon: 'fas fa-undo', color: 'success' },
      { value: TransactionType.CANCELLATION_FEE, label: 'Cancellation Fee', icon: 'fas fa-times-circle', color: 'secondary' },
      { value: TransactionType.ADMINISTRATIVE_FEE, label: 'Administrative Fee', icon: 'fas fa-file-invoice', color: 'info' },
      { value: TransactionType.TAX, label: 'Tax', icon: 'fas fa-percentage', color: 'secondary' },
      { value: TransactionType.DISCOUNT, label: 'Discount', icon: 'fas fa-tag', color: 'success' },
      { value: TransactionType.OTHER_INCOME, label: 'Other Income', icon: 'fas fa-plus-circle', color: 'success' },
      { value: TransactionType.OTHER_EXPENSE, label: 'Other Expense', icon: 'fas fa-minus-circle', color: 'danger' }
    ];
  }

  getTransactionStatusOptions(): TransactionStatusOption[] {
    return [
      { value: TransactionStatus.PENDING, label: 'Pending', color: 'warning' },
      { value: TransactionStatus.COMPLETED, label: 'Completed', color: 'success' },
      { value: TransactionStatus.FAILED, label: 'Failed', color: 'danger' },
      { value: TransactionStatus.CANCELLED, label: 'Cancelled', color: 'secondary' },
      { value: TransactionStatus.REFUNDED, label: 'Refunded', color: 'info' },
      { value: TransactionStatus.PARTIALLY_REFUNDED, label: 'Partially Refunded', color: 'primary' },
      { value: TransactionStatus.DISPUTED, label: 'Disputed', color: 'warning' },
      { value: TransactionStatus.PROCESSING, label: 'Processing', color: 'info' }
    ];
  }
} 