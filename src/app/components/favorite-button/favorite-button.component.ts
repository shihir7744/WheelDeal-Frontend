import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss']
})
export class FavoriteButtonComponent implements OnInit {
  @Input() carId!: number;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showText: boolean = false;
  @Output() favoriteToggled = new EventEmitter<boolean>();

  isFavorited = false;
  isLoading = false;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.checkFavoriteStatus();
  }

  private checkFavoriteStatus(): void {
    this.favoriteService.isCarFavorited(this.carId).subscribe({
      next: (isFavorited) => {
        this.isFavorited = isFavorited;
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
      }
    });
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isLoading) return;

    this.isLoading = true;

    this.favoriteService.toggleFavorite(this.carId).subscribe({
      next: (response) => {
        this.isFavorited = response.favorite !== undefined;
        this.favoriteToggled.emit(this.isFavorited);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        this.isLoading = false;
      }
    });
  }

  getButtonClass(): string {
    const baseClass = 'favorite-btn';
    const sizeClass = `favorite-btn-${this.size}`;
    const stateClass = this.isFavorited ? 'favorited' : 'not-favorited';
    const loadingClass = this.isLoading ? 'loading' : '';

    return `${baseClass} ${sizeClass} ${stateClass} ${loadingClass}`.trim();
  }

  getIconClass(): string {
    if (this.isLoading) {
      return 'fas fa-spinner fa-spin';
    }
    return this.isFavorited ? 'fas fa-heart' : 'far fa-heart';
  }

  getButtonText(): string {
    if (this.isLoading) {
      return 'Loading...';
    }
    return this.isFavorited ? 'Remove from Favorites' : 'Add to Favorites';
  }
} 