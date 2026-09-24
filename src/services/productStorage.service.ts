import { ref, get, set, remove } from 'firebase/database';
import { database } from './firebase.service';
import { mockDataService } from './mockData.service';
import { Generator, SparePart, UnifiedOrder, UnifiedOrderStatus } from '../types';
import { termsPdfService, StoredTermsDocument } from './termsPdfService';

const STORAGE_KEYS = {
  GENERATORS: 'genpower_generators',
  SPARE_PARTS: 'genpower_spare_parts',
  ORDERS: 'genpower_orders',
  TERMS_DOCUMENT: 'genpower_terms_document',
};

class ProductStorageService {
  // ================= GENERATORS =================
  getGenerators(): Generator[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GENERATORS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading generators from localStorage:', e);
    }

    // Default to mock data
    const initial = mockDataService.generateGenerators();
    this.saveGeneratorsToLocal(initial);
    return initial;
  }

  async getGeneratorsAsync(): Promise<Generator[]> {
    const localGens = this.getGenerators();
    try {
      if (database) {
        const snapshot = await get(ref(database, 'generators'));
        if (snapshot.exists()) {
          const val = snapshot.val();
          const remoteList: Generator[] = Array.isArray(val)
            ? val.filter(Boolean)
            : Object.values(val);
          if (remoteList.length > 0) {
            const map = new Map<string, Generator>();
            remoteList.forEach((g) => map.set(g.id, g));
            localGens.forEach((g) => {
              if (!map.has(g.id)) {
                map.set(g.id, g);
                set(ref(database, `generators/${g.id}`), g).catch(() => {});
              }
            });
            const merged = Array.from(map.values());
            this.saveGeneratorsToLocal(merged);
            return merged;
          }
        } else {
          for (const g of localGens) {
            set(ref(database, `generators/${g.id}`), g).catch(() => {});
          }
        }
      }
    } catch (fbErr) {
      console.warn('Firebase generators fetch warning (using local):', fbErr);
    }
    return localGens;
  }

  saveGeneratorsToLocal(generators: Generator[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GENERATORS, JSON.stringify(generators));
    } catch (e) {
      console.error('Failed to save generators to localStorage', e);
    }
  }

  async saveGenerator(generator: Generator): Promise<Generator> {
    const generators = this.getGenerators();
    const existingIndex = generators.findIndex((g) => g.id === generator.id);
    const updatedGen = {
      ...generator,
      updatedAt: new Date().toISOString(),
      createdAt: generator.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      generators[existingIndex] = updatedGen;
    } else {
      generators.unshift(updatedGen);
    }

    this.saveGeneratorsToLocal(generators);

    // Sync to Firebase if online
    try {
      if (database) {
        await set(ref(database, `generators/${updatedGen.id}`), updatedGen);
      }
    } catch (fbErr) {
      console.warn('Firebase sync warning (generator saved locally):', fbErr);
    }

    return updatedGen;
  }

  async deleteGenerator(id: string): Promise<void> {
    const generators = this.getGenerators().filter((g) => g.id !== id);
    this.saveGeneratorsToLocal(generators);

    try {
      if (database) {
        await remove(ref(database, `generators/${id}`));
      }
    } catch (fbErr) {
      console.warn('Firebase delete warning:', fbErr);
    }
  }

  // ================= SPARE PARTS =================
  getSpareParts(): SparePart[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SPARE_PARTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading spare parts from localStorage:', e);
    }

    const initial = mockDataService.generateSpareParts();
    this.saveSparePartsToLocal(initial);
    return initial;
  }

  async getSparePartsAsync(): Promise<SparePart[]> {
    const localParts = this.getSpareParts();
    try {
      if (database) {
        const snapshot = await get(ref(database, 'spareParts'));
        if (snapshot.exists()) {
          const val = snapshot.val();
          const remoteList: SparePart[] = Array.isArray(val)
            ? val.filter(Boolean)
            : Object.values(val);
          if (remoteList.length > 0) {
            const map = new Map<string, SparePart>();
            remoteList.forEach((p) => map.set(p.id, p));
            localParts.forEach((p) => {
              if (!map.has(p.id)) {
                map.set(p.id, p);
                set(ref(database, `spareParts/${p.id}`), p).catch(() => {});
              }
            });
            const merged = Array.from(map.values());
            this.saveSparePartsToLocal(merged);
            return merged;
          }
        } else {
          for (const p of localParts) {
            set(ref(database, `spareParts/${p.id}`), p).catch(() => {});
          }
        }
      }
    } catch (fbErr) {
      console.warn('Firebase spare parts fetch warning (using local):', fbErr);
    }
    return localParts;
  }

  saveSparePartsToLocal(parts: SparePart[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SPARE_PARTS, JSON.stringify(parts));
    } catch (e) {
      console.error('Failed to save spare parts to localStorage', e);
    }
  }

  async saveSparePart(part: SparePart): Promise<SparePart> {
    const parts = this.getSpareParts();
    const existingIndex = parts.findIndex((p) => p.id === part.id);
    const updatedPart = {
      ...part,
      updatedAt: new Date().toISOString(),
      createdAt: part.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      parts[existingIndex] = updatedPart;
    } else {
      parts.unshift(updatedPart);
    }

    this.saveSparePartsToLocal(parts);

    try {
      if (database) {
        await set(ref(database, `spareParts/${updatedPart.id}`), updatedPart);
      }
    } catch (fbErr) {
      console.warn('Firebase sync warning (part saved locally):', fbErr);
    }

    return updatedPart;
  }

  async deleteSparePart(id: string): Promise<void> {
    const parts = this.getSpareParts().filter((p) => p.id !== id);
    this.saveSparePartsToLocal(parts);

    try {
      if (database) {
        await remove(ref(database, `spareParts/${id}`));
      }
    } catch (fbErr) {
      console.warn('Firebase delete warning:', fbErr);
    }
  }

  // ================= ORDERS =================
  getOrders(): UnifiedOrder[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage:', e);
    }

    const initial = this.generateInitialOrders();
    this.saveOrdersToLocal(initial);
    return initial;
  }

  async getOrdersAsync(): Promise<UnifiedOrder[]> {
    const localOrders = this.getOrders();
    try {
      if (database) {
        const snapshot = await get(ref(database, 'orders'));
        if (snapshot.exists()) {
          const val = snapshot.val();
          const remoteList: UnifiedOrder[] = Array.isArray(val)
            ? val.filter(Boolean)
            : Object.values(val);
          if (remoteList.length > 0) {
            const map = new Map<string, UnifiedOrder>();
            remoteList.forEach((o) => map.set(o.id, o));
            localOrders.forEach((o) => {
              if (!map.has(o.id)) {
                map.set(o.id, o);
                set(ref(database, `orders/${o.id}`), o).catch(() => {});
              }
            });
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            this.saveOrdersToLocal(merged);
            return merged;
          }
        } else {
          for (const o of localOrders) {
            set(ref(database, `orders/${o.id}`), o).catch(() => {});
          }
        }
      }
    } catch (fbErr) {
      console.warn('Firebase orders fetch warning (using local):', fbErr);
    }
    return localOrders;
  }

  saveOrdersToLocal(orders: UnifiedOrder[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }

  async saveOrder(order: UnifiedOrder): Promise<UnifiedOrder> {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex((o) => o.id === order.id);
    const updatedOrder = {
      ...order,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      orders[existingIndex] = updatedOrder;
    } else {
      orders.unshift(updatedOrder);
    }

    this.saveOrdersToLocal(orders);

    try {
      if (database) {
        await set(ref(database, `orders/${updatedOrder.id}`), updatedOrder);
      }
    } catch (fbErr) {
      console.warn('Firebase order sync warning:', fbErr);
    }

    return updatedOrder;
  }

  async updateOrderStatus(
    orderId: string,
    status: UnifiedOrderStatus,
    trackingNumber?: string
  ): Promise<UnifiedOrder> {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    order.status = status;
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }
    order.updatedAt = new Date().toISOString();

    this.saveOrdersToLocal(orders);

    try {
      if (database) {
        await set(ref(database, `orders/${order.id}`), order);
      }
    } catch (fbErr) {
      console.warn('Firebase order status sync warning:', fbErr);
    }

    return order;
  }

  private generateInitialOrders(): UnifiedOrder[] {
    const now = new Date();
    return [
      {
        id: 'ord-9381',
        orderNumber: 'GP-ORD-2026-9381',
        orderType: 'spare_parts',
        customerId: 'cust-voorugonda',
        customerName: 'Voorugonda Karthik',
        customerEmail: 'voorugondakarthik@gmail.com',
        customerPhone: '+91 98490 12345',
        items: [
          {
            id: 'part-greaves-battery',
            name: 'Greaves Battery',
            modelOrPartNumber: 'PN-GRV-BAT-01',
            category: 'Spare Parts',
            imageUrl: 'https://images.unsplash.com/photo-1581092918484-8299f8c53e8c?w=400&h=400&fit=crop',
            unitPrice: 3774,
            quantity: 1,
            totalPrice: 3774,
          },
        ],
        subtotal: 3774,
        taxAmount: 679,
        shippingOrInstallationAmount: 0,
        totalAmount: 4453,
        shippingAddress: {
          street: 'Vasanthapur, వసంతపూర్',
          city: 'Vasanthapur',
          state: 'Telangana',
          pincode: '506220',
          country: 'India',
        },
        paymentMethod: 'UPI',
        paymentStatus: 'paid',
        status: 'processing',
        trackingNumber: 'DTDC-9381-IN',
        notes: 'Greaves Battery spare part replacement order.',
        termsAccepted: true,
        termsAcceptedAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
        termsVersion: '1.0.0',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: 'ord-1001',
        orderNumber: 'GP-ORD-2026-1001',
        orderType: 'generator_purchase',
        customerId: 'cust-1',
        customerName: 'Rajesh Sharma',
        customerEmail: 'rajesh.sharma@example.com',
        customerPhone: '+91 98450 12345',
        items: [
          {
            id: 'gen-1',
            name: 'Honda EP2500 2kW',
            modelOrPartNumber: 'EP2500',
            category: 'Generators',
            imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
            unitPrice: 24000,
            quantity: 1,
            totalPrice: 24000,
            specifications: {
              'Power': '2kW',
              'Fuel': 'Petrol',
              'Voltage': '230V',
            },
          },
        ],
        subtotal: 24000,
        taxAmount: 4320,
        shippingOrInstallationAmount: 5000,
        totalAmount: 33320,
        shippingAddress: {
          street: '42, MG Road, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038',
          country: 'India',
        },
        paymentMethod: 'UPI',
        paymentStatus: 'paid',
        status: 'shipped',
        trackingNumber: 'DTDC-88492019',
        notes: 'Please call before arrival for installation.',
        createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - 86400000).toISOString(),
      },
      {
        id: 'ord-1002',
        orderNumber: 'GP-ORD-2026-1002',
        orderType: 'spare_parts',
        customerId: 'cust-2',
        customerName: 'Priya Patel',
        customerEmail: 'priya.patel@example.com',
        customerPhone: '+91 99220 54321',
        items: [
          {
            id: 'part-1',
            name: 'Honda Oil Filter',
            modelOrPartNumber: 'PN00010000',
            category: 'Filters',
            imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
            unitPrice: 500,
            quantity: 3,
            totalPrice: 1500,
          },
          {
            id: 'part-4',
            name: 'Yamaha Spark Plug',
            modelOrPartNumber: 'PN00010003',
            category: 'Electrical',
            imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop',
            unitPrice: 950,
            quantity: 2,
            totalPrice: 1900,
          },
        ],
        subtotal: 3400,
        taxAmount: 612,
        shippingOrInstallationAmount: 500,
        totalAmount: 4512,
        shippingAddress: {
          street: '15, Park Avenue, Navrangpura',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380009',
          country: 'India',
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        status: 'processing',
        trackingNumber: 'BLUEDART-542190',
        notes: 'Deliver during daytime business hours.',
        createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - 43200000).toISOString(),
      },
      {
        id: 'ord-1003',
        orderNumber: 'GP-ORD-2026-1003',
        orderType: 'generator_lease',
        customerId: 'cust-3',
        customerName: 'Vikram Reddy',
        customerEmail: 'vikram.reddy@example.com',
        customerPhone: '+91 97000 88221',
        items: [
          {
            id: 'gen-3',
            name: 'Kirloskar KG1-3AS 5kW',
            modelOrPartNumber: 'KG1-3AS',
            category: 'Generators',
            imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
            unitPrice: 6000, // weekly rate
            quantity: 1,
            totalPrice: 6000,
            specifications: {
              'Power': '5kW',
              'Fuel': 'Diesel',
              'Lease Duration': '1 Week',
            },
          },
        ],
        subtotal: 6000,
        taxAmount: 1080,
        shippingOrInstallationAmount: 2000,
        totalAmount: 9080,
        shippingAddress: {
          street: 'Site 8, Hitech City Phase 2',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500081',
          country: 'India',
        },
        paymentMethod: 'Net Banking',
        paymentStatus: 'paid',
        status: 'pending',
        notes: 'Temporary power needed for construction testing next Monday.',
        createdAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
        updatedAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
      },
      {
        id: 'ord-1004',
        orderNumber: 'GP-ORD-2026-1004',
        orderType: 'generator_purchase',
        customerId: 'cust-4',
        customerName: 'Ananya Deshmukh',
        customerEmail: 'ananya.d@example.com',
        customerPhone: '+91 98230 44112',
        items: [
          {
            id: 'gen-2',
            name: 'Yamaha EF3000iSEB 3kW',
            modelOrPartNumber: 'EF3000iSEB',
            category: 'Generators',
            imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=600&fit=crop',
            unitPrice: 36000,
            quantity: 1,
            totalPrice: 36000,
            specifications: {
              'Power': '3kW',
              'Fuel': 'Petrol',
              'Inverter': 'Yes',
            },
          },
        ],
        subtotal: 36000,
        taxAmount: 6480,
        shippingOrInstallationAmount: 5000,
        totalAmount: 47480,
        shippingAddress: {
          street: 'Flat 402, Greenfield Residences, Kothrud',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411038',
          country: 'India',
        },
        paymentMethod: 'UPI',
        paymentStatus: 'paid',
        status: 'delivered',
        trackingNumber: 'DTDC-7739104',
        notes: 'Installation completed by technician Ramesh.',
        createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
      },
    ];
  }

  // ================= TERMS & CONDITIONS PDF =================
  async saveTermsDocument(document: StoredTermsDocument): Promise<StoredTermsDocument> {
    try {
      localStorage.setItem(STORAGE_KEYS.TERMS_DOCUMENT, JSON.stringify(document));
    } catch (e) {
      console.warn('Failed to save terms document to localStorage:', e);
    }

    try {
      if (database) {
        await set(ref(database, 'terms_conditions/latest'), document);
      }
    } catch (fbErr) {
      console.warn('Firebase terms document sync warning:', fbErr);
    }

    return document;
  }

  async getTermsDocument(): Promise<StoredTermsDocument> {
    // 1. Try local storage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TERMS_DOCUMENT);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.pdfDataUri) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading terms document from localStorage:', e);
    }

    // 2. Try Firebase Realtime Database
    try {
      if (database) {
        const snapshot = await get(ref(database, 'terms_conditions/latest'));
        if (snapshot.exists()) {
          const remoteDoc = snapshot.val() as StoredTermsDocument;
          if (remoteDoc && remoteDoc.pdfDataUri) {
            localStorage.setItem(STORAGE_KEYS.TERMS_DOCUMENT, JSON.stringify(remoteDoc));
            return remoteDoc;
          }
        }
      }
    } catch (fbErr) {
      console.warn('Firebase read terms warning:', fbErr);
    }

    // 3. Fallback: Generate fresh document and push to Realtime Database & local storage
    const newDoc = termsPdfService.createDocumentRecord();
    await this.saveTermsDocument(newDoc);
    return newDoc;
  }
}

export const productStorageService = new ProductStorageService();
