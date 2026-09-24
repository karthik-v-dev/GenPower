export type ServiceType = 'maintenance' | 'repair' | 'inspection' | 'installation' | 'emergency';

export enum ServiceTypeEnum {
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  INSPECTION = 'inspection',
  INSTALLATION = 'installation',
  EMERGENCY = 'emergency',
}

export interface ServiceFormData {
  generatorId?: string;
  serviceType?: ServiceType;
  urgency?: string;
  preferredDate?: string;
  preferredTime?: string;
  contactPhone?: string;
  alternatePhone?: string;
  serviceAddress?: string;
  issueDescription?: string;
}

export enum ServicePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ServiceStatus {
  REQUESTED = 'requested',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  generatorId: string;
  generatorModel: string;
  generatorSerialNumber: string;
  serviceType: ServiceType;
  priority: ServicePriority;
  status: ServiceStatus;
  issueDescription: string;
  serviceAddress: string;
  serviceCity: string;
  serviceState: string;
  serviceZipCode: string;
  preferredDate: string;
  preferredTimeSlot: string;
  technicianId: string;
  technicianName: string;
  scheduledDate: string;
  completedDate: string;
  partsUsed: string[];
  laborHours: number;
  partsAmount: number;
  laborAmount: number;
  totalAmount: number;
  notes: string;
  customerNotes: string;
  technicianNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  generatorId: string;
  generatorModel: string;
  generatorSerialNumber: string;
  serviceType: ServiceType;
  priority: ServicePriority;
  issueDescription: string;
  serviceAddress: string;
  serviceCity: string;
  serviceState: string;
  serviceZipCode: string;
  preferredDate: string;
  preferredTimeSlot: string;
  customerNotes: string;
}

export interface ServiceState {
  services: ServiceRequest[];
  selectedService: ServiceRequest | null;
  isLoading: boolean;
  error: string | null;
}
