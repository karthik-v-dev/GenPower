export * from './user.types';
export * from './generator.types';
export * from './lease.types';
export * from './purchase.types';
export * from './service.types';
export * from './spareParts.types';
export * from './order.types';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}
