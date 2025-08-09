import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  @Input() reviews: Review[] = [];
  @Input() showUserInfo: boolean = true;
  @Input() showDate: boolean = true;
  @Input() maxReviews: number = 0; // 0 means show all

  displayedReviews: Review[] = [];

  ngOnInit() {
    this.updateDisplayedReviews();
  }

  ngOnChanges() {
    this.updateDisplayedReviews();
  }

  private updateDisplayedReviews() {
    if (this.maxReviews > 0) {
      this.displayedReviews = this.reviews.slice(0, this.maxReviews);
    } else {
      this.displayedReviews = this.reviews;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'badge-success';
      case 'PENDING':
        return 'badge-warning';
      case 'REJECTED':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'PENDING':
        return 'Pending Review';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  trackByReviewId(index: number, review: Review): number {
    return review.id || index;
  }
} 