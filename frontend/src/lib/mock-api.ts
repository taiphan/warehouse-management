import { DEMO_USERS, INITIAL_CATALOG, INITIAL_SKUS, INITIAL_INVENTORY, INITIAL_OPERATIONS } from './mock-data';

type Operation = {
  id: string;
  operationNumber: string;
  type: 'IMPORT' | 'EXPORT';
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdById: string;
  approvedById: string | null;
  supplierRef: string | null;
  expectedDate: string | null;
  destination: string | null;
  reason: 'SALE' | 'TRANSFER' | 'RETURN' | null;
  rejectionReason: string | null;
  approvedAt: string | null;
  createdAt: string;
  lineItems: { id: string; skuId: string; quantity: number; unitCost: number | null; unitPrice: number | null }[];
};

function getStore<T>(key: string, initial: T): T {
  const stored = localStorage.getItem(`wms:${key}`);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(`wms:${key}`, JSON.stringify(initial));
  return initial;
}

function setStore<T>(key: string, data: T): void {
  localStorage.setItem(`wms:${key}`, JSON.stringify(data));
}

function uuid(): string {
  return crypto.randomUUID();
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      total: items.length,
      totalPages: Math.ceil(items.length / pageSize),
    },
  };
}

function delay(ms = 150): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function mockRequest(path: string, options: RequestInit = {}): Promise<unknown> {
  await delay(Math.random() * 200 + 100);

  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body as string) : null;
  const url = new URL(path, 'http://localhost');
  const params = Object.fromEntries(url.searchParams);
  const segments = url.pathname.split('/').filter(Boolean);

  // AUTH
  if (segments[0] === 'auth' && segments[1] === 'login' && method === 'POST') {
    const user = DEMO_USERS.find((u) => u.email === body.email && u.password === body.password);
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } };
    return {
      success: true,
      data: {
        accessToken: `mock-token-${user.id}`,
        refreshToken: `mock-refresh-${user.id}`,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      },
    };
  }

  if (segments[0] === 'auth' && segments[1] === 'refresh') {
    return { success: true, data: { accessToken: 'mock-token-refreshed' } };
  }

  // CATALOG
  if (segments[0] === 'catalog-items' && method === 'GET' && segments.length === 1) {
    const catalog = getStore('catalog', INITIAL_CATALOG);
    const skus = getStore('skus', INITIAL_SKUS);
    const search = params.search?.toLowerCase();
    const category = params.category;
    let filtered = catalog;
    if (search) filtered = filtered.filter((c) => c.name.toLowerCase().includes(search) || c.category.toLowerCase().includes(search));
    if (category) filtered = filtered.filter((c) => c.category === category);
    const enriched = filtered.map((c) => ({ ...c, _count: { skus: skus.filter((s) => s.catalogItemId === c.id).length } }));
    return { success: true, ...paginate(enriched, Number(params.page) || 1, Number(params.pageSize) || 20) };
  }

  if (segments[0] === 'catalog-items' && method === 'POST') {
    const catalog = getStore('catalog', INITIAL_CATALOG);
    const item = { id: uuid(), ...body, createdBy: 'current-user', updatedBy: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    catalog.push(item);
    setStore('catalog', catalog);
    return { success: true, data: item };
  }

  if (segments[0] === 'catalog-items' && segments.length === 2 && method === 'GET') {
    const catalog = getStore('catalog', INITIAL_CATALOG);
    const skus = getStore('skus', INITIAL_SKUS);
    const item = catalog.find((c) => c.id === segments[1]);
    if (!item) return { success: false, error: { code: 'NOT_FOUND', message: 'Catalog item not found' } };
    return { success: true, data: { ...item, skus: skus.filter((s) => s.catalogItemId === item.id) } };
  }

  if (segments[0] === 'catalog-items' && segments.length === 2 && method === 'DELETE') {
    const catalog = getStore('catalog', INITIAL_CATALOG);
    setStore('catalog', catalog.filter((c) => c.id !== segments[1]));
    return { success: true, message: 'Deleted' };
  }

  // INVENTORY
  if (segments[0] === 'inventory' && method === 'GET' && segments.length === 1) {
    const inventory = getStore('inventory', INITIAL_INVENTORY);
    const skus = getStore('skus', INITIAL_SKUS);
    const catalog = getStore('catalog', INITIAL_CATALOG);
    const stockStatus = params.stockStatus;

    let enriched = inventory.map((inv) => {
      const sku = skus.find((s) => s.id === inv.skuId);
      const cat = catalog.find((c) => c.id === sku?.catalogItemId);
      const status = inv.quantity === 0 ? 'out_of_stock' : inv.quantity <= inv.lowStockThreshold ? 'low_stock' : 'in_stock';
      return { ...inv, stockStatus: status, updatedAt: new Date().toISOString(), sku: sku ? { ...sku, catalogItem: cat ? { id: cat.id, name: cat.name, category: cat.category } : null, barcodes: [] } : null };
    });

    if (stockStatus) enriched = enriched.filter((i) => i.stockStatus === stockStatus);
    if (params.skuCode) enriched = enriched.filter((i) => i.sku?.code.toLowerCase().includes(params.skuCode!.toLowerCase()));

    return { success: true, ...paginate(enriched, Number(params.page) || 1, Number(params.pageSize) || 20) };
  }

  // OPERATIONS
  if (segments[0] === 'operations' && method === 'GET' && segments.length === 1) {
    const operations = getStore('operations', INITIAL_OPERATIONS);
    let filtered = [...operations];
    if (params.type) filtered = filtered.filter((o) => o.type === params.type);
    if (params.status) filtered = filtered.filter((o) => o.status === params.status);
    const enriched = filtered.map((o) => ({
      ...o,
      createdBy: DEMO_USERS.find((u) => u.id === o.createdById) || { id: o.createdById, firstName: 'Unknown', lastName: '' },
      approvedBy: o.approvedById ? DEMO_USERS.find((u) => u.id === o.approvedById) : null,
      _count: { lineItems: o.lineItems.length },
    }));
    return { success: true, ...paginate(enriched.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), Number(params.page) || 1, Number(params.pageSize) || 20) };
  }

  if (segments[0] === 'operations' && segments[1] === 'import' && method === 'POST') {
    return createOperation('IMPORT', body);
  }

  if (segments[0] === 'operations' && segments[1] === 'export' && method === 'POST') {
    return createOperation('EXPORT', body);
  }

  if (segments[0] === 'operations' && segments.length === 3 && segments[2] === 'submit') {
    return transitionOperation(segments[1], 'PENDING_REVIEW');
  }

  if (segments[0] === 'operations' && segments.length === 3 && segments[2] === 'approve') {
    return approveOperation(segments[1]);
  }

  if (segments[0] === 'operations' && segments.length === 3 && segments[2] === 'reject') {
    return transitionOperation(segments[1], 'REJECTED', body?.reason);
  }

  if (segments[0] === 'operations' && segments.length === 3 && segments[2] === 'cancel') {
    return transitionOperation(segments[1], 'CANCELLED');
  }

  // REPORTS
  if (segments[0] === 'reports' && method === 'GET') {
    return generateMockReport(params.periodType || 'monthly');
  }

  // ANALYTICS
  if (segments[0] === 'analytics' && segments[1] === 'moving-averages') {
    return generateMockMovingAverages(Number(params.window) || 30);
  }

  if (segments[0] === 'analytics' && segments[1] === 'top-products') {
    return generateMockTopProducts();
  }

  if (segments[0] === 'analytics' && segments[1] === 'turnover') {
    return { success: true, data: [] };
  }

  if (segments[0] === 'analytics' && segments[1] === 'trends') {
    return { success: true, data: { imports: { slope: 2.3, intercept: 10, dataPoints: [], trendLine: [] }, exports: { slope: 1.8, intercept: 8, dataPoints: [], trendLine: [] } } };
  }

  // PREDICTIONS
  if (segments[0] === 'predictions' && segments[1] === 'reorder-alerts') {
    return generateMockReorderAlerts();
  }

  if (segments[0] === 'predictions' && segments.length === 2) {
    return { success: true, data: { skuId: segments[1], dailyForecasts: [], methodology: 'Exponential Smoothing', dataRange: { start: '2026-01-01', end: '2026-05-31' }, generatedAt: new Date().toISOString() } };
  }

  // AUDIT
  if (segments[0] === 'audit-logs') {
    return { success: true, ...paginate([], 1, 20) };
  }

  return { success: false, error: { code: 'NOT_FOUND', message: `Route not found: ${method} ${path}` } };
}

