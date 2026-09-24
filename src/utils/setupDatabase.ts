import { ref, set, get } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../services/firebase.service';
import { User, UserRole, Generator, GeneratorType, GeneratorStatus, FuelType, SparePart, PartCategory, PartStatus } from '../types';

/**
 * Setup Firebase Realtime Database with owner account and all data structures
 * This function will:
 * 1. Create owner account in Firebase Auth (if not exists)
 * 2. Create user profile in Realtime Database
 * 3. Set up initial database structure with all endpoints
 * 4. Populate sample data for generators and spare parts
 */

export async function setupDatabaseWithOwner(): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    console.log('🔄 Starting database setup...');

    // Owner details
    const ownerEmail = 'voorugondakarthik@gmail.com';
    const ownerPassword = 'Karthi@506329';

    let userId: string;

    // Step 1: Check if owner exists in Authentication
    try {
      console.log('📧 Creating owner auth account...');
      const userCredential = await createUserWithEmailAndPassword(auth, ownerEmail, ownerPassword);
      userId = userCredential.user.uid;
      console.log('✅ Owner auth account created:', userId);
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        console.log('ℹ️  Owner auth account already exists');
        // Try to find existing owner in database
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const users = snapshot.val();
          const existingUser = Object.entries(users).find(
            ([_, user]: [string, any]) => user.email === ownerEmail
          );
          
          if (existingUser) {
            userId = existingUser[0];
            console.log('✅ Found existing owner ID:', userId);
            return {
              success: true,
              message: 'Owner account already exists and database is fully set up',
              userId,
            };
          }
        }
        
        throw new Error('Owner exists in Authentication but not in Database. Try manual setup.');
      }
      throw authError;
    }

    // Step 2: Create owner profile in database
    console.log('💾 Creating owner profile...');
    
    const ownerData: User = {
      id: userId,
      email: ownerEmail,
      role: UserRole.OWNER,
      firstName: 'Karthik',
      lastName: 'Voorugonda',
      phone: '+91 9866007477',
      address: '#18-7-123, Ashok Nagar, Kareemabad',
      city: 'Warangal',
      state: 'Telangana',
      zipCode: '506002',
      country: 'India',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(ref(database, `users/${userId}`), ownerData);
    console.log('✅ Owner profile created');

    // Step 3: Initialize database structure with all endpoints
    console.log('📁 Creating database structure...');
    
    // Create users endpoint (already has owner)
    const usersSnapshot = await get(ref(database, 'users'));
    if (!usersSnapshot.exists()) {
      await set(ref(database, 'users'), {});
    }

    // Create generators endpoint with sample data
    console.log('⚙️  Creating generators endpoint...');
    const generators = createSampleGenerators();
    await set(ref(database, 'generators'), generators);

    // Create spare parts endpoint with sample data
    console.log('🔧 Creating spare parts endpoint...');
    const spareParts = createSampleSpareParts();
    await set(ref(database, 'spareParts'), spareParts);

    // Create leases endpoint (empty - will be filled by customers)
    console.log('📋 Creating leases endpoint...');
    await set(ref(database, 'leases'), {});

    // Create purchases endpoint (empty)
    console.log('📦 Creating purchases endpoint...');
    await set(ref(database, 'purchases'), {});

    // Create services endpoint (empty)
    console.log('🔧 Creating services endpoint...');
    await set(ref(database, 'services'), {});

    // Create spare part orders endpoint (empty)
    console.log('🛒 Creating spare part orders endpoint...');
    await set(ref(database, 'sparePartOrders'), {});

    // Create cart endpoint (for persistent carts)
    console.log('🛒 Creating cart endpoint...');
    await set(ref(database, 'carts'), {});

    // Create settings endpoint
    console.log('⚙️  Creating settings endpoint...');
    const settings = createSettings();
    await set(ref(database, 'settings'), settings);

    console.log('🎉 Database setup completed successfully!');

    return {
      success: true,
      message: 'Database setup completed! All endpoints created with sample data.',
      userId,
    };

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return {
      success: false,
      message: `Setup failed: ${(error as Error).message}`,
    };
  }
}

/**
 * Create owner profile for existing auth account
 */
