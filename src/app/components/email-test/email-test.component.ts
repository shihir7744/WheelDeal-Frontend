import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { EmailRequest } from '../../models/email.model';

@Component({
  selector: 'app-email-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-test.component.html',
  styleUrls: ['./email-test.component.scss']
})
export class EmailTestComponent {
  testForm: FormGroup;
  isLoading = false;
  testResults: { [key: string]: { success: boolean; message: string } } = {};
  Object = Object; // Make Object available in template

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService
  ) {
    this.testForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  testBookingConfirmation(): void {
    this.runTest('bookingConfirmation', () => 
      this.emailService.testBookingConfirmation(this.testForm.value.email)
    );
  }

  testWelcomeEmail(): void {
    this.runTest('welcome', () => 
      this.emailService.testWelcomeEmail(this.testForm.value.email)
    );
  }

  testBookingCancellation(): void {
    this.runTest('bookingCancellation', () => 
      this.emailService.testBookingCancellation(this.testForm.value.email)
    );
  }

  testPasswordReset(): void {
    this.runTest('passwordReset', () => 
      this.emailService.testPasswordReset(this.testForm.value.email)
    );
  }

  testBookingReminder(): void {
    this.runTest('bookingReminder', () => 
      this.emailService.testBookingReminder(this.testForm.value.email)
    );
  }

  testAllEmails(): void {
    this.testBookingConfirmation();
    this.testWelcomeEmail();
    this.testBookingCancellation();
    this.testPasswordReset();
    this.testBookingReminder();
  }

  private runTest(testName: string, testFunction: () => any): void {
    if (!this.testForm.valid) {
      this.testResults[testName] = {
        success: false,
        message: 'Please enter a valid email address'
      };
      return;
    }

    this.isLoading = true;
    this.testResults[testName] = {
      success: false,
      message: 'Testing...'
    };

    testFunction().subscribe({
      next: (response: any) => {
        this.testResults[testName] = {
          success: true,
          message: response.message || 'Email sent successfully'
        };
        this.isLoading = false;
      },
      error: (error: any) => {
        this.testResults[testName] = {
          success: false,
          message: error.error?.error || 'Failed to send email'
        };
        this.isLoading = false;
      }
    });
  }

  getTestResult(testName: string): { success: boolean; message: string } | undefined {
    return this.testResults[testName];
  }

  clearResults(): void {
    this.testResults = {};
  }

  getTestName(testKey: string): string {
    const testNames: { [key: string]: string } = {
      'bookingConfirmation': 'Booking Confirmation',
      'welcome': 'Welcome Email',
      'bookingCancellation': 'Booking Cancellation',
      'passwordReset': 'Password Reset',
      'bookingReminder': 'Booking Reminder'
    };
    return testNames[testKey] || testKey;
  }
} 