function createOperation(type: 'IMPORT' | 'EXPORT', body: Record<string, unknown>) {
  const operations: Operation[] = getStore('operations', INITIAL_OPERATIONS);
  const count = operations.filter((o) => o.type === type).length + 1;
  const prefix = type === 'IMPORT' ? 'IMP' : 'EXP';
  const op: Operation = {
    id: uuid(),
    operationNumber: `${prefix}-2026-${String(count).padStart(6, '0')}`,
    type,
    status: 'DRAFT',
    createdById: 'user-staff-001',
    approvedById: null,
    supplierRef: (body.supplierRef as string) || null,
    expectedDate: (body.expectedDate as string) || null,
    destination: (body.destination as string) || null,
    reason: (body.reason as Operation['reason']) || null,
    rejectionReason: null,
    approvedAt: null,
    createdAt: new Date().toISOString(),
    lineItems: ((body.lineItems as Array<{ skuId: string; quantity: number; unitCost?: number; unitPrice?: number }>) || []).map((li) => ({
      id: uuid(),
      skuId: li.skuId,
      quantity: li.quantity,
      unitCost: li.unitCost || null,
      unitPrice: li.unitPrice || null,
    })),
  };
  operations.push(op);
  setStore('operations', operations);
  return { success: true, data: op };
}

