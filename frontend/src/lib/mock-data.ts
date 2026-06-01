export const DEMO_USERS = [
  {
    id: 'user-admin-001',
    email: 'admin@wms.local',
    password: 'admin123456',
    firstName: 'Admin',
    lastName: 'Warehouse',
    role: 'ADMIN_WAREHOUSE',
  },
  {
    id: 'user-mgr-001',
    email: 'manager@wms.local',
    password: 'admin123456',
    firstName: 'Manager',
    lastName: 'Warehouse',
    role: 'WAREHOUSE_MANAGER',
  },
  {
    id: 'user-staff-001',
    email: 'staff@wms.local',
    password: 'admin123456',
    firstName: 'Staff',
    lastName: 'Member',
    role: 'WAREHOUSE_STAFF',
  },
];

export const INITIAL_CATALOG = [
  {
    id: 'cat-001',
    name: 'INDIBA Activ CT9',
    description: 'Proionic radiofrequency device for physiotherapy and rehabilitation',
    category: 'Rehabilitation',
    unitOfMeasure: 'unit',
    imageUrl: null,
    createdBy: 'user-admin-001',
    updatedBy: null,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'cat-002',
    name: 'INDIBA Activ CT8',
    description: 'Compact radiofrequency system for sports medicine and recovery',
    category: 'Sports',
    unitOfMeasure: 'unit',
    imageUrl: null,
    createdBy: 'user-admin-001',
    updatedBy: null,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'cat-003',
    name: 'INDIBA Deep Beauty',
    description: 'Non-invasive radiofrequency for facial and body aesthetics',
    category: 'Aesthetics',
    unitOfMeasure: 'unit',
    imageUrl: null,
    createdBy: 'user-admin-001',
    updatedBy: null,
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
  },
  {
    id: 'cat-004',
    name: 'K-Laser Cube 4',
    description: 'High-power laser therapy device for pain management',
    category: 'Laser Therapy',
    unitOfMeasure: 'unit',
    imageUrl: null,
    createdBy: 'user-admin-001',
    updatedBy: null,
    createdAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-02-10T08:00:00.000Z',
  },
  {
    id: 'cat-005',
    name: 'INDIBA Animal Health AH-100',
    description: 'Veterinary radiofrequency device for animal rehabilitation',
    category: 'Animal Health',
    unitOfMeasure: 'unit',
    imageUrl: null,
    createdBy: 'user-admin-001',
    updatedBy: null,
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'cat-006',
    name: 'Capacitive Electrode 65mm',
    description: 'Replacement capacitive electrode for INDIBA Activ devices',
    category: 'Accessories',
    unitOfMeasure: 'piece',
    imageUrl: null,
    createdBy: 'user-admin-001',
    updatedBy: null,
    createdAt: '2026-03-05T08:00:00.000Z',
    updatedAt: '2026-03-05T08:00:00.000Z',
  },
  {
    id: 'cat-007',
    name: 'Resistive Electrode 45mm',
    description: 'Replacement resistive electrode for deep tissue treatment',
    category: 'Accessories',
    unitOfMeasure: 'piece',
    imageUrl: null,
    createdBy: 'user-admin-001',
    updatedBy: null,
    createdAt: '2026-03-05T08:00:00.000Z',
    updatedAt: '2026-03-05T08:00:00.000Z',
  },
  {
    id: 'cat-008',
    name: 'Proionic Cream 500ml',
    description: 'Conductive cream for radiofrequency treatments',
    category: 'Consumables',
    unitOfMeasure: 'bottle',
    imageUrl: null,
    createdBy: 'user-admin-001',
    updatedBy: null,
    createdAt: '2026-03-10T08:00:00.000Z',
    updatedAt: '2026-03-10T08:00:00.000Z',
  },
];

