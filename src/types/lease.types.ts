export enum LeaseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type LeaseDuration = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export enum LeasePeriodType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface LeaseFormData {
  generatorId?: string;
  duration?: LeaseDuration;
  startDate?: string;
  quantity?: number;
  deliveryAddress?: Address;
  notes?: string;
}

export interface LeaseRequest {
  id: string;
  customerId: string;
  generatorId: string;
  periodType: LeasePeriodType;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  projectDescription: string;
  requiredPowerCapacity: number;
  installationRequired: boolean;
  maintenanceIncluded: boolean;
  status: LeaseStatus;
  totalAmount: number;
  depositAmount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaseRequest {
  generatorId: string;
  periodType: LeasePeriodType;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  projectDescription: string;
  requiredPowerCapacity: number;
  installationRequired: boolean;
  maintenanceIncluded: boolean;
  notes: string;
}

export interface LeaseState {
  leases: LeaseRequest[];
  selectedLease: LeaseRequest | null;
  isLoading: boolean;
  error: string | null;
}
