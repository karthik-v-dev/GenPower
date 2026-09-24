export enum PurchaseStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'netbanking' | 'emi';

export enum PaymentMethodEnum {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  FINANCING = 'financing',
  CASH = 'cash',
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface PurchaseFormData {
  generatorId?: string;
  quantity?: number;
  warranty?: number;
  paymentMethod?: PaymentMethod;
  shippingAddress?: ShippingAddress;
  includeInstallation?: boolean;
  specialRequirements?: string;
}

export interface PurchaseRequest {
  id: string;
  customerId: string;
  generatorId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  installationRequired: boolean;
  warrantyYears: number;
  status: PurchaseStatus;
  paymentStatus: string;
  trackingNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseRequest {
  generatorId: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  installationRequired: boolean;
  warrantyYears: number;
  notes: string;
}

export interface PurchaseState {
  purchases: PurchaseRequest[];
  selectedPurchase: PurchaseRequest | null;
  isLoading: boolean;
  error: string | null;
}
