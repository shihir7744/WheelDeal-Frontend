import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarImageService } from '../../services/car-image.service';
import { ImageType, ImageUploadRequest } from '../../models/car-image.model';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() carId!: number;
  @Output() imageUploaded = new EventEmitter<void>();

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  error: string | null = null;
  success: string | null = null;

  imageTypes = Object.values(ImageType);
  imageTypeDisplayNames = {
    [ImageType.PRIMARY]: 'Primary',
    [ImageType.GALLERY]: 'Gallery',
    [ImageType.INTERIOR]: 'Interior',
    [ImageType.EXTERIOR]: 'Exterior',
    [ImageType.FEATURE]: 'Feature'
  };

  constructor(
    private fb: FormBuilder,
    private carImageService: CarImageService
  ) {
    this.uploadForm = this.fb.group({
      imageType: [ImageType.GALLERY, Validators.required],
      isPrimary: [false],
      sortOrder: [null],
      altText: ['', [Validators.maxLength(255)]],
      caption: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!this.isValidImageType(file)) {
        this.error = 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        this.error = 'File size must be less than 10MB';
        return;
      }

      this.selectedFile = file;
      this.error = null;
    }
  }

  isValidImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  uploadImage(): void {
    if (!this.selectedFile || !this.uploadForm.valid) {
      this.error = 'Please select a file and fill in required fields';
      return;
    }

    this.isUploading = true;
    this.error = null;
    this.success = null;
    this.uploadProgress = 0;

    const request: ImageUploadRequest = {
      carId: this.carId,
      imageType: this.uploadForm.get('imageType')?.value,
      isPrimary: this.uploadForm.get('isPrimary')?.value,
      sortOrder: this.uploadForm.get('sortOrder')?.value,
      altText: this.uploadForm.get('altText')?.value,
      caption: this.uploadForm.get('caption')?.value
    };

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 90) {
        clearInterval(progressInterval);
      }
    }, 100);

    this.carImageService.uploadImage(this.carId, this.selectedFile, request).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        this.success = 'Image uploaded successfully!';
        this.resetForm();
        this.imageUploaded.emit();
        
        // Reset progress after a delay
        setTimeout(() => {
          this.uploadProgress = 0;
          this.isUploading = false;
        }, 1000);
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.uploadProgress = 0;
        this.isUploading = false;
        this.error = error.error?.message || 'Failed to upload image. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.uploadForm.reset({
      imageType: ImageType.GALLERY,
      isPrimary: false,
      sortOrder: null,
      altText: '',
      caption: ''
    });
    this.selectedFile = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  clearError(): void {
    this.error = null;
  }

  clearSuccess(): void {
    this.success = null;
  }

  getImageTypeDisplayName(type: ImageType): string {
    return this.imageTypeDisplayNames[type] || type;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 