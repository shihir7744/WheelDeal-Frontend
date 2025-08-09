import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  profileForm: { fullName: string; email: string } = { fullName: '', email: '' };
  passwordForm: { currentPassword: string; newPassword: string; confirmPassword: string } = { currentPassword: '', newPassword: '', confirmPassword: '' };
  savingProfile = false;
  changingPassword = false;

  constructor(private auth: AuthService, private users: UserService) {}

  ngOnInit(): void {
    const current = this.auth.getCurrentUser();
    this.user = current;
    if (current) {
      this.profileForm.fullName = current.fullName || '';
      this.profileForm.email = current.email || '';
    }
  }

  saveProfile(): void {
    if (!this.user) return;
    if (!this.profileForm.fullName || !this.profileForm.email) {
      this.error = 'Full name and email are required';
      return;
    }
    this.savingProfile = true; this.error = null; this.success = null;
    this.users.updateUser(this.user.id, { fullName: this.profileForm.fullName, email: this.profileForm.email }).subscribe({
      next: (updated) => {
        this.success = 'Profile updated successfully';
        this.savingProfile = false;
      },
      error: (err) => { console.error(err); this.error = 'Failed to update profile'; this.savingProfile = false; }
    });
  }

  changePassword(): void {
    if (!this.user) return;
    if (!this.passwordForm.newPassword || this.passwordForm.newPassword.length < 6) {
      this.error = 'New password must be at least 6 characters';
      return;
    }
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.changingPassword = true; this.error = null; this.success = null;
    // Temporary client-only message since backend lacks a self-service password endpoint
    setTimeout(() => {
      this.success = 'Password change requested. Please contact support or admin to update password.';
      this.changingPassword = false;
      this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }, 600);
  }
}