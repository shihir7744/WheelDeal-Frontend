import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarImageService } from '../../services/car-image.service';
import { CarImage, ImageType } from '../../models/car-image.model';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {
  @Input() carId!: number;
  @Input() showControls = true;
  @Input() showImageInfo = true;
  @Input() maxImages = 10;
  @Output() imageSelected = new EventEmitter<CarImage>();
  @Output() imageDeleted = new EventEmitter<CarImage>();

  images: CarImage[] = [];
  primaryImage: CarImage | null = null;
  currentImageIndex = 0;
  isLoading = false;
  error: string | null = null;

  constructor(private carImageService: CarImageService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.isLoading = true;
    this.error = null;

    this.carImageService.getCarImages(this.carId).subscribe({
      next: (images) => {
        this.images = images.slice(0, this.maxImages);
        this.primaryImage = this.images.find(img => img.isPrimary) || this.images[0] || null;
        this.currentImageIndex = this.primaryImage ? this.images.indexOf(this.primaryImage) : 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load images';
        this.isLoading = false;
        console.error('Error loading images:', error);
      }
    });
  }

  selectImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentImageIndex = index;
      this.imageSelected.emit(this.images[index]);
    }
  }

  nextImage(): void {
    if (this.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.imageSelected.emit(this.images[this.currentImageIndex]);
    }
  }

  previousImage(): void {
    if (this.images.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.images.length - 1 
        : this.currentImageIndex - 1;
      this.imageSelected.emit(this.images[this.currentImageIndex]);
    }
  }

  setPrimaryImage(image: CarImage): void {
    this.carImageService.setPrimaryImage(this.carId, image.id).subscribe({
      next: () => {
        // Update local state
        this.images.forEach(img => img.isPrimary = false);
        image.isPrimary = true;
        this.primaryImage = image;
      },
      error: (error) => {
        console.error('Error setting primary image:', error);
      }
    });
  }

  deleteImage(image: CarImage): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.carImageService.deleteImage(this.carId, image.id).subscribe({
        next: () => {
          const index = this.images.indexOf(image);
          this.images.splice(index, 1);
          
          // Update current index if needed
          if (this.images.length === 0) {
            this.currentImageIndex = 0;
            this.primaryImage = null;
          } else if (this.currentImageIndex >= this.images.length) {
            this.currentImageIndex = this.images.length - 1;
          }
          
          // Update primary image if deleted
          if (image.isPrimary && this.images.length > 0) {
            this.primaryImage = this.images[0];
            this.primaryImage.isPrimary = true;
          }
          
          this.imageDeleted.emit(image);
        },
        error: (error) => {
          console.error('Error deleting image:', error);
        }
      });
    }
  }

  getImageUrl(filePath: string): string {
    return this.carImageService.getImageUrl(filePath);
  }

  getImageTypeDisplayName(imageType: ImageType): string {
    return this.carImageService.getImageTypeDisplayName(imageType);
  }

  getImageTypeBadgeClass(imageType: ImageType): string {
    return this.carImageService.getImageTypeBadgeClass(imageType);
  }

  formatFileSize(bytes: number): string {
    return this.carImageService.formatFileSize(bytes);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/cars/default.jpg';
    }
  }

  get currentImage(): CarImage | null {
    return this.images[this.currentImageIndex] || null;
  }

  get hasMultipleImages(): boolean {
    return this.images.length > 1;
  }

  get canNavigate(): boolean {
    return this.hasMultipleImages && this.showControls;
  }
} 