import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModernButtonComponent } from './modern-button.component';
import { ModernCardComponent } from './modern-card.component';
import { ModernInputComponent } from './modern-input.component';
import { ModernLoadingComponent } from './modern-loading.component';

@NgModule({
  imports: [
    CommonModule,
    ModernButtonComponent,
    ModernCardComponent,
    ModernInputComponent,
    ModernLoadingComponent
  ],
  exports: [
    ModernButtonComponent,
    ModernCardComponent,
    ModernInputComponent,
    ModernLoadingComponent
  ]
})
export class SharedModule { } 