export type SparePartCategory = 'engine' | 'electrical' | 'fuel' | 'cooling' | 'filters' | 'accessories';

export enum PartCategory {
  ENGINE = 'engine',
  ALTERNATOR = 'alternator',
  CONTROL_PANEL = 'control_panel',
  FUEL_SYSTEM = 'fuel_system',
  COOLING_SYSTEM = 'cooling_system',
  EXHAUST_SYSTEM = 'exhaust_system',
  ELECTRICAL = 'electrical',
  FILTERS = 'filters',
  BATTERIES = 'batteries',
  ACCESSORIES = 'accessories',
}

export enum PartStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: PartCategory;
  manufacturer: string;
  compatibleModels: string[];
  price: number;
  stock: number; // Made easier for UI
  stockQuantity: number;
  minimumOrderQuantity: number;
  status: PartStatus;
  weight: number;
  dimensions: string;
  warrantyMonths: number;
  imageUrl: string; // Primary image for cards
  imageUrls: string[];
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface SparePartOrder {
  id: string;
  customerId: string;
  items: SparePartOrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  paymentMethod: string;
  orderStatus: string;
  trackingNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SparePartOrderItem {
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateSparePartOrder {
  items: SparePartOrderItem[];
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  paymentMethod: string;
  notes: string;
}

export interface SparePartsState {
  parts: SparePart[];
  cart: SparePartOrderItem[];
  orders: SparePartOrder[];
  selectedPart: SparePart | null;
  isLoading: boolean;
  error: string | null;
}
