import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../services/car.service';
import { CarSpecificationsService } from '../../services/car-specifications.service';
import { Car } from '../../models/car.model';
import { CarSpecifications, CarSpecificationsSection, CarFeaturesSection } from '../../models/car-specifications.model';

@Component({
  selector: 'app-enhanced-car-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enhanced-car-details.component.html',
  styleUrls: ['./enhanced-car-details.component.scss']
})
export class EnhancedCarDetailsComponent implements OnInit {
  @Input() carId?: number;
  
  car: Car | null = null;
  specifications: CarSpecifications | null = null;
  isLoading = false;
  error: string | null = null;
  
  specificationSections: CarSpecificationsSection[] = [];
  featureSections: CarFeaturesSection[] = [];
  
  activeTab = 'overview';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private carSpecificationsService: CarSpecificationsService
  ) {}

  ngOnInit(): void {
    const id = this.carId || Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCarDetails(id);
    }
  }

  loadCarDetails(carId: number): void {
    this.isLoading = true;
    this.error = null;

    // Load basic car information
    this.carService.getCarById(carId).subscribe({
      next: (car) => {
        this.car = car;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load car details';
        this.isLoading = false;
        console.error('Error loading car:', error);
      }
    });

    // Load detailed specifications
    this.carService.getCarSpecifications(carId).subscribe({
      next: (specs) => {
        this.specifications = specs;
        this.organizeSpecifications();
        this.organizeFeatures();
      },
      error: (error) => {
        console.error('Error loading specifications:', error);
      }
    });
  }

  organizeSpecifications(): void {
    if (!this.specifications) return;

    this.specificationSections = [
      {
        title: 'Engine & Performance',
        icon: 'fas fa-engine',
        specifications: this.carSpecificationsService.getEngineSpecifications(this.specifications)
      },
      {
        title: 'Dimensions & Capacity',
        icon: 'fas fa-ruler-combined',
        specifications: this.carSpecificationsService.getDimensionSpecifications(this.specifications)
      },
      {
        title: 'Fuel Efficiency',
        icon: 'fas fa-gas-pump',
        specifications: this.carSpecificationsService.getFuelSpecifications(this.specifications)
      },
      {
        title: 'Rental Information',
        icon: 'fas fa-info-circle',
        specifications: this.carSpecificationsService.getRentalSpecifications(this.specifications)
      }
    ];
  }

  organizeFeatures(): void {
    if (!this.specifications) return;

    this.featureSections = [
      {
        title: 'Safety Features',
        icon: 'fas fa-shield-alt',
        features: this.carSpecificationsService.parseFeatures(this.specifications.safetyFeatures),
        color: '#dc3545'
      },
      {
        title: 'Entertainment',
        icon: 'fas fa-music',
        features: this.carSpecificationsService.parseFeatures(this.specifications.entertainmentFeatures),
        color: '#17a2b8'
      },
      {
        title: 'Comfort',
        icon: 'fas fa-couch',
        features: this.carSpecificationsService.parseFeatures(this.specifications.comfortFeatures),
        color: '#28a745'
      },
      {
        title: 'Technology',
        icon: 'fas fa-microchip',
        features: this.carSpecificationsService.parseFeatures(this.specifications.technologyFeatures),
        color: '#6f42c1'
      }
    ];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  formatValue(value: any, unit?: string): string {
    if (value === null || value === undefined) return 'N/A';
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (typeof value === 'number') {
      return unit ? `${value} ${unit}` : value.toString();
    }
    
    return value.toString();
  }

  getBadgeClass(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'badge-success' : 'badge-secondary';
    }
    return 'badge-primary';
  }

  goBack(): void {
    this.router.navigate(['/cars']);
  }
} 