export const INITIAL_SKUS = [
  { id: 'sku-001', catalogItemId: 'cat-001', code: 'CT9-EU-220V', size: null, color: 'White', weight: 8.5 },
  { id: 'sku-002', catalogItemId: 'cat-001', code: 'CT9-US-110V', size: null, color: 'White', weight: 8.5 },
  { id: 'sku-003', catalogItemId: 'cat-002', code: 'CT8-EU-220V', size: null, color: 'White', weight: 6.2 },
  { id: 'sku-004', catalogItemId: 'cat-003', code: 'DB-PRO-EU', size: null, color: 'White', weight: 5.0 },
  { id: 'sku-005', catalogItemId: 'cat-004', code: 'KL-CUBE4-30W', size: null, color: 'Black', weight: 12.0 },
  { id: 'sku-006', catalogItemId: 'cat-005', code: 'AH100-VET-EU', size: null, color: 'White', weight: 7.8 },
  { id: 'sku-007', catalogItemId: 'cat-006', code: 'ELEC-CAP-65', size: '65mm', color: null, weight: 0.15 },
  { id: 'sku-008', catalogItemId: 'cat-006', code: 'ELEC-CAP-35', size: '35mm', color: null, weight: 0.10 },
  { id: 'sku-009', catalogItemId: 'cat-007', code: 'ELEC-RES-45', size: '45mm', color: null, weight: 0.18 },
  { id: 'sku-010', catalogItemId: 'cat-008', code: 'CREAM-PRO-500', size: '500ml', color: null, weight: 0.55 },
  { id: 'sku-011', catalogItemId: 'cat-008', code: 'CREAM-PRO-250', size: '250ml', color: null, weight: 0.30 },
];

export const INITIAL_INVENTORY = [
  { id: 'inv-001', skuId: 'sku-001', quantity: 24, location: 'Barcelona HQ - Zone A', lowStockThreshold: 5 },
  { id: 'inv-002', skuId: 'sku-002', quantity: 18, location: 'Barcelona HQ - Zone A', lowStockThreshold: 5 },
  { id: 'inv-003', skuId: 'sku-003', quantity: 12, location: 'Barcelona HQ - Zone A', lowStockThreshold: 5 },
  { id: 'inv-004', skuId: 'sku-004', quantity: 8, location: 'Barcelona HQ - Zone B', lowStockThreshold: 5 },
  { id: 'inv-005', skuId: 'sku-005', quantity: 3, location: 'Treviso Warehouse', lowStockThreshold: 5 },
  { id: 'inv-006', skuId: 'sku-006', quantity: 6, location: 'Treviso Warehouse', lowStockThreshold: 3 },
  { id: 'inv-007', skuId: 'sku-007', quantity: 150, location: 'Barcelona HQ - Accessories', lowStockThreshold: 20 },
  { id: 'inv-008', skuId: 'sku-008', quantity: 85, location: 'Barcelona HQ - Accessories', lowStockThreshold: 20 },
  { id: 'inv-009', skuId: 'sku-009', quantity: 12, location: 'Barcelona HQ - Accessories', lowStockThreshold: 20 },
  { id: 'inv-010', skuId: 'sku-010', quantity: 320, location: 'Barcelona HQ - Consumables', lowStockThreshold: 50 },
  { id: 'inv-011', skuId: 'sku-011', quantity: 0, location: 'Barcelona HQ - Consumables', lowStockThreshold: 30 },
];

