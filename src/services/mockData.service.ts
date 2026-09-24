import {
  Generator,
  SparePart,
  FuelType,
  GeneratorType,
  GeneratorStatus,
  PartCategory,
  PartStatus,
} from '../types';
import { GENERATOR_PLACEHOLDER_IMAGES, SPARE_PART_PLACEHOLDER_IMAGES, MOCK_DATA_COUNT } from '../constants';

class MockDataService {
  generateGenerators(): Generator[] {
    const generators: Generator[] = [];
    const manufacturers = ['Honda', 'Yamaha', 'Kirloskar', 'Mahindra', 'Greaves', 'Cummins'];
    const models = ['EP2500', 'EF3000iSEB', 'KG1-3AS', 'Powerol', 'GR-3500', 'P3500'];
    const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata'];

    for (let i = 0; i < MOCK_DATA_COUNT.GENERATORS; i++) {
      const manufacturer = manufacturers[i % manufacturers.length];
      const model = models[i % models.length];
      const powerCapacity = [2, 3, 5, 7.5, 10, 15][i % 6];

      generators.push({
        id: `gen-${i + 1}`,
        name: `${manufacturer} ${model} ${powerCapacity}kW`,
        model: model,
        manufacturer: manufacturer,
        serialNumber: `SN${String(10000 + i).padStart(6, '0')}`,
        powerCapacityKW: powerCapacity,
        voltage: [230, 110][i % 2],
        phase: 1,
        fuelType: Object.values(FuelType)[i % Object.values(FuelType).length],
        type: GeneratorType.PORTABLE,
        status: Object.values(GeneratorStatus)[i % Object.values(GeneratorStatus).length],
        year: 2020 + (i % 5),
        hours: Math.floor(Math.random() * 2000),
        description: `High-performance portable ${powerCapacity}kW generator ideal for ${
          i % 2 === 0 ? 'home backup' : 'construction sites'
        }. Features automatic voltage regulation, low fuel consumption, and quiet operation. Perfect for Indian conditions.`,
        specifications: {
          'Engine Type': ['4-Stroke OHV', '4-Stroke', 'Single Cylinder'][i % 3],
          'Cooling System': ['Air Cooled', 'Fan Cooled'][i % 2],
          'Starting System': ['Recoil + Electric', 'Electric', 'Recoil'][i % 3],
          'Noise Level': `${55 + (i % 15)} dB`,
          'Fuel Tank Capacity': `${12 + i * 2} liters`,
          'Runtime': `${6 + (i % 4)} hours at 50% load`,
          'Weight': `${40 + i * 5} kg`,
          'Dimensions': `${50 + i}x${35 + i}x${45 + i} cm`,
        },
        imageUrls: [
          GENERATOR_PLACEHOLDER_IMAGES[i % GENERATOR_PLACEHOLDER_IMAGES.length],
          GENERATOR_PLACEHOLDER_IMAGES[(i + 1) % GENERATOR_PLACEHOLDER_IMAGES.length],
        ],
        purchasePrice: powerCapacity * 10000,
        salePrice: powerCapacity * 12000,
        dailyLeaseRate: powerCapacity * 200,
        weeklyLeaseRate: powerCapacity * 1200,
        monthlyLeaseRate: powerCapacity * 4000,
        location: indianCities[i % indianCities.length],
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
      });
    }

    return generators;
  }

  generateSpareParts(): SparePart[] {
    const parts: SparePart[] = [];
    const manufacturers = ['Honda', 'Yamaha', 'Kirloskar', 'Mahindra', 'Greaves'];
    const partNames = [
      'Oil Filter',
      'Air Filter',
      'Fuel Filter',
      'Spark Plug',
      'Battery',
      'Voltage Regulator',
      'Control Module',
      'Circuit Breaker',
      'Alternator Belt',
      'Coolant Pump',
      'Fuel Pump',
      'Starter Motor',
      'Exhaust Gasket',
      'Fuel Injector',
      'Temperature Sensor',
    ];

    for (let i = 0; i < MOCK_DATA_COUNT.SPARE_PARTS; i++) {
      const partName = partNames[i % partNames.length];
      const manufacturer = manufacturers[i % manufacturers.length];
      const category = Object.values(PartCategory)[i % Object.values(PartCategory).length];

      parts.push({
        id: `part-${i + 1}`,
        partNumber: `PN${String(10000 + i).padStart(8, '0')}`,
        name: `${manufacturer} ${partName}`,
        description: `Genuine ${manufacturer} ${partName} for portable generators. OEM quality replacement part with guaranteed fit and reliability. Compatible with most portable generator models.`,
        category: category,
        manufacturer: manufacturer,
        compatibleModels: [
          'EP2500',
          'EF3000iSEB',
          'KG1-3AS',
          'Powerol',
          'GR-3500',
        ].slice(0, 2 + (i % 3)),
        price: 500 + i * 150,
        stock: Math.floor(Math.random() * 50) + 5, // For UI display
        stockQuantity: Math.floor(Math.random() * 100) + 10,
        minimumOrderQuantity: [1, 2, 5][i % 3],
        status: Object.values(PartStatus)[i % Object.values(PartStatus).length],
        weight: 0.5 + i * 0.3,
        dimensions: `${5 + i}x${3 + i}x${2 + i} cm`,
        warrantyMonths: [6, 12, 24, 36][i % 4],
        imageUrl: SPARE_PART_PLACEHOLDER_IMAGES[i % SPARE_PART_PLACEHOLDER_IMAGES.length], // Primary image
        imageUrls: [SPARE_PART_PLACEHOLDER_IMAGES[i % SPARE_PART_PLACEHOLDER_IMAGES.length]],
        specifications: {
          Material: ['Steel', 'Aluminum', 'Copper', 'Composite'][i % 4],
          'OEM Part': ['Yes', 'No'][i % 2],
          'Country of Origin': ['India', 'Japan', 'China'][i % 3],
        },
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
      });
    }

    return parts;
  }

  getAllSpareParts(): SparePart[] {
    return this.generateSpareParts();
  }
}

export const mockDataService = new MockDataService();
export const mockSparePartsService = mockDataService; // Alias for compatibility
