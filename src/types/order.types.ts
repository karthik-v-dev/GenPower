export type OrderType = 'generator_purchase' | 'generator_lease' | 'spare_parts';

export type UnifiedOrderStatus =
  | 'pending'
  | 'processing'
  | 'approved'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderItemDetail {
  id: string;
  name: string;
  modelOrPartNumber?: string;
  category?: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  specifications?: Record<string, string>;
}

export interface UnifiedOrder {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItemDetail[];
  subtotal: number;
  taxAmount: number;
  shippingOrInstallationAmount: number;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  status: UnifiedOrderStatus;
  trackingNumber?: string;
  notes?: string;
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
  termsVersion?: string;
  createdAt: string;
  updatedAt: string;
}