function transitionOperation(opId: string, newStatus: Operation['status'], reason?: string) {
  const operations: Operation[] = getStore('operations', INITIAL_OPERATIONS);
  const idx = operations.findIndex((o) => o.id === opId);
  if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Operation not found' } };
  operations[idx] = { ...operations[idx], status: newStatus, rejectionReason: reason || operations[idx].rejectionReason };
  setStore('operations', operations);
  return { success: true, data: operations[idx] };
}

function approveOperation(opId: string) {
  const operations: Operation[] = getStore('operations', INITIAL_OPERATIONS);
  const inventory = getStore('inventory', INITIAL_INVENTORY);
  const idx = operations.findIndex((o) => o.id === opId);
  if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Operation not found' } };

  const op = operations[idx];

  for (const li of op.lineItems) {
    const invIdx = inventory.findIndex((i) => i.skuId === li.skuId);
    if (invIdx === -1) continue;
    if (op.type === 'IMPORT') {
      inventory[invIdx].quantity += li.quantity;
    } else {
      if (inventory[invIdx].quantity < li.quantity) {
        return { success: false, error: { code: 'BUSINESS_RULE_VIOLATION', message: `Insufficient stock for SKU ${li.skuId}` } };
      }
      inventory[invIdx].quantity -= li.quantity;
    }
  }

  operations[idx] = { ...op, status: 'APPROVED', approvedById: 'user-admin-001', approvedAt: new Date().toISOString() };
  setStore('operations', operations);
  setStore('inventory', inventory);
  return { success: true, data: operations[idx] };
}

function generateMockReport(periodType: string) {
  return {
    success: true,
    data: {
      period: { type: periodType, start: '2026-05-01T00:00:00.000Z', end: '2026-05-31T23:59:59.999Z' },
      totalImports: 280,
      totalExports: 175,
      netInventoryChange: 105,
      topProducts: [
        { skuCode: 'WM-BLK-001', productName: 'Wireless Mouse', totalMoved: 125 },
        { skuCode: 'USBC-2M-BLK', productName: 'USB-C Cable', totalMoved: 100 },
        { skuCode: 'KB-RGB-001', productName: 'Mechanical Keyboard', totalMoved: 72 },
        { skuCode: 'WM-WHT-001', productName: 'Wireless Mouse', totalMoved: 45 },
        { skuCode: 'KB-RGB-TKL', productName: 'Mechanical Keyboard', totalMoved: 38 },
      ],
      financialSummary: { totalImportCost: 8450.0, totalExportRevenue: 12380.5 },
      operationCount: 12,
    },
  };
}

function generateMockMovingAverages(window: number) {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      importAvg: Math.round((15 + Math.random() * 10) * 100) / 100,
      exportAvg: Math.round((10 + Math.random() * 8) * 100) / 100,
    });
  }
  return { success: true, data: { window, data } };
}

function generateMockTopProducts() {
  return {
    success: true,
    data: {
      top: [
        { skuId: 'sku-001', skuCode: 'WM-BLK-001', productName: 'Wireless Mouse (Black)', totalExported: 125 },
        { skuId: 'sku-005', skuCode: 'USBC-2M-BLK', productName: 'USB-C Cable', totalExported: 100 },
        { skuId: 'sku-003', skuCode: 'KB-RGB-001', productName: 'Mechanical Keyboard (Full)', totalExported: 72 },
        { skuId: 'sku-002', skuCode: 'WM-WHT-001', productName: 'Wireless Mouse (White)', totalExported: 45 },
        { skuId: 'sku-004', skuCode: 'KB-RGB-TKL', productName: 'Mechanical Keyboard (TKL)', totalExported: 38 },
      ],
      bottom: [
        { skuId: 'sku-006', skuCode: 'MS-ALU-SLV', productName: 'Monitor Stand', totalExported: 3 },
      ],
    },
  };
}

function generateMockReorderAlerts() {
  return {
    success: true,
    data: [
      { skuId: 'sku-006', skuCode: 'MS-ALU-SLV', productName: 'Monitor Stand', currentStock: 0, pendingImports: 20, forecastedDemand: 35, recommendedReorder: 15, leadTimeDays: 14 },
      { skuId: 'sku-004', skuCode: 'KB-RGB-TKL', productName: 'Mechanical Keyboard (TKL)', currentStock: 8, pendingImports: 50, forecastedDemand: 65, recommendedReorder: 7, leadTimeDays: 14 },
    ],
  };
}
