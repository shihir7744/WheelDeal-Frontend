import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StarRatingComponent],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit {
  @Input() carId!: number;
  @Input() existingReview?: Review;
  @Output() reviewSubmitted = new EventEmitter<Review>();
  @Output() reviewCancelled = new EventEmitter<void>();

  reviewForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  selectedRating = 0;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.existingReview) {
      this.loadExistingReview();
    }
  }

  private initForm() {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  private loadExistingReview() {
    if (this.existingReview) {
      this.selectedRating = this.existingReview.rating;
      this.reviewForm.patchValue({
        rating: this.existingReview.rating,
        comment: this.existingReview.comment
      });
    }
  }

  onRatingChange(rating: number) {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;
      this.error = null;

      const formValue = this.reviewForm.value;
      
      this.reviewService.addOrUpdateReview(
        this.carId,
        formValue.rating,
        formValue.comment
      ).subscribe({
        next: (review) => {
          this.isSubmitting = false;
          this.reviewSubmitted.emit(review);
          this.reviewForm.reset();
          this.selectedRating = 0;
        },
        error: (error) => {
          this.isSubmitting = false;
          this.error = error.error?.message || 'Failed to submit review. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.reviewCancelled.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.reviewForm.controls).forEach(key => {
      const control = this.reviewForm.get(key);
      control?.markAsTouched();
    });
  }

  getRatingError(): string | null {
    const ratingControl = this.reviewForm.get('rating');
    if (ratingControl?.errors && ratingControl.touched) {
      if (ratingControl.errors['required']) {
        return 'Please select a rating';
      }
      if (ratingControl.errors['min'] || ratingControl.errors['max']) {
        return 'Rating must be between 1 and 5';
      }
    }
    return null;
  }

  getCommentError(): string | null {
    const commentControl = this.reviewForm.get('comment');
    if (commentControl?.errors && commentControl.touched) {
      if (commentControl.errors['required']) {
        return 'Please enter a comment';
      }
      if (commentControl.errors['minlength']) {
        return 'Comment must be at least 10 characters long';
      }
      if (commentControl.errors['maxlength']) {
        return 'Comment must not exceed 1000 characters';
      }
    }
    return null;
  }
} 