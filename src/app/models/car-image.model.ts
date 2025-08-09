export interface CarImage {
  id: number;
  carId: number;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  imageType: ImageType;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ImageType {
  PRIMARY = 'PRIMARY',
  GALLERY = 'GALLERY',
  INTERIOR = 'INTERIOR',
  EXTERIOR = 'EXTERIOR',
  FEATURE = 'FEATURE'
}

export interface ImageUploadRequest {
  carId: number;
  imageType?: ImageType;
  isPrimary?: boolean;
  sortOrder?: number;
  altText?: string;
  caption?: string;
}

export interface ImageUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: CarImage;
}

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  image?: CarImage;
}

export interface CarImageStats {
  totalImages: number;
  primaryImages: number;
  galleryImages: number;
  interiorImages: number;
  exteriorImages: number;
  featureImages: number;
}

export interface ImageReorderRequest {
  imageIds: number[];
} 