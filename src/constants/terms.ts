// Official GenPower Terms and Conditions & Service Discount Policy

export interface ServiceTierDiscount {
  tierNumber: number;
  serviceRange: string;
  name: string;
  discountPercentage: number;
  laborCharge: string;
  equipmentCost: string;
  description: string;
}

export const SERVICE_DISCOUNT_TIERS: ServiceTierDiscount[] = [
  {
    tierNumber: 1,
    serviceRange: 'Services 1 & 2',
    name: 'Free Routine Maintenance Tier',
    discountPercentage: 100, // 100% discount on labor
    laborCharge: 'FREE (100% Waived)',
    equipmentCost: 'Borne / Imposed on Customer',
    description:
      'First two routine maintenance services are free of labor charges. Cost of all equipment, spare parts, engine oil, filters, and consumables must be borne by the customer.',
  },
  {
    tierNumber: 2,
    serviceRange: 'Services 3, 4 & 5',
    name: 'Tier-1 Paid Service (First 3 Paid)',
    discountPercentage: 20,
    laborCharge: '20% DISCOUNT',
    equipmentCost: 'Borne / Imposed on Customer',
    description:
      'Next three consecutive paid maintenance services receive a 20% discount on standard technician labor and service fees. Equipment and component costs apply.',
  },
  {
    tierNumber: 3,
    serviceRange: 'Services 6, 7 & 8',
    name: 'Tier-2 Paid Service (Next 3 Paid)',
    discountPercentage: 10,
    laborCharge: '10% DISCOUNT',
    equipmentCost: 'Borne / Imposed on Customer',
    description:
      'Subsequent three paid services receive a 10% discount on standard technician labor and service fees. Equipment and component costs apply.',
  },
  {
    tierNumber: 4,
    serviceRange: 'Services 9 and Beyond',
    name: 'Standard Commercial Tier',
    discountPercentage: 0,
    laborCharge: 'STANDARD RATE (0% Discount)',
    equipmentCost: 'Borne / Imposed on Customer',
    description:
      'From the 9th service onward, standard commercial labor charges and full equipment/spares pricing apply.',
  },
];

export const TERMS_AND_CONDITIONS = {
  version: '2.0.26',
  effectiveDate: 'September 2026',
  companyName: 'GenPower Solutions Private Limited',
  gstin: '36AAACG1234F1Z8',
  supportContact: '+91 98660 07477',
  supportEmail: 'voorugondakarthik@gmail.com',
  registeredAddress: '#18-7-123, Ashok Nagar, Kareemabad, Warangal, Telangana - 506002, India',
  
  summaryPoints: [
    'STRICT NON-REFUNDABLE POLICY: Once an order is confirmed, money is non-refundable and goods are strictly non-returnable under any circumstance.',
    'REPAIR & MAINTENANCE ONLY: In the event of defects, breakdowns, or operational issues, authorized repairs and parts replacements will be executed by GenPower certified technicians. Goods will not be returned.',
    'TWO (2) FREE ROUTINE SERVICES: Every generator purchase includes two free labor routine maintenance visits within the service period.',
    'EQUIPMENT & CONSUMABLES CHARGEABLE: For all maintenance visits (including the two free services), the costs of replacement equipment, parts, lubricants, filters, and consumables must be borne by the customer.',
    'TIERED PAID SERVICE DISCOUNTS: After completing the 2 free services, the 1st three paid services (Services 3, 4, 5) get a 20% discount; the next three paid services (Services 6, 7, 8) get a 10% discount; after that, zero discount (standard rate).',
    'MANDATORY AGREEMENT: Customers must read and agree to these terms before submitting purchase, lease, or spare parts orders.',
  ],

  clauses: [
    {
      id: 'clause-1',
      title: '1. Strict Non-Returnable & Non-Refundable Policy',
      content:
        'All purchases, leases, spare part orders, and service contracts placed on GenPower are definitive and irrevocable. Once an order is placed and processed, money is strictly non-refundable and goods/products are strictly non-returnable under any circumstance. Customers are advised to review product specifications, power ratings, fuel types, and dimensions prior to confirming checkout.',
    },
    {
      id: 'clause-2',
      title: '2. Repair and Maintenance Warranty Protocol',
      content:
        'In lieu of returns or refunds, GenPower guarantees professional repair and maintenance support. In the event of mechanical fault, manufacturer defect, or performance anomalies, GenPower will dispatch certified technicians to inspect, service, or repair the unit. Under no circumstances will a replacement product or cash refund be issued for ordered products. All warranty remedies are limited strictly to inspection, labor servicing, and component repair or replacement.',
    },
    {
      id: 'clause-3',
      title: '3. Two (2) Free Maintenance Services & Equipment Cost Allocation',
      content:
        'Every generator purchase comes with entitlement to two (2) complimentary routine maintenance services scheduled within the first 12 months from delivery. While labor and routine technician inspection fees are completely waived (100% free) for these two visits, all equipment costs, spare parts, engine oils, air/oil filters, spark plugs, coolants, wiring, and other consumable materials required during service are strictly chargeable and must be paid/borne by the customer.',
    },
    {
      id: 'clause-4',
      title: '4. Tiered Paid Service Discount Structure',
      content:
        'Upon the completion of the two complimentary maintenance visits, subsequent paid maintenance calls are governed by GenPower\'s structured loyalty discount tiers:\n' +
        '• Tier 1 (Services 3, 4, and 5): The first three paid services qualify for a 20% discount on standard technician labor fees.\n' +
        '• Tier 2 (Services 6, 7, and 8): The subsequent three paid services qualify for a 10% discount on standard technician labor fees.\n' +
        '• Tier 3 (Services 9 and onward): Standard prevailing commercial labor rates apply with 0% discount.\n' +
        'Note: Discounts apply solely to labor/service fees; parts and equipment costs remain payable at standard rates.',
    },
    {
      id: 'clause-5',
      title: '5. Customer Operating Obligations & Site Readiness',
      content:
        'The customer is responsible for maintaining appropriate operating conditions, including adequate ventilation, sound dampening compliant with local bylaws, clean fuel free from contaminants, and adhering strictly to generator electrical load capacity limits. Negligence, unapproved third-party modifications, bad fuel, or overloading voids warranty repair coverage.',
    },
    {
      id: 'clause-6',
      title: '6. Delivery, Logistics & Breakdown Dispatch',
      content:
        'GenPower endeavors to complete deliveries within scheduled dispatch windows (typically 7-10 business days for generators, 2-5 days for spare parts). For reported breakdowns, technicians will be scheduled within 24 to 48 business hours subject to site access and regional transit conditions.',
    },
    {
      id: 'clause-7',
      title: '7. Legal Jurisdiction & Dispute Resolution',
      content:
        'All agreements, transactions, and disputes arising out of or related to GenPower products and services shall be governed exclusively by the laws of India and subject to the jurisdiction of courts in Warangal / Hyderabad, Telangana.',
    },
  ],
};