export const INITIAL_OPERATIONS = [
  {
    id: 'op-001',
    operationNumber: 'IMP-2026-000001',
    type: 'IMPORT' as const,
    status: 'APPROVED' as const,
    createdById: 'user-staff-001',
    approvedById: 'user-admin-001',
    supplierRef: 'INDIBA-BCN-2026-Q1',
    expectedDate: '2026-03-01T00:00:00.000Z',
    destination: null,
    reason: null,
    rejectionReason: null,
    approvedAt: '2026-03-02T10:00:00.000Z',
    createdAt: '2026-02-28T08:00:00.000Z',
    lineItems: [
      { id: 'li-001', skuId: 'sku-001', quantity: 10, unitCost: 4500.0, unitPrice: null },
      { id: 'li-002', skuId: 'sku-007', quantity: 100, unitCost: 45.0, unitPrice: null },
      { id: 'li-003', skuId: 'sku-010', quantity: 200, unitCost: 18.0, unitPrice: null },
    ],
  },
  {
    id: 'op-002',
    operationNumber: 'EXP-2026-000001',
    type: 'EXPORT' as const,
    status: 'APPROVED' as const,
    createdById: 'user-staff-001',
    approvedById: 'user-mgr-001',
    supplierRef: null,
    expectedDate: null,
    destination: 'PhysioWorks Clinic - Singapore',
    reason: 'SALE' as const,
    rejectionReason: null,
    approvedAt: '2026-03-05T14:00:00.000Z',
    createdAt: '2026-03-04T09:00:00.000Z',
    lineItems: [
      { id: 'li-004', skuId: 'sku-001', quantity: 2, unitCost: null, unitPrice: 6800.0 },
      { id: 'li-005', skuId: 'sku-007', quantity: 10, unitCost: null, unitPrice: 85.0 },
      { id: 'li-006', skuId: 'sku-010', quantity: 20, unitCost: null, unitPrice: 35.0 },
    ],
  },
  {
    id: 'op-003',
    operationNumber: 'IMP-2026-000002',
    type: 'IMPORT' as const,
    status: 'PENDING_REVIEW' as const,
    createdById: 'user-staff-001',
    approvedById: null,
    supplierRef: 'INDIBA-BCN-2026-Q2',
    expectedDate: '2026-06-10T00:00:00.000Z',
    destination: null,
    reason: null,
    rejectionReason: null,
    approvedAt: null,
    createdAt: '2026-05-28T11:00:00.000Z',
    lineItems: [
      { id: 'li-007', skuId: 'sku-004', quantity: 5, unitCost: 3800.0, unitPrice: null },
      { id: 'li-008', skuId: 'sku-005', quantity: 3, unitCost: 8500.0, unitPrice: null },
      { id: 'li-009', skuId: 'sku-011', quantity: 150, unitCost: 12.0, unitPrice: null },
    ],
  },
  {
    id: 'op-004',
    operationNumber: 'EXP-2026-000002',
    type: 'EXPORT' as const,
    status: 'DRAFT' as const,
    createdById: 'user-mgr-001',
    approvedById: null,
    supplierRef: null,
    expectedDate: null,
    destination: 'Bangkok Beauty Center - Thailand',
    reason: 'SALE' as const,
    rejectionReason: null,
    approvedAt: null,
    createdAt: '2026-05-30T15:00:00.000Z',
    lineItems: [
      { id: 'li-010', skuId: 'sku-004', quantity: 1, unitCost: null, unitPrice: 5900.0 },
      { id: 'li-011', skuId: 'sku-010', quantity: 30, unitCost: null, unitPrice: 35.0 },
    ],
  },
  {
    id: 'op-005',
    operationNumber: 'EXP-2026-000003',
    type: 'EXPORT' as const,
    status: 'APPROVED' as const,
    createdById: 'user-staff-001',
    approvedById: 'user-admin-001',
    supplierRef: null,
    expectedDate: null,
    destination: 'VetCare Animal Hospital - Malaysia',
    reason: 'SALE' as const,
    rejectionReason: null,
    approvedAt: '2026-04-15T09:00:00.000Z',
    createdAt: '2026-04-12T10:00:00.000Z',
    lineItems: [
      { id: 'li-012', skuId: 'sku-006', quantity: 2, unitCost: null, unitPrice: 5200.0 },
    ],
  },
];


// ============================================================
// SALES ORDERS — Multi-stage export workflow
// ============================================================

export type SalesStage = 'SALES_QUOTE' | 'DOCUMENT_PREPARATION' | 'WAREHOUSE_RELEASE' | 'FULFILLED' | 'CANCELLED';

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string | null;
  discountPercent: number;
  paymentTerms: string;
  currentStage: SalesStage;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  cancelledReason: string | null;
  lineItems: { id: string; skuId: string; quantity: number; unitPrice: number }[];
  stageHistory: {
    stage: SalesStage;
    completedById: string | null;
    completedAt: string | null;
    deadlineAt: string;
    slaBreached: boolean;
  }[];
  documents: { type: 'INVOICE' | 'PACKING_LIST' | 'DELIVERY_NOTE'; generatedAt: string }[];
}

// SLA durations in milliseconds
export const SLA_DURATIONS: Record<SalesStage, number> = {
  SALES_QUOTE: 24 * 60 * 60 * 1000, // 24 hours
  DOCUMENT_PREPARATION: 4 * 60 * 60 * 1000, // 4 hours
  WAREHOUSE_RELEASE: 24 * 60 * 60 * 1000, // 1 working day
  FULFILLED: 0,
  CANCELLED: 0,
};

