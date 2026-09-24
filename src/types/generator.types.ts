export enum GeneratorStatus {
  AVAILABLE = 'available',
  LEASED = 'leased',
  SOLD = 'sold',
  IN_SERVICE = 'in_service',
  OUT_OF_ORDER = 'out_of_order',
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  DUAL_FUEL = 'dual_fuel',
  LPG = 'lpg',
}

export enum GeneratorType {
  PORTABLE = 'portable',
}

export interface Generator {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  powerCapacityKW: number;
  voltage: number;
  phase: number;
  fuelType: FuelType;
  type: GeneratorType;
  status: GeneratorStatus;
  year: number;
  hours: number;
  description: string;
  specifications: Record<string, string>;
  imageUrls: string[];
  purchasePrice: number;
  salePrice: number;
  dailyLeaseRate: number;
  weeklyLeaseRate: number;
  monthlyLeaseRate: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratorFilter {
  search?: string;
  type?: GeneratorType;
  fuelType?: FuelType;
  status?: GeneratorStatus;
  minPower?: number;
  maxPower?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface GeneratorState {
  items: Generator[]; // For compatibility with pages
  generators: Generator[];
  selectedGenerator: Generator | null;
  isLoading: boolean;
  error: string | null;
  filter: GeneratorFilter;
}
