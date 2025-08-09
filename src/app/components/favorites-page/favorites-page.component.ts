import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { Car } from '../../models/favorite.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent, FavoriteButtonComponent],
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss']
})
export class FavoritesPageComponent implements OnInit {
  favoriteCars: Car[] = [];
  isLoading = false;
  error: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';

  // Sorting
  sortBy: 'recent' | 'priceLow' | 'priceHigh' | 'rating' = 'recent';

  constructor(
    private favoriteService: FavoriteService,
    public authService: AuthService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.error = 'Please log in to view your favorites';
      return;
    }
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.error = null;

    this.favoriteService.getUserFavoriteCars().subscribe({
      next: (cars) => {
        this.favoriteCars = cars;
        this.applySort();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.error = 'Failed to load favorites. Please try again.';
        this.isLoading = false;
      }
    });
  }

  setViewMode(mode: 'grid' | 'list'): void { this.viewMode = mode; }

  onFavoriteToggled(carId: number, isFavorited: boolean): void {
    if (!isFavorited) {
      this.favoriteCars = this.favoriteCars.filter(car => car.id !== carId);
    }
  }

  getCarImage(car: Car): string { return this.imageService.getCarImageUrl(car); }

  bookCar(car: Car): void { this.router.navigate(['/cars', car.id]); }

  getEmptyStateMessage(): string {
    if (!this.authService.isLoggedIn()) return 'Please log in to view your favorites';
    return "You haven't added any cars to your favorites yet. Start exploring our collection!";
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) target.src = 'assets/images/cars/default.jpg';
  }

  // Sorting helpers
  setSort(sort: 'recent' | 'priceLow' | 'priceHigh' | 'rating'): void {
    this.sortBy = sort;
    this.applySort();
  }

  private applySort(): void {
    switch (this.sortBy) {
      case 'priceLow':
        this.favoriteCars = [...this.favoriteCars].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceHigh':
        this.favoriteCars = [...this.favoriteCars].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        this.favoriteCars = [...this.favoriteCars].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        // recent: keep original order assuming API returns most recent first
        this.favoriteCars = [...this.favoriteCars];
    }
  }
} 