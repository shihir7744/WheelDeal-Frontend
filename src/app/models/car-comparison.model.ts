import { Car } from './car.model';

export interface CarComparisonRequest {
  carIds: number[];
  comparisonType: 'specifications' | 'features' | 'pricing' | 'rental' | 'all';
}

export interface CarComparisonResult {
  cars: Car[];
  specifications?: ComparisonSection;
  features?: ComparisonSection;
  pricing?: ComparisonSection;
  rental?: ComparisonSection;
  comparisonType: string;
}

export interface ComparisonSection {
  [category: string]: ComparisonAttribute[];
}

export interface ComparisonAttribute {
  attributeName: string;
  attributeLabel: string;
  attributeType: 'text' | 'number' | 'boolean' | 'currency' | 'percentage';
  unit?: string;
  value: any[];
  isHighlighted?: boolean;
  highlightReason?: 'best' | 'worst' | 'difference';
}

export interface ComparisonCategory {
  title: string;
  icon: string;
  attributes: ComparisonAttribute[];
}

export interface ComparisonCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  type: string;
  price: number;
  imageUrl?: string;
  averageRating?: number;
  ratingCount?: number;
} 