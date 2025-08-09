import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modern-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="cardClasses"
      [class.hoverable]="hoverable"
      [class.elevated]="elevated"
    >
      <div class="card-header" *ngIf="header || showHeader">
        <div class="card-title" *ngIf="title">{{ title }}</div>
        <div class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</div>
        <div class="card-actions" *ngIf="actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </div>
      
      <div class="card-image" *ngIf="image">
        <img [src]="image" [alt]="imageAlt || title" />
        <div class="card-image-overlay" *ngIf="imageOverlay">
          {{ imageOverlay }}
        </div>
      </div>
      
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      
      <div class="card-footer" *ngIf="footer || showFooter">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .modern-card {
      background: #f5f5f5;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .modern-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #bfdaa4, #8fb370);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .modern-card.hoverable:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border-color: rgba(0, 0, 0, 0.2);
    }

    .modern-card.hoverable:hover::before {
      transform: scaleX(1);
    }

    .modern-card.elevated {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .modern-card.elevated:hover {
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    }

    /* Card Header */
    .card-header {
      padding: 24px 24px 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .card-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #000000;
      margin: 0;
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: #000000;
      margin-top: 4px;
    }

    .card-actions {
      display: flex;
      gap: 8px;
    }

    /* Card Image */
    .card-image {
      position: relative;
      overflow: hidden;
    }

    .card-image img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .modern-card:hover .card-image img {
      transform: scale(1.05);
    }

    .card-image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.125rem;
    }

    /* Card Body */
    .card-body {
      padding: 24px;
    }

    /* Card Footer */
    .card-footer {
      padding: 16px 24px 24px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Variants */
    .card-primary {
      border-top: 4px solid #3b82f6;
    }

    .card-success {
      border-top: 4px solid #22c55e;
    }

    .card-warning {
      border-top: 4px solid #f59e0b;
    }

    .card-danger {
      border-top: 4px solid #ef4444;
    }

    /* Sizes */
    .card-sm .card-header,
    .card-sm .card-body,
    .card-sm .card-footer {
      padding: 16px;
    }

    .card-sm .card-title {
      font-size: 1rem;
    }

    .card-lg .card-header,
    .card-lg .card-body,
    .card-lg .card-footer {
      padding: 32px;
    }

    .card-lg .card-title {
      font-size: 1.5rem;
    }



    /* Responsive */
    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .card-actions {
        width: 100%;
        justify-content: flex-end;
      }

      .card-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
    }
  `]
})
export class ModernCardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() header: boolean = false;
  @Input() footer: boolean = false;
  @Input() showHeader: boolean = false;
  @Input() showFooter: boolean = false;
  @Input() image: string = '';
  @Input() imageAlt: string = '';
  @Input() imageOverlay: string = '';
  @Input() variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'glass' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverable: boolean = true;
  @Input() elevated: boolean = false;
  @Input() actions: boolean = false;

  get cardClasses(): string {
    const classes = ['modern-card'];
    
    if (this.variant !== 'default') {
      classes.push(`card-${this.variant}`);
    }
    
    if (this.size !== 'md') {
      classes.push(`card-${this.size}`);
    }
    
    if (this.hoverable) {
      classes.push('hoverable');
    }
    
    if (this.elevated) {
      classes.push('elevated');
    }
    
    return classes.join(' ');
  }
} 