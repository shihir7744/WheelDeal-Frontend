export interface EmailRequest {
  to: string;
  subject: string;
  templateName: string;
  templateData: { [key: string]: any };
}

export interface EmailResponse {
  message: string;
  error?: string;
}

export interface EmailPreferences {
  bookingConfirmations: boolean;
  bookingCancellations: boolean;
  bookingReminders: boolean;
  promotionalEmails: boolean;
  newsletter: boolean;
} 