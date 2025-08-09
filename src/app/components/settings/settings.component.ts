import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact';
  notifications: { email: boolean; sms: boolean; marketing: boolean };
  privacy: { rememberMe: boolean; analytics: boolean };
}

const SETTINGS_KEY = 'appSettings';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeTab: 'account' | 'appearance' | 'notifications' | 'privacy' = 'account';
  settings: AppSettings = {
    theme: 'system',
    density: 'comfortable',
    notifications: { email: true, sms: false, marketing: false },
    privacy: { rememberMe: true, analytics: true }
  };
  saving = false;
  savedAt: Date | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSettings();
    this.applyTheme(this.settings.theme);
    this.applyDensity(this.settings.density);
  }

  switchTab(tab: typeof this.activeTab): void { this.activeTab = tab; }

  loadSettings(): void {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try { this.settings = JSON.parse(raw); } catch { /* ignore */ }
    }
  }

  save(): void {
    this.saving = true;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    this.applyTheme(this.settings.theme);
    this.applyDensity(this.settings.density);
    setTimeout(() => { this.saving = false; this.savedAt = new Date(); }, 300);
  }

  applyTheme(theme: 'light' | 'dark' | 'system'): void {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = theme === 'dark' || (theme === 'system' && prefersDark);
    root.setAttribute('data-theme', useDark ? 'dark' : 'light');
  }

  applyDensity(density: 'comfortable' | 'compact'): void {
    document.documentElement.setAttribute('data-density', density);
  }

  goToProfile(): void { this.router.navigate(['/profile']); }
}