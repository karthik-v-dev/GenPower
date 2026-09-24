// App Configuration
export const APP_NAME = 'GenPower';
export const APP_VERSION = '1.0.0';

// API Configuration (will be replaced with Firebase)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Country & Currency
export const COUNTRY = 'India';
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

// Firebase Configuration Keys
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  GENERATORS: 'generators',
  LEASES: 'leases',
  PURCHASES: 'purchases',
  SERVICES: 'services',
  SPARE_PARTS: 'spareParts',
  SPARE_PART_ORDERS: 'sparePartOrders',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

// Generator Images (using copyright-free placeholder images)
export const GENERATOR_PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop', // Portable generator
  'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=600&fit=crop', // Portable generator
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop', // Portable generator
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop', // Portable generator
];

// Spare Parts Images
export const SPARE_PART_PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop', // Engine parts
  'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop', // Electrical parts
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop', // Control panel
  'https://images.unsplash.com/photo-1581092160607-ee67e8e97c53?w=400&h=400&fit=crop', // Filters
];

// Hero Images
export const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1581092918484-8299f8c53e8c?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&h=1080&fit=crop',
];

// Time Slots for Service
export const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
] as const;

// Phone and Email
export const CONTACT_INFO = {
  phone: '+91 98660 07477',
  email: 'voorugondakarthik@gmail.com',
  address: '#18-7-123, Ashok Nagar, Kareemabad, Warangal, Telangana - 506002, India',
} as const;

// Warranty Options
export const WARRANTY_OPTIONS = [1, 2, 3, 5] as const;

// Tax Rate (GST for India)
export const TAX_RATE = 0.18; // 18% GST

// Shipping
export const SHIPPING_RATES = {
  standard: 500,
  express: 1000,
  overnight: 2000,
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_PHONE_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_NOTES_LENGTH: 500,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  GENERATORS: '/generators',
  GENERATOR_DETAILS: '/generators/:id',
  LEASE: '/lease',
  PURCHASE: '/purchase',
  SERVICE: '/service',
  SPARE_PARTS: '/spare-parts',
  CART: '/cart',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  PROFILE: '/profile',
} as const;

// Mock Data Count
export const MOCK_DATA_COUNT = {
  GENERATORS: 20,
  SPARE_PARTS: 30,
} as const;

// Theme
export const THEME_OPTIONS = ['light', 'dark', 'system'] as const;
export type ThemeMode = typeof THEME_OPTIONS[number];
