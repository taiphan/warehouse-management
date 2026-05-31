import { useState } from 'react';
import { useInventory } from '@/hooks/use-api';
import { useLocaleStore } from '@/stores/locale.store';

// Mock daily movement data per SKU
const DAILY_MOVEMENTS: Record<string, {
  dailyExportDemo: number;
  dailyExportSale: number;
  dailyExportReplace: number;
  dailyExportGift: number;
  dailyExportWarranty: number;
  dailyImport: number;
}> = {
  'sku-001': { dailyExportDemo: 1, dailyExportSale: 2, dailyExportReplace: 0, dailyExportGift: 0, dailyExportWarranty: 0, dailyImport: 3 },
  'sku-002': { dailyExportDemo: 0, dailyExportSale: 1, dailyExportReplace: 0, dailyExportGift: 0, dailyExportWarranty: 1, dailyImport: 2 },
  'sku-003': { dailyExportDemo: 1, dailyExportSale: 1, dailyExportReplace: 1, dailyExportGift: 0, dailyExportWarranty: 0, dailyImport: 2 },
  'sku-004': { dailyExportDemo: 0, dailyExportSale: 1, dailyExportReplace: 0, dailyExportGift: 1, dailyExportWarranty: 0, dailyImport: 1 },
  'sku-005': { dailyExportDemo: 0, dailyExportSale: 0, dailyExportReplace: 0, dailyExportGift: 0, dailyExportWarranty: 1, dailyImport: 1 },
  'sku-006': { dailyExportDemo: 0, dailyExportSale: 1, dailyExportReplace: 0, dailyExportGift: 0, dailyExportWarranty: 0, dailyImport: 0 },
  'sku-007': { dailyExportDemo: 2, dailyExportSale: 5, dailyExportReplace: 3, dailyExportGift: 1, dailyExportWarranty: 2, dailyImport: 10 },
  'sku-008': { dailyExportDemo: 1, dailyExportSale: 3, dailyExportReplace: 1, dailyExportGift: 0, dailyExportWarranty: 1, dailyImport: 5 },
  'sku-009': { dailyExportDemo: 0, dailyExportSale: 2, dailyExportReplace: 2, dailyExportGift: 0, dailyExportWarranty: 1, dailyImport: 4 },
  'sku-010': { dailyExportDemo: 3, dailyExportSale: 8, dailyExportReplace: 0, dailyExportGift: 2, dailyExportWarranty: 0, dailyImport: 15 },
  'sku-011': { dailyExportDemo: 2, dailyExportSale: 5, dailyExportReplace: 0, dailyExportGift: 1, dailyExportWarranty: 0, dailyImport: 0 },
};

