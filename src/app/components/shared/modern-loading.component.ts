import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modern-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.overlay]="overlay" [class.fullscreen]="fullscreen">
      <div class="loading-content">
        <div class="loading-spinner" [class]="spinnerType">
          <div class="spinner-ring" *ngIf="spinnerType === 'ring'">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="spinner-dots" *ngIf="spinnerType === 'dots'">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="spinner-pulse" *ngIf="spinnerType === 'pulse'"></div>
          <div class="spinner-bars" *ngIf="spinnerType === 'bars'">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="loading-text" *ngIf="text">{{ text }}</div>
        <div class="loading-subtext" *ngIf="subtext">{{ subtext }}</div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-container.overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      z-index: 1000;
    }

    .loading-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      z-index: 9999;
    }

    .loading-content {
      text-align: center;
    }

    .loading-spinner {
      margin-bottom: 1rem;
    }

    .loading-text {
      font-family: 'Inter', sans-serif;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .loading-subtext {
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* Ring Spinner */
    .spinner-ring {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }

    .spinner-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 64px;
      height: 64px;
      margin: 8px;
      border: 8px solid #3b82f6;
      border-radius: 50%;
      animation: spinner-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #3b82f6 transparent transparent transparent;
    }

    .spinner-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }

    .spinner-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }

    .spinner-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }

    @keyframes spinner-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    /* Dots Spinner */
    .spinner-dots {
      display: inline-flex;
      gap: 8px;
    }

    .spinner-dots div {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #3b82f6;
      animation: spinner-dots 1.4s ease-in-out infinite both;
    }

    .spinner-dots div:nth-child(1) {
      animation-delay: -0.32s;
    }

    .spinner-dots div:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes spinner-dots {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    /* Pulse Spinner */
    .spinner-pulse {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      animation: spinner-pulse 1.2s ease-in-out infinite;
    }

    @keyframes spinner-pulse {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.5;
      }
      100% {
        transform: scale(0.8);
        opacity: 1;
      }
    }

    /* Bars Spinner */
    .spinner-bars {
      display: inline-flex;
      gap: 4px;
      align-items: flex-end;
      height: 40px;
    }

    .spinner-bars div {
      width: 6px;
      background: #3b82f6;
      border-radius: 3px;
      animation: spinner-bars 1.2s ease-in-out infinite;
    }

    .spinner-bars div:nth-child(1) {
      height: 20px;
      animation-delay: -0.4s;
    }

    .spinner-bars div:nth-child(2) {
      height: 30px;
      animation-delay: -0.3s;
    }

    .spinner-bars div:nth-child(3) {
      height: 40px;
      animation-delay: -0.2s;
    }

    .spinner-bars div:nth-child(4) {
      height: 30px;
      animation-delay: -0.1s;
    }

    .spinner-bars div:nth-child(5) {
      height: 20px;
      animation-delay: 0s;
    }

    @keyframes spinner-bars {
      0%, 40%, 100% {
        transform: scaleY(0.4);
      }
      20% {
        transform: scaleY(1);
      }
    }

    /* Sizes */
    .spinner-sm .spinner-ring {
      width: 40px;
      height: 40px;
    }

    .spinner-sm .spinner-ring div {
      width: 32px;
      height: 32px;
      margin: 4px;
      border-width: 4px;
    }

    .spinner-sm .spinner-dots div {
      width: 8px;
      height: 8px;
    }

    .spinner-sm .spinner-pulse {
      width: 30px;
      height: 30px;
    }

    .spinner-sm .spinner-bars {
      height: 20px;
    }

    .spinner-sm .spinner-bars div {
      width: 4px;
    }

    .spinner-lg .spinner-ring {
      width: 120px;
      height: 120px;
    }

    .spinner-lg .spinner-ring div {
      width: 96px;
      height: 96px;
      margin: 12px;
      border-width: 12px;
    }

    .spinner-lg .spinner-dots div {
      width: 16px;
      height: 16px;
    }

    .spinner-lg .spinner-pulse {
      width: 90px;
      height: 90px;
    }

    .spinner-lg .spinner-bars {
      height: 60px;
    }

    .spinner-lg .spinner-bars div {
      width: 8px;
    }

    /* Variants */
    .spinner-primary .spinner-ring div,
    .spinner-primary .spinner-dots div,
    .spinner-primary .spinner-pulse,
    .spinner-primary .spinner-bars div {
      background: #3b82f6;
      border-color: #3b82f6 transparent transparent transparent;
    }

    .spinner-success .spinner-ring div,
    .spinner-success .spinner-dots div,
    .spinner-success .spinner-pulse,
    .spinner-success .spinner-bars div {
      background: #22c55e;
      border-color: #22c55e transparent transparent transparent;
    }

    .spinner-warning .spinner-ring div,
    .spinner-warning .spinner-dots div,
    .spinner-warning .spinner-pulse,
    .spinner-warning .spinner-bars div {
      background: #f59e0b;
      border-color: #f59e0b transparent transparent transparent;
    }

    .spinner-danger .spinner-ring div,
    .spinner-danger .spinner-dots div,
    .spinner-danger .spinner-pulse,
    .spinner-danger .spinner-bars div {
      background: #ef4444;
      border-color: #ef4444 transparent transparent transparent;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .loading-text {
        font-size: 1rem;
      }

      .loading-subtext {
        font-size: 0.8rem;
      }
    }
  `]
})
export class ModernLoadingComponent {
  @Input() text: string = '';
  @Input() subtext: string = '';
  @Input() spinnerType: 'ring' | 'dots' | 'pulse' | 'bars' = 'ring';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() overlay: boolean = false;
  @Input() fullscreen: boolean = false;
} 