export const STAGE_OWNERS: Record<SalesStage, string> = {
  SALES_QUOTE: 'Sales',
  DOCUMENT_PREPARATION: 'Admin',
  WAREHOUSE_RELEASE: 'Warehouse',
  FULFILLED: '—',
  CANCELLED: '—',
};

export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-001',
    orderNumber: 'SO-2026-000001',
    customerName: 'PhysioWorks Clinic',
    customerAddress: '123 Orchard Road, Singapore 238858',
    discountPercent: 10,
    paymentTerms: 'NET 30',
    currentStage: 'DOCUMENT_PREPARATION',
    createdById: 'user-staff-001',
    createdAt: '2026-05-29T08:00:00.000Z',
    updatedAt: '2026-05-29T14:00:00.000Z',
    cancelledReason: null,
    lineItems: [
      { id: 'sli-001', skuId: 'sku-001', quantity: 2, unitPrice: 6800.0 },
      { id: 'sli-002', skuId: 'sku-007', quantity: 10, unitPrice: 85.0 },
    ],
    stageHistory: [
      {
        stage: 'SALES_QUOTE',
        completedById: 'user-staff-001',
        completedAt: '2026-05-29T14:00:00.000Z',
        deadlineAt: '2026-05-30T08:00:00.000Z',
        slaBreached: false,
      },
      {
        stage: 'DOCUMENT_PREPARATION',
        completedById: null,
        completedAt: null,
        deadlineAt: '2026-05-29T18:00:00.000Z',
        slaBreached: true,
      },
    ],
    documents: [],
  },
  {
    id: 'so-002',
    orderNumber: 'SO-2026-000002',
    customerName: 'Bangkok Beauty Center',
    customerAddress: '99 Sukhumvit Road, Bangkok 10110',
    discountPercent: 5,
    paymentTerms: 'NET 15',
    currentStage: 'SALES_QUOTE',
    createdById: 'user-staff-001',
    createdAt: '2026-05-31T09:00:00.000Z',
    updatedAt: '2026-05-31T09:00:00.000Z',
    cancelledReason: null,
    lineItems: [{ id: 'sli-003', skuId: 'sku-004', quantity: 1, unitPrice: 5900.0 }],
    stageHistory: [
      {
        stage: 'SALES_QUOTE',
        completedById: null,
        completedAt: null,
        deadlineAt: '2026-06-01T09:00:00.000Z',
        slaBreached: false,
      },
    ],
    documents: [],
  },
  {
    id: 'so-003',
    orderNumber: 'SO-2026-000003',
    customerName: 'VetCare Animal Hospital',
    customerAddress: 'Petaling Jaya, Selangor, Malaysia',
    discountPercent: 8,
    paymentTerms: 'NET 30',
    currentStage: 'FULFILLED',
    createdById: 'user-staff-001',
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-04-15T16:00:00.000Z',
    cancelledReason: null,
    lineItems: [{ id: 'sli-004', skuId: 'sku-006', quantity: 2, unitPrice: 5200.0 }],
    stageHistory: [
      { stage: 'SALES_QUOTE', completedById: 'user-staff-001', completedAt: '2026-04-10T15:00:00.000Z', deadlineAt: '2026-04-11T10:00:00.000Z', slaBreached: false },
      { stage: 'DOCUMENT_PREPARATION', completedById: 'user-admin-001', completedAt: '2026-04-11T11:00:00.000Z', deadlineAt: '2026-04-10T19:00:00.000Z', slaBreached: false },
      { stage: 'WAREHOUSE_RELEASE', completedById: 'user-mgr-001', completedAt: '2026-04-15T16:00:00.000Z', deadlineAt: '2026-04-12T11:00:00.000Z', slaBreached: false },
    ],
    documents: [
      { type: 'INVOICE', generatedAt: '2026-04-11T11:00:00.000Z' },
      { type: 'PACKING_LIST', generatedAt: '2026-04-11T11:05:00.000Z' },
      { type: 'DELIVERY_NOTE', generatedAt: '2026-04-15T16:00:00.000Z' },
    ],
  },
];
