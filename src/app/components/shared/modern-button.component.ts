import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modern-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
      [type]="type"
    >
      <div class="button-content" [class.loading]="loading">
        <i *ngIf="icon && !loading" [class]="icon" class="button-icon"></i>
        <div *ngIf="loading" class="spinner"></div>
        <span class="button-text">
          {{ loading ? loadingText : text }}
        </span>
      </div>
      <div class="button-ripple" *ngIf="showRipple"></div>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    button {
      position: relative;
      overflow: hidden;
      border: none;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
      letter-spacing: 0.025em;
      font-size: 14px;
      line-height: 1;
    }

    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    button:hover::before {
      left: 100%;
    }

    button:active {
      transform: scale(0.98);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .button-content {
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
      z-index: 1;
    }

    .button-icon {
      font-size: 16px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Primary Button */
    .btn-primary {
      background: linear-gradient(135deg, #bfdaa4, #8fb370);
      color: white;
      padding: 12px 24px;
      box-shadow: 0 4px 15px rgba(191, 218, 164, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(191, 218, 164, 0.4);
    }

    /* Secondary Button */
    .btn-secondary {
      background: linear-gradient(135deg, #64748b, #475569);
      color: white;
      padding: 12px 24px;
      box-shadow: 0 4px 15px rgba(100, 116, 139, 0.3);
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(100, 116, 139, 0.4);
    }

    /* Success Button */
    .btn-success {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      padding: 12px 24px;
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    }

    .btn-success:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
    }

    /* Danger Button */
    .btn-danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 12px 24px;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }

    /* Outline Button */
    .btn-outline {
      background: transparent;
      border: 2px solid #bfdaa4;
      color: #bfdaa4;
      padding: 10px 22px;
    }

    .btn-outline:hover {
      background: #bfdaa4;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(191, 218, 164, 0.3);
    }

    /* Large Button */
    .btn-lg {
      padding: 16px 32px;
      font-size: 16px;
      border-radius: 16px;
    }

    .btn-lg .button-icon {
      font-size: 18px;
    }

    .btn-lg .spinner {
      width: 18px;
      height: 18px;
    }

    /* Small Button */
    .btn-sm {
      padding: 8px 16px;
      font-size: 12px;
      border-radius: 8px;
    }

    .btn-sm .button-icon {
      font-size: 14px;
    }

    .btn-sm .spinner {
      width: 14px;
      height: 14px;
    }

    /* Ripple Effect */
    .button-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `]
})
export class ModernButtonComponent {
  @Input() text: string = '';
  @Input() loadingText: string = 'Loading...';
  @Input() icon: string = '';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() showRipple: boolean = true;

  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const classes = ['btn', `btn-${this.variant}`];
    
    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }
    
    if (this.loading) {
      classes.push('loading');
    }
    
    return classes.join(' ');
  }
} 