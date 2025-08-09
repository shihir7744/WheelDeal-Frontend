import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-modern-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModernInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-container" [class.focused]="isFocused" [class.has-value]="hasValue" [class.error]="hasError">
      <div class="input-wrapper">
        <i *ngIf="icon" [class]="icon" class="input-icon"></i>
        <input
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="modern-input"
          [class.has-icon]="icon"
        />
        <button 
          *ngIf="type === 'password' && showPasswordToggle" 
          type="button"
          class="password-toggle"
          (click)="togglePassword()"
          [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
        >
          <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      <div class="input-border"></div>
      <label class="input-label" *ngIf="label">{{ label }}</label>
      <div class="input-error" *ngIf="errorMessage">{{ errorMessage }}</div>
    </div>
  `,
  styles: [`
    .input-container {
      position: relative;
      margin-bottom: 24px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #000000;
      font-size: 16px;
      z-index: 2;
      transition: color 0.3s ease;
    }

    .modern-input {
      width: 100%;
      padding: 16px;
      padding-left: 48px;
      border: 2px solid rgba(191, 218, 164, 0.2);
      border-radius: 12px;
      background: #ffffff;
      backdrop-filter: blur(10px);
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      color: #000000;
      transition: all 0.3s ease;
      outline: none;
    }

    .modern-input:not(.has-icon) {
      padding-left: 16px;
    }

    .modern-input::placeholder {
      color: #666666;
      transition: color 0.3s ease;
    }

    .modern-input:focus {
      border-color: #bfdaa4;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(191, 218, 164, 0.1);
      transform: translateY(-2px);
    }

    .modern-input:focus::placeholder {
      color: #999999;
    }

    .modern-input:disabled {
      background: #f5f5f5;
      color: #666666;
      cursor: not-allowed;
      transform: none;
    }

    .input-border {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(135deg, #bfdaa4, #8fb370);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .input-label {
      position: absolute;
      top: -8px;
      left: 12px;
      background: white;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 600;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.3s ease;
    }

    .password-toggle {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #000000;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.3s ease;
      z-index: 2;
    }

    .password-toggle:hover {
      color: #8fb370;
      background: rgba(191, 218, 164, 0.1);
    }

    .input-error {
      margin-top: 8px;
      font-size: 12px;
      color: #ef4444;
      font-weight: 500;
    }

    /* Focused State */
    .input-container.focused .input-icon {
      color: #8fb370;
    }

    .input-container.focused .input-border {
      transform: scaleX(1);
    }

    .input-container.focused .input-label {
      opacity: 1;
      transform: translateY(0);
      color: #8fb370;
    }

    /* Has Value State */
    .input-container.has-value .input-label {
      opacity: 1;
      transform: translateY(0);
    }

    /* Error State */
    .input-container.error .modern-input {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .input-container.error .input-icon {
      color: #ef4444;
    }

    .input-container.error .input-border {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      transform: scaleX(1);
    }

    /* Success State */
    .input-container.success .modern-input {
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    .input-container.success .input-icon {
      color: #22c55e;
    }

    .input-container.success .input-border {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      transform: scaleX(1);
    }

    /* Sizes */
    .input-sm .modern-input {
      padding: 12px;
      font-size: 14px;
    }

    .input-sm .input-icon {
      left: 12px;
      font-size: 14px;
    }

    .input-lg .modern-input {
      padding: 20px;
      font-size: 18px;
    }

    .input-lg .input-icon {
      left: 20px;
      font-size: 18px;
    }



    /* Responsive */
    @media (max-width: 768px) {
      .modern-input {
        font-size: 16px; /* Prevents zoom on iOS */
      }
    }
  `]
})
export class ModernInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
  @Input() showPasswordToggle: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'outline' = 'default';
  @Input() errorMessage: string = '';

  value: string = '';
  isFocused: boolean = false;
  showPassword: boolean = false;
  hasError: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get hasValue(): boolean {
    return this.value.length > 0;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.hasError = false;
  }

  onFocus(): void {
    this.isFocused = true;
    this.onTouched();
  }

  onBlur(): void {
    this.isFocused = false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
} 