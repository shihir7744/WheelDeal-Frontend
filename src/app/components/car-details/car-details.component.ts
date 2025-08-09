import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { ReviewService } from '../../services/review.service';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { Car } from '../../models/car.model';
import { Review } from '../../models/review.model';
import { Rating } from '../../models/rating.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { ReviewListComponent } from '../review-list/review-list.component';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    StarRatingComponent,
    ReviewFormComponent,
    ReviewListComponent
  ],
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss']
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null;
  reviews: Review[] = [];
  userReview: Review | undefined = undefined;
  userRating: Rating | null = null;
  isLoading = true;
  showReviewForm = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private reviewService: ReviewService,
    private ratingService: RatingService,
    private authService: AuthService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadCarDetails();
  }

  private loadCarDetails(): void {
    const carId = Number(this.route.snapshot.paramMap.get('id'));
    if (!carId) {
      this.router.navigate(['/cars']);
      return;
    }

    this.isLoading = true;
    
    // Load car details
    this.carService.getCarById(carId).subscribe({
      next: (car) => {
        this.car = car;
        this.loadReviews();
        if (this.isLoggedIn) {
          this.loadUserReview();
          this.loadUserRating();
        }
      },
      error: (error) => {
        console.error('Error loading car details:', error);
        this.isLoading = false;
      }
    });
  }

  private loadReviews(): void {
    if (!this.car) return;

    this.reviewService.getApprovedReviews(this.car.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.isLoading = false;
      }
    });
  }

  private loadUserReview(): void {
    if (!this.car) return;

    this.reviewService.getUserReview(this.car.id).subscribe({
      next: (review) => {
        this.userReview = review;
      },
      error: (error) => {
        // User hasn't reviewed this car yet
        this.userReview = undefined;
      }
    });
  }

  private loadUserRating(): void {
    if (!this.car) return;

    this.ratingService.getUserRating(this.car.id).subscribe({
      next: (rating) => {
        this.userRating = rating;
      },
      error: (error) => {
        // User hasn't rated this car yet
        this.userRating = null;
      }
    });
  }

  onRatingChange(rating: number): void {
    if (!this.car || !this.isLoggedIn) return;

    this.ratingService.addOrUpdateRating(this.car.id, rating).subscribe({
      next: (newRating) => {
        this.userRating = newRating;
        // Refresh car details to update average rating
        this.loadCarDetails();
      },
      error: (error) => {
        console.error('Error updating rating:', error);
      }
    });
  }

  onReviewSubmitted(review: Review): void {
    this.userReview = review;
    this.showReviewForm = false;
    // Refresh reviews list
    this.loadReviews();
    // Refresh car details to update review count
    this.loadCarDetails();
  }

  onReviewCancelled(): void {
    this.showReviewForm = false;
  }

  toggleReviewForm(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  getCarImage(car: Car): string {
    return this.imageService.getCarImageUrl(car);
  }

  bookCar(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.car) {
      this.router.navigate(['/booking'], { 
        queryParams: { carId: this.car.id } 
      });
    }
  }
} 