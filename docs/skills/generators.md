# Generators Feature - Skills Documentation

## Overview
The generators feature provides a comprehensive catalog of portable generators with filtering, search, and detail viewing capabilities.

## Architecture

### Pages
- **HomePage** (`src/features/generators/HomePage.tsx`)
- **GeneratorsPage** (`src/features/generators/GeneratorsPage.tsx`)
- **GeneratorDetailPage** (To be implemented)

### State Management
- **Redux Slice**: `generatorSlice.ts`
- **Actions**: `fetchGenerators`, `fetchGeneratorById`, `setFilter`, `clearFilter`
- **State**: `generators[]`, `selectedGenerator`, `isLoading`, `error`, `filter`

### Services
- **MockDataService** (`src/services/mockData.service.ts`)
  - `generateGenerators()` - Create mock generator data

## Generator Types

### Portable Generators Only
All generators in the system are portable type, suitable for:
- Home backup power
- Construction sites
- Outdoor events
- Emergency power
- Remote locations

### Power Capacities
- 2 kW - Small appliances
- 3 kW - Basic home backup
- 5 kW - Essential home systems
- 7.5 kW - Multiple appliances
- 10 kW - Whole home backup
- 15 kW - Commercial use

## Data Structure

```typescript
interface Generator {
  id: string;
  name: string;
  model: string;
  manufacturer: string; // Honda, Yamaha, Kirloskar, etc.
  serialNumber: string;
  powerCapacityKW: number;
  voltage: number; // 230V or 110V
  phase: number; // 1-phase
  fuelType: FuelType; // petrol, diesel, lpg, dual_fuel
  type: GeneratorType.PORTABLE;
  status: GeneratorStatus; // available, leased, sold, etc.
  year: number;
  hours: number; // Runtime hours
  description: string;
  specifications: Record<string, string>;
  imageUrls: string[];
  purchasePrice: number; // INR
  salePrice: number; // INR
  dailyLeaseRate: number; // INR
  weeklyLeaseRate: number; // INR
  monthlyLeaseRate: number; // INR
  location: string; // Indian city
  createdAt: string;
  updatedAt: string;
}
```

## Filter System

### Filter Options
```typescript
interface GeneratorFilter {
  search?: string; // Name, model, manufacturer
  fuelType?: FuelType;
  status?: GeneratorStatus;
  minPower?: number;
  maxPower?: number;
  minPrice?: number;
  maxPrice?: number;
}
```

### Filter Logic
1. **Search**: Case-insensitive, matches name/model/manufacturer
2. **Fuel Type**: Exact match
3. **Status**: Exact match  
4. **Power Range**: Between min and max
5. **Price Range**: Between min and max

### Implementation
```typescript
const filteredGenerators = generators.filter((gen) => {
  if (filters.fuelType && gen.fuelType !== filters.fuelType) return false;
  if (filters.status && gen.status !== filters.status) return false;
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    return (
      gen.name.toLowerCase().includes(searchLower) ||
      gen.manufacturer.toLowerCase().includes(searchLower) ||
      gen.model.toLowerCase().includes(searchLower)
    );
  }
  return true;
});
```

## Home Page Features

### Hero Section
- Full-width background image
- Compelling headline
- Call-to-action buttons
- Responsive design

### Services Overview
- 4 service cards
  - Generator Leasing
  - Buy Generators
  - Service & Maintenance
  - Spare Parts
- Icon-based design
- Click to navigate

### Statistics Section
- Years of experience
- Generators available
- 24/7 service availability

### Mobile Optimization
- Responsive typography
- Flexible layouts
- Touch-friendly buttons
- Optimized images

## Generators Catalog Page

### Features
1. **Grid Layout** - 3 columns on desktop, 1 on mobile
2. **Filter Bar** - Search, fuel type, status filters
3. **Generator Cards**
   - Image with hover effect
   - Status badge
   - Power capacity
   - Pricing (daily/purchase)
   - Action buttons
4. **Empty State** - No results message

### Card Information
- Generator name
- Manufacturer & year
- Power capacity badge
- Status chip (color-coded)
- Fuel type icon
- Daily lease rate
- Purchase price
- View Details button
- Request button

### Status Colors
```typescript
const getStatusColor = (status: GeneratorStatus) => {
  switch (status) {
    case 'available': return 'success';
    case 'leased': return 'warning';
    case 'sold': return 'error';
    default: return 'info';
  }
};
```

## Indian Market Specifications

