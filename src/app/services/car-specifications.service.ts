import { Injectable } from '@angular/core';
import { CarSpecifications, CarSpecificationItem } from '../models/car-specifications.model';

@Injectable({
  providedIn: 'root'
})
export class CarSpecificationsService {

  constructor() { }

  getEngineSpecifications(specs: CarSpecifications): CarSpecificationItem[] {
    const items: CarSpecificationItem[] = [];
    
    if (specs.engineSize) {
      items.push({
        label: 'Engine Size',
        value: specs.engineSize,
        type: 'text'
      });
    }
    
    if (specs.horsepower) {
      items.push({
        label: 'Horsepower',
        value: specs.horsepower,
        unit: 'hp',
        type: 'number'
      });
    }
    
    if (specs.torque) {
      items.push({
        label: 'Torque',
        value: specs.torque,
        unit: 'lb-ft',
        type: 'number'
      });
    }
    
    if (specs.fuelType) {
      items.push({
        label: 'Fuel Type',
        value: specs.fuelType,
        type: 'text'
      });
    }
    
    if (specs.transmission) {
      items.push({
        label: 'Transmission',
        value: specs.transmission,
        type: 'text'
      });
    }
    
    if (specs.acceleration0To60) {
      items.push({
        label: '0-60 mph',
        value: specs.acceleration0To60,
        unit: 'sec',
        type: 'number'
      });
    }
    
    if (specs.topSpeed) {
      items.push({
        label: 'Top Speed',
        value: specs.topSpeed,
        unit: 'mph',
        type: 'number'
      });
    }
    
    return items;
  }

  getDimensionSpecifications(specs: CarSpecifications): CarSpecificationItem[] {
    const items: CarSpecificationItem[] = [];
    
    if (specs.seatingCapacity) {
      items.push({
        label: 'Seating Capacity',
        value: specs.seatingCapacity,
        unit: 'persons',
        type: 'number'
      });
    }
    
    if (specs.trunkCapacity) {
      items.push({
        label: 'Trunk Capacity',
        value: specs.trunkCapacity,
        unit: 'cu ft',
        type: 'number'
      });
    }
    
    if (specs.length) {
      items.push({
        label: 'Length',
        value: specs.length,
        unit: 'in',
        type: 'number'
      });
    }
    
    if (specs.width) {
      items.push({
        label: 'Width',
        value: specs.width,
        unit: 'in',
        type: 'number'
      });
    }
    
    if (specs.height) {
      items.push({
        label: 'Height',
        value: specs.height,
        unit: 'in',
        type: 'number'
      });
    }
    
    if (specs.wheelbase) {
      items.push({
        label: 'Wheelbase',
        value: specs.wheelbase,
        unit: 'in',
        type: 'number'
      });
    }
    
    if (specs.groundClearance) {
      items.push({
        label: 'Ground Clearance',
        value: specs.groundClearance,
        unit: 'in',
        type: 'number'
      });
    }
    
    if (specs.curbWeight) {
      items.push({
        label: 'Curb Weight',
        value: specs.curbWeight,
        unit: 'lbs',
        type: 'number'
      });
    }
    
    return items;
  }

  getFuelSpecifications(specs: CarSpecifications): CarSpecificationItem[] {
    const items: CarSpecificationItem[] = [];
    
    if (specs.fuelEfficiencyCity) {
      items.push({
        label: 'City MPG',
        value: specs.fuelEfficiencyCity,
        unit: 'mpg',
        type: 'number'
      });
    }
    
    if (specs.fuelEfficiencyHighway) {
      items.push({
        label: 'Highway MPG',
        value: specs.fuelEfficiencyHighway,
        unit: 'mpg',
        type: 'number'
      });
    }
    
    if (specs.fuelTankCapacity) {
      items.push({
        label: 'Fuel Tank Capacity',
        value: specs.fuelTankCapacity,
        unit: 'gal',
        type: 'number'
      });
    }
    
    return items;
  }

  getRentalSpecifications(specs: CarSpecifications): CarSpecificationItem[] {
    const items: CarSpecificationItem[] = [];
    
    if (specs.dailyRate) {
      items.push({
        label: 'Daily Rate',
        value: `$${specs.dailyRate}`,
        type: 'text'
      });
    }
    
    if (specs.weeklyRate) {
      items.push({
        label: 'Weekly Rate',
        value: `$${specs.weeklyRate}`,
        type: 'text'
      });
    }
    
    if (specs.monthlyRate) {
      items.push({
        label: 'Monthly Rate',
        value: `$${specs.monthlyRate}`,
        type: 'text'
      });
    }
    
    if (specs.depositAmount) {
      items.push({
        label: 'Deposit Required',
        value: `$${specs.depositAmount}`,
        type: 'text'
      });
    }
    
    if (specs.insuranceIncluded !== undefined) {
      items.push({
        label: 'Insurance Included',
        value: specs.insuranceIncluded,
        type: 'boolean'
      });
    }
    
    if (specs.maintenanceIncluded !== undefined) {
      items.push({
        label: 'Maintenance Included',
        value: specs.maintenanceIncluded,
        type: 'boolean'
      });
    }
    
    if (specs.unlimitedMileage !== undefined) {
      items.push({
        label: 'Unlimited Mileage',
        value: specs.unlimitedMileage,
        type: 'boolean'
      });
    }
    
    if (specs.minimumRentalDays) {
      items.push({
        label: 'Minimum Rental Days',
        value: specs.minimumRentalDays,
        unit: 'days',
        type: 'number'
      });
    }
    
    if (specs.maximumRentalDays) {
      items.push({
        label: 'Maximum Rental Days',
        value: specs.maximumRentalDays,
        unit: 'days',
        type: 'number'
      });
    }
    
    if (specs.ageRequirement) {
      items.push({
        label: 'Age Requirement',
        value: specs.ageRequirement,
        unit: 'years',
        type: 'number'
      });
    }
    
    if (specs.licenseRequirement) {
      items.push({
        label: 'License Requirement',
        value: specs.licenseRequirement,
        type: 'text'
      });
    }
    
    if (specs.additionalDriverFee) {
      items.push({
        label: 'Additional Driver Fee',
        value: `$${specs.additionalDriverFee}`,
        type: 'text'
      });
    }
    
    if (specs.lateReturnFee) {
      items.push({
        label: 'Late Return Fee',
        value: `$${specs.lateReturnFee}`,
        type: 'text'
      });
    }
    
    if (specs.earlyReturnDiscount) {
      items.push({
        label: 'Early Return Discount',
        value: `$${specs.earlyReturnDiscount}`,
        type: 'text'
      });
    }
    
    return items;
  }

  parseFeatures(featuresString?: string): string[] {
    if (!featuresString) return [];
    
    // Split by common delimiters and clean up
    return featuresString
      .split(/[,;|]/)
      .map(feature => feature.trim())
      .filter(feature => feature.length > 0);
  }
} 