export function InventoryPage() {
  const [stockFilter, setStockFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const { t } = useLocaleStore();

  const params: Record<string, string> = {};
  if (stockFilter) params.stockStatus = stockFilter;
  if (search) params.skuCode = search;

  const { data, isLoading } = useInventory(
    Object.keys(params).length > 0 ? params : undefined,
  );

  const totalStock = data?.data?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;
  const lowStockCount = data?.data?.filter(
    (inv) => inv.stockStatus === 'low_stock' || inv.stockStatus === 'out_of_stock',
  ).length || 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{t('inv.title')}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SummaryCard label="Tổng tồn kho" value={totalStock} unit="units" />
        <SummaryCard label="Sản phẩm" value={data?.pagination?.total || 0} unit="SKUs" />
        <SummaryCard label="Cảnh báo" value={lowStockCount} unit="low/out" color="red" />
        <SummaryCard
          label="Xuất hôm nay"
          value={Object.values(DAILY_MOVEMENTS).reduce(
            (s, m) => s + m.dailyExportDemo + m.dailyExportSale + m.dailyExportReplace + m.dailyExportGift + m.dailyExportWarranty, 0,
          )}
          unit="units"
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder={t('inv.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm w-64"
        />
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">{t('inv.all_levels')}</option>
          <option value="in_stock">{t('inv.in_stock')}</option>
          <option value="low_stock">{t('inv.low_stock')}</option>
          <option value="out_of_stock">{t('inv.out_of_stock')}</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-card border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-3 py-3 font-medium whitespace-nowrap">Mã SKU</th>
              <th className="text-left px-3 py-3 font-medium whitespace-nowrap">Sản phẩm</th>
              <th className="text-right px-3 py-3 font-medium whitespace-nowrap">Tồn kho</th>
              <th className="text-right px-3 py-3 font-medium whitespace-nowrap text-blue-600">Nhập/ngày</th>
              <th className="text-right px-3 py-3 font-medium whitespace-nowrap text-orange-600">Demo</th>
              <th className="text-right px-3 py-3 font-medium whitespace-nowrap text-green-600">Bán</th>
              <th className="text-right px-3 py-3 font-medium whitespace-nowrap text-purple-600">Thay thế</th>
              <th className="text-right px-3 py-3 font-medium whitespace-nowrap text-pink-600">Tặng</th>
              <th className="text-right px-3 py-3 font-medium whitespace-nowrap text-red-600">Bảo hành</th>
              <th className="text-right px-3 py-3 font-medium whitespace-nowrap">Tổng xuất</th>
              <th className="text-left px-3 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-muted-foreground">
                  {t('inv.loading')}
                </td>
              </tr>
            ) : data?.data?.map((inv) => {
              const movements = DAILY_MOVEMENTS[inv.skuId] || {
                dailyExportDemo: 0, dailyExportSale: 0, dailyExportReplace: 0,
                dailyExportGift: 0, dailyExportWarranty: 0, dailyImport: 0,
              };
              const totalDailyExport = movements.dailyExportDemo + movements.dailyExportSale +
                movements.dailyExportReplace + movements.dailyExportGift + movements.dailyExportWarranty;

              return (
                <tr key={inv.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-3 font-mono text-xs">{inv.sku?.code}</td>
                  <td className="px-3 py-3">
                    <div>{inv.sku?.catalogItem?.name}</div>
                    <div className="text-xs text-muted-foreground">{inv.sku?.catalogItem?.category}</div>
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-lg">{inv.quantity}</td>
                  <td className="px-3 py-3 text-right text-blue-600 font-medium">
                    +{movements.dailyImport}
                  </td>
                  <td className="px-3 py-3 text-right text-orange-600">
                    {movements.dailyExportDemo || '—'}
                  </td>
                  <td className="px-3 py-3 text-right text-green-600">
                    {movements.dailyExportSale || '—'}
                  </td>
                  <td className="px-3 py-3 text-right text-purple-600">
                    {movements.dailyExportReplace || '—'}
                  </td>
                  <td className="px-3 py-3 text-right text-pink-600">
                    {movements.dailyExportGift || '—'}
                  </td>
                  <td className="px-3 py-3 text-right text-red-600">
                    {movements.dailyExportWarranty || '—'}
                  </td>
                  <td className="px-3 py-3 text-right font-medium">
                    <span className={totalDailyExport > 0 ? 'text-destructive' : ''}>
                      {totalDailyExport > 0 ? `-${totalDailyExport}` : '0'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <StockBadge status={inv.stockStatus || 'in_stock'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data?.pagination && (
          <div className="px-4 py-3 border-t text-xs text-muted-foreground">
            {data.pagination.total} {t('inv.records')}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span><span className="inline-block w-3 h-3 rounded bg-blue-100 mr-1"></span> Nhập kho</span>
        <span><span className="inline-block w-3 h-3 rounded bg-orange-100 mr-1"></span> Xuất Demo</span>
        <span><span className="inline-block w-3 h-3 rounded bg-green-100 mr-1"></span> Xuất Bán</span>
        <span><span className="inline-block w-3 h-3 rounded bg-purple-100 mr-1"></span> Xuất Thay thế</span>
        <span><span className="inline-block w-3 h-3 rounded bg-pink-100 mr-1"></span> Xuất Tặng</span>
        <span><span className="inline-block w-3 h-3 rounded bg-red-100 mr-1"></span> Xuất Bảo hành</span>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, unit, color }: {
  label: string; value: number; unit: string; color?: string;
}) {
  const colorClass = color === 'red' ? 'text-destructive' : color === 'orange' ? 'text-orange-600' : '';
  return (
    <div className="bg-card border rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  );
}

function StockBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    in_stock: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    low_stock: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    out_of_stock: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  const labels: Record<string, string> = {
    in_stock: 'Còn hàng',
    low_stock: 'Sắp hết',
    out_of_stock: 'Hết hàng',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