### Manufacturers
- Honda (Japanese brand, popular in India)
- Yamaha (Japanese brand)
- Kirloskar (Indian brand)
- Mahindra (Indian brand)
- Greaves (Indian brand)
- Cummins (Global, strong India presence)

### Fuel Types
1. **Petrol** - Most common for portable
2. **Diesel** - Better for longer runtime
3. **LPG** - Cleaner emissions
4. **Dual Fuel** - Petrol + LPG flexibility

### Specifications
- **Engine**: 4-Stroke OHV
- **Cooling**: Air/Fan cooled
- **Starting**: Recoil/Electric
- **Noise Level**: 55-70 dB
- **Fuel Tank**: 12-30 liters
- **Runtime**: 6-10 hours at 50% load
- **Weight**: 40-120 kg

### Pricing (INR)
- **Daily Lease**: ₹400 - ₹3,000
- **Weekly Lease**: ₹2,400 - ₹18,000
- **Monthly Lease**: ₹8,000 - ₹60,000
- **Purchase**: ₹20,000 - ₹1,80,000

### Locations
Major Indian cities:
- Mumbai
- Delhi
- Bangalore
- Chennai
- Pune
- Hyderabad
- Kolkata

## Best Practices

### Performance
1. Lazy load images
2. Virtualize long lists
3. Debounce search input
4. Cache filter results
5. Optimize re-renders

### User Experience
1. Show loading states
2. Display result count
3. Clear filter options
4. Mobile-friendly filters
5. Smooth transitions

### SEO
1. Meaningful page titles
2. Meta descriptions
3. Structured data
4. Alt text for images
5. Semantic HTML

## Usage Examples

### Fetch Generators
```typescript
useEffect(() => {
  dispatch(fetchGenerators());
}, [dispatch]);
```

### Apply Filters
```typescript
const handleFilterChange = (filterType: string, value: string) => {
  setFilters({ ...filters, [filterType]: value });
};
```

### Navigate to Details
```typescript
const handleViewDetails = (generatorId: string) => {
  navigate(`/generators/${generatorId}`);
};
```

### Format Currency
```typescript
import { formatPrice } from '../../utils';

<Typography>{formatPrice(generator.dailyLeaseRate)}/day</Typography>
```

## Testing Scenarios

### Catalog Display
1. Load generators → Display grid
2. No generators → Show empty state
3. Loading state → Show spinner
4. Error state → Display error message

### Filtering
1. Search by name → Filter results
2. Filter by fuel type → Show matching
3. Filter by status → Show matching
4. Multiple filters → Combine filters
5. Clear filters → Show all

### Navigation
1. Click generator card → Navigate to details
2. Click request button → Open request form
3. View unavailable generator → Disable request

## Future Enhancements

1. **Advanced Filters**
   - Location-based
   - Availability date range
   - Multi-select filters
   - Save filter presets

2. **Sorting Options**
   - Price (low to high)
   - Power capacity
   - Newest first
   - Most popular

3. **Comparison Feature**
   - Select multiple generators
   - Side-by-side comparison
   - Feature matrix

4. **Wishlist**
   - Save favorites
   - Compare saved items
   - Share wishlist

5. **Reviews & Ratings**
   - Customer reviews
   - Star ratings
   - Verified purchases

6. **Availability Calendar**
   - Check availability dates
   - Block unavailable dates
   - Real-time updates

## Mobile Optimizations

### Layout
- Single column on mobile
- Larger touch targets
- Simplified filters
- Sticky filter button

### Performance
- Lazy load images below fold
- Reduce initial load
- Progressive enhancement
- Optimize for 3G

### Gestures
- Swipe to refresh
- Pull to load more
- Touch to zoom images

## Accessibility

### ARIA Labels
```typescript
<button aria-label={`View details for ${generator.name}`}>
  View Details
</button>
```

### Keyboard Navigation
- Tab through cards
- Enter to select
- Escape to close modals

### Screen Readers
- Descriptive alt text
- ARIA live regions for updates
- Semantic HTML structure

## Analytics Events

Track user interactions:
```typescript
// View catalog
analytics.logEvent('view_catalog');

// Apply filter
analytics.logEvent('filter_generators', {
  filterType: 'fuelType',
  value: 'petrol'
});

// View generator
analytics.logEvent('view_generator', {
  generatorId: generator.id,
  generatorName: generator.name
});

// Request generator
analytics.logEvent('request_generator', {
  generatorId: generator.id,
  requestType: 'lease'
});
```
