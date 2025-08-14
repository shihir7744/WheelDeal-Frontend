import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailRequest, EmailResponse, EmailTemplate } from '../models/email.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiUrl + '/email';

  constructor(private http: HttpClient) {}

  /**
   * Send a custom templated email
   */
  sendEmail(emailRequest: EmailRequest): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/send`, emailRequest);
  }

  /**
   * Test booking confirmation email
   */
  testBookingConfirmation(to: string): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/test/booking-confirmation?to=${to}`, {});
  }

  /**
   * Test welcome email
   */
  testWelcomeEmail(to: string): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/test/welcome?to=${to}`, {});
  }

  /**
   * Test booking cancellation email
   */
  testBookingCancellation(to: string): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/test/booking-cancellation?to=${to}`, {});
  }

  /**
   * Test password reset email
   */
  testPasswordReset(to: string): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/test/password-reset?to=${to}`, {});
  }

  /**
   * Test booking reminder email
   */
  testBookingReminder(to: string): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/test/booking-reminder?to=${to}`, {});
  }
} 