export async function createOwnerProfileForExistingAuth(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('💾 Creating owner profile for existing auth account...');
    
    const ownerData: User = {
      id: userId,
      email: 'voorugondakarthik@gmail.com',
      role: UserRole.OWNER,
      firstName: 'Karthik',
      lastName: 'Voorugonda',
      phone: '+91 9866007477',
      address: '#18-7-123, Ashok Nagar, Kareemabad',
      city: 'Warangal',
      state: 'Telangana',
      zipCode: '506002',
      country: 'India',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(ref(database, `users/${userId}`), ownerData);
    console.log('✅ Owner profile created successfully');

    // Also create all endpoints if they don't exist
    await set(ref(database, 'generators'), createSampleGenerators());
    await set(ref(database, 'spareParts'), createSampleSpareParts());
    await set(ref(database, 'leases'), {});
    await set(ref(database, 'purchases'), {});
    await set(ref(database, 'services'), {});
    await set(ref(database, 'sparePartOrders'), {});
    await set(ref(database, 'carts'), {});
    await set(ref(database, 'settings'), createSettings());

    return {
      success: true,
      message: 'Owner profile and all database endpoints created successfully',
    };

  } catch (error) {
    console.error('❌ Failed to create owner profile:', error);
    return {
      success: false,
      message: `Failed to create profile: ${(error as Error).message}`,
    };
  }
}

/**
 * Create sample generators for the database
 */
function createSampleGenerators(): Record<string, Generator> {
  const generators: Record<string, Generator> = {};
  
  const sampleData = [
    {
      name: 'Honda EG2200 Series',
      model: 'EG2200',
      manufacturer: 'Honda',
      serialNumber: 'HND-EG2200-001',
      powerCapacityKW: 2.2,
      voltage: 230,
      phase: 1,
      fuelType: FuelType.PETROL,
      type: GeneratorType.PORTABLE,
      status: GeneratorStatus.AVAILABLE,
      year: 2024,
      hours: 0,
      description: 'Reliable and quiet portable generator, perfect for small businesses and events',
      specifications: {
        'Fuel Efficiency': 'Excellent',
        'Noise Level': '53 dB',
        'Dimensions': '545 × 407 × 442 mm',
        'Weight': '24 kg',
        'Runtime': '8 hours',
      },
      imageUrls: ['https://via.placeholder.com/400x300?text=Honda+EG2200'],
      purchasePrice: 85000,
      salePrice: 85000,
      dailyLeaseRate: 500,
      weeklyLeaseRate: 3000,
      monthlyLeaseRate: 12000,
      location: 'Warangal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      name: 'Yamaha EF2200 Series',
      model: 'EF2200',
      manufacturer: 'Yamaha',
      serialNumber: 'YAM-EF2200-001',
      powerCapacityKW: 2.2,
      voltage: 230,
      phase: 1,
      fuelType: FuelType.PETROL,
      type: GeneratorType.PORTABLE,
      status: GeneratorStatus.AVAILABLE,
      year: 2024,
      hours: 0,
      description: 'Premium portable generator with excellent fuel efficiency',
      specifications: {
        'Fuel Efficiency': 'Ultra-efficient',
        'Noise Level': '49 dB',
        'Dimensions': '545 × 405 × 440 mm',
        'Weight': '24 kg',
        'Runtime': '12 hours',
      },
      imageUrls: ['https://via.placeholder.com/400x300?text=Yamaha+EF2200'],
      purchasePrice: 95000,
      salePrice: 95000,
      dailyLeaseRate: 550,
      weeklyLeaseRate: 3300,
      monthlyLeaseRate: 13200,
      location: 'Warangal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      name: 'Kirloskar Koel Green',
      model: 'Koel-Green',
      manufacturer: 'Kirloskar',
      serialNumber: 'KIR-KOEL-001',
      powerCapacityKW: 5,
      voltage: 230,
      phase: 1,
      fuelType: FuelType.PETROL,
      type: GeneratorType.PORTABLE,
      status: GeneratorStatus.AVAILABLE,
      year: 2024,
      hours: 0,
      description: 'Eco-friendly portable generator with electric start',
      specifications: {
        'Fuel Efficiency': 'Good',
        'Noise Level': '65 dB',
        'Dimensions': '700 × 550 × 600 mm',
        'Weight': '60 kg',
        'Runtime': '10 hours',
      },
      imageUrls: ['https://via.placeholder.com/400x300?text=Kirloskar+Koel'],
      purchasePrice: 150000,
      salePrice: 150000,
      dailyLeaseRate: 800,
      weeklyLeaseRate: 4800,
      monthlyLeaseRate: 20000,
      location: 'Warangal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      name: 'Mahindra TRON 3000',
      model: 'TRON-3000',
      manufacturer: 'Mahindra',
      serialNumber: 'MAH-TRON-001',
      powerCapacityKW: 3,
      voltage: 230,
      phase: 1,
      fuelType: FuelType.PETROL,
      type: GeneratorType.PORTABLE,
      status: GeneratorStatus.AVAILABLE,
      year: 2024,
      hours: 0,
      description: 'Durable portable generator with electric start technology',
      specifications: {
        'Fuel Efficiency': 'Good',
        'Noise Level': '67 dB',
        'Dimensions': '650 × 500 × 550 mm',
        'Weight': '45 kg',
        'Runtime': '9 hours',
      },
      imageUrls: ['https://via.placeholder.com/400x300?text=Mahindra+TRON'],
      purchasePrice: 120000,
      salePrice: 120000,
      dailyLeaseRate: 700,
      weeklyLeaseRate: 4200,
      monthlyLeaseRate: 16000,
      location: 'Warangal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      name: 'Greaves Cotton PowerPro',
      model: 'PowerPro-4000',
      manufacturer: 'Greaves Cotton',
      serialNumber: 'GRE-PWR-001',
      powerCapacityKW: 4,
      voltage: 230,
      phase: 1,
      fuelType: FuelType.DIESEL,
      type: GeneratorType.PORTABLE,
      status: GeneratorStatus.AVAILABLE,
      year: 2024,
      hours: 0,
      description: 'High-power portable diesel generator for heavy-duty use',
      specifications: {
        'Fuel Efficiency': 'Excellent',
        'Noise Level': '72 dB',
        'Dimensions': '800 × 600 × 700 mm',
        'Weight': '120 kg',
        'Runtime': '15 hours',
      },
      imageUrls: ['https://via.placeholder.com/400x300?text=Greaves+PowerPro'],
      purchasePrice: 180000,
      salePrice: 180000,
      dailyLeaseRate: 1000,
      weeklyLeaseRate: 6000,
      monthlyLeaseRate: 24000,
      location: 'Warangal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  sampleData.forEach((data, index) => {
    const id = `gen_${index + 1}`;
    generators[id] = {
      id,
      ...data,
    };
  });

  return generators;
}

/**
 * Create sample spare parts for the database
 */
function createSampleSpareParts(): Record<string, SparePart> {
  const spareParts: Record<string, SparePart> = {};
  
  const sampleData: Array<Omit<SparePart, 'id' | 'createdAt' | 'updatedAt'>> = [
    {
      partNumber: 'OF-001',
      name: 'Oil Filter',
      description: 'Premium oil filter for Honda generators',
      category: PartCategory.FILTERS,
      manufacturer: 'Honda',
      compatibleModels: ['Honda EG2200', 'Honda EG3000'],
      price: 150,
      stock: 50,
      stockQuantity: 50,
      minimumOrderQuantity: 1,
      status: PartStatus.IN_STOCK,
      weight: 0.2,
      dimensions: '10 × 8 × 8 cm',
      warrantyMonths: 12,
      imageUrl: 'https://via.placeholder.com/300x300?text=Oil+Filter',
      imageUrls: ['https://via.placeholder.com/300x300?text=Oil+Filter'],
      specifications: {
        'Type': 'Oil Filter',
        'Fit': 'Honda Generators',
        'Thread': 'M14',
      },
    },
    {
      partNumber: 'AF-002',
      name: 'Air Filter',
      description: 'Replacement air filter for Yamaha generators',
      category: PartCategory.FILTERS,
      manufacturer: 'Yamaha',
      compatibleModels: ['Yamaha EF2200', 'Yamaha EF3000'],
      price: 200,
      stock: 40,
      stockQuantity: 40,
      minimumOrderQuantity: 1,
      status: PartStatus.IN_STOCK,
      weight: 0.15,
      dimensions: '12 × 10 × 10 cm',
      warrantyMonths: 12,
      imageUrl: 'https://via.placeholder.com/300x300?text=Air+Filter',
      imageUrls: ['https://via.placeholder.com/300x300?text=Air+Filter'],
      specifications: {
        'Type': 'Air Filter',
        'Fit': 'Yamaha Generators',
      },
    },
    {
      partNumber: 'SP-003',
      name: 'Spark Plug',
      description: 'Universal spark plug for all portable generators',
      category: PartCategory.ELECTRICAL,
      manufacturer: 'Universal',
      compatibleModels: ['All Portable Generators'],
      price: 100,
      stock: 100,
      stockQuantity: 100,
      minimumOrderQuantity: 1,
      status: PartStatus.IN_STOCK,
      weight: 0.05,
      dimensions: '3 × 3 × 3 cm',
      warrantyMonths: 6,
      imageUrl: 'https://via.placeholder.com/300x300?text=Spark+Plug',
      imageUrls: ['https://via.placeholder.com/300x300?text=Spark+Plug'],
      specifications: {
        'Type': 'Spark Plug',
        'Gap': '0.7-0.8 mm',
      },
    },
    {
      partNumber: 'BAT-004',
      name: 'Battery',
      description: '12V battery for electric start generators',
      category: PartCategory.BATTERIES,
      manufacturer: 'Kirloskar',
      compatibleModels: ['Kirloskar Koel', 'Mahindra TRON', 'Greaves Cotton PowerPro'],
      price: 2000,
      stock: 20,
      stockQuantity: 20,
      minimumOrderQuantity: 1,
      status: PartStatus.IN_STOCK,
      weight: 1.5,
      dimensions: '15 × 10 × 10 cm',
      warrantyMonths: 24,
      imageUrl: 'https://via.placeholder.com/300x300?text=Battery',
      imageUrls: ['https://via.placeholder.com/300x300?text=Battery'],
      specifications: {
        'Type': 'Lead Acid Battery',
        'Voltage': '12V',
        'Capacity': '7Ah',
      },
    },
    {
      partNumber: 'FF-005',
      name: 'Fuel Filter',
      description: 'Universal fuel filter for gasoline and diesel generators',
      category: PartCategory.FUEL_SYSTEM,
      manufacturer: 'Universal',
      compatibleModels: ['All Generators'],
      price: 120,
      stock: 60,
      stockQuantity: 60,
      minimumOrderQuantity: 1,
      status: PartStatus.IN_STOCK,
      weight: 0.1,
      dimensions: '8 × 8 × 8 cm',
      warrantyMonths: 12,
      imageUrl: 'https://via.placeholder.com/300x300?text=Fuel+Filter',
      imageUrls: ['https://via.placeholder.com/300x300?text=Fuel+Filter'],
      specifications: {
        'Type': 'Fuel Filter',
      },
    },
    {
      partNumber: 'CB-006',
      name: 'Carburetor',
      description: 'Replacement carburetor for Honda generators',
      category: PartCategory.ENGINE,
      manufacturer: 'Honda',
      compatibleModels: ['Honda EG2200', 'Honda EG3000'],
      price: 1500,
      stock: 15,
      stockQuantity: 15,
      minimumOrderQuantity: 1,
      status: PartStatus.IN_STOCK,
      weight: 0.5,
      dimensions: '15 × 12 × 10 cm',
      warrantyMonths: 12,
      imageUrl: 'https://via.placeholder.com/300x300?text=Carburetor',
      imageUrls: ['https://via.placeholder.com/300x300?text=Carburetor'],
      specifications: {
        'Type': 'Carburetor',
      },
    },
    {
      partNumber: 'ALT-007',
      name: 'Alternator',
      description: 'Replacement alternator for Yamaha generators',
      category: PartCategory.ELECTRICAL,
      manufacturer: 'Yamaha',
      compatibleModels: ['Yamaha EF2200', 'Yamaha EF3000'],
      price: 5000,
      stock: 8,
      stockQuantity: 8,
      minimumOrderQuantity: 1,
      status: PartStatus.LOW_STOCK,
      weight: 2,
      dimensions: '20 × 18 × 15 cm',
      warrantyMonths: 24,
      imageUrl: 'https://via.placeholder.com/300x300?text=Alternator',
      imageUrls: ['https://via.placeholder.com/300x300?text=Alternator'],
      specifications: {
        'Type': 'Alternator',
        'Output': '2200W',
      },
    },
    {
      partNumber: 'OIL-008',
      name: 'Engine Oil (1L)',
      description: 'Premium engine oil for generators',
      category: PartCategory.ENGINE,
      manufacturer: 'Shell',
      compatibleModels: ['All Generators'],
      price: 400,
      stock: 80,
      stockQuantity: 80,
      minimumOrderQuantity: 1,
      status: PartStatus.IN_STOCK,
      weight: 1,
      dimensions: '10 × 10 × 15 cm',
      warrantyMonths: 0,
      imageUrl: 'https://via.placeholder.com/300x300?text=Engine+Oil',
      imageUrls: ['https://via.placeholder.com/300x300?text=Engine+Oil'],
      specifications: {
        'Type': 'Engine Oil',
        'Grade': 'SAE 10W-30',
        'Volume': '1L',
      },
    },
  ];

  sampleData.forEach((data, index) => {
    const id = `sp_${index + 1}`;
    spareParts[id] = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  return spareParts;
}

/**
 * Create application settings
 */
function createSettings(): Record<string, any> {
  return {
    company: {
      name: 'GenPower',
      email: 'voorugondakarthik@gmail.com',
      phone: '+91 9866007477',
      address: '#18-7-123, Ashok Nagar, Kareemabad, Warangal, Telangana - 506002, India',
      website: 'https://genpower.local',
    },
    tax: {
      gst: 18,
      country: 'India',
      currency: 'INR',
    },
    features: {
      enableLease: true,
      enablePurchase: true,
      enableService: true,
      enableSpareParts: true,
    },
    lastUpdated: new Date().toISOString(),
  };
}
