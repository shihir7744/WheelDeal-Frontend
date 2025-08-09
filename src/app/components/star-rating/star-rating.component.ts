import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() readonly: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showValue: boolean = false;
  @Input() showCount: boolean = false;
  @Input() ratingCount: number = 0;
  
  @Output() ratingChange = new EventEmitter<number>();
  @Output() ratingHover = new EventEmitter<number>();

  stars: number[] = [];
  hoveredRating: number = 0;

  ngOnInit() {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }

  onStarClick(star: number) {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(star);
    }
  }

  onStarHover(star: number) {
    if (!this.readonly) {
      this.hoveredRating = star;
      this.ratingHover.emit(star);
    }
  }

  onStarLeave() {
    if (!this.readonly) {
      this.hoveredRating = 0;
      this.ratingHover.emit(0);
    }
  }

  getStarClass(star: number): string {
    const currentRating = this.hoveredRating || this.rating;
    
    if (star <= currentRating) {
      return 'star-filled';
    } else if (star - currentRating < 1) {
      return 'star-partial';
    } else {
      return 'star-empty';
    }
  }

  getStarIcon(star: number): string {
    const currentRating = this.hoveredRating || this.rating;
    
    if (star <= currentRating) {
      return 'fas fa-star';
    } else if (star - currentRating < 1) {
      return 'fas fa-star-half-alt';
    } else {
      return 'far fa-star';
    }
  }

  getSizeClass(): string {
    switch (this.size) {
      case 'sm': return 'star-rating-sm';
      case 'lg': return 'star-rating-lg';
      default: return 'star-rating-md';
    }
  }
} 