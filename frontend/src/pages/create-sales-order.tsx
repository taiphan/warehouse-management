import { useState } from 'react';
import { useCreateSalesOrder, useInventory } from '@/hooks/use-api';

interface LineItem {
  skuId: string;
  skuCode: string;
  productName: string;
  available: number;
  quantity: number;
  unitPrice: number;
}

export function CreateSalesOrderPage({ onBack }: { onBack: () => void }) {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('NET 30');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [error, setError] = useState('');
  const createMutation = useCreateSalesOrder();
  const { data: inventoryData } = useInventory();

  const availableSkus = inventoryData?.data?.filter(
    (inv) => inv.quantity > 0 && !lineItems.find((li) => li.skuId === inv.skuId),
  ) || [];

  const addLineItem = (inv: typeof availableSkus[0]) => {
    setLineItems([
      ...lineItems,
      {
        skuId: inv.skuId,
        skuCode: inv.sku?.code || '',
        productName: inv.sku?.catalogItem?.name || '',
        available: inv.quantity,
        quantity: 1,
        unitPrice: 100,
      },
    ]);
  };

  const updateLineItem = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
  const total = subtotal * (1 - discountPercent / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) return setError('Customer name is required');
    if (lineItems.length === 0) return setError('Add at least one line item');

    try {
      await createMutation.mutateAsync({
        customerName,
        customerAddress: customerAddress || undefined,
        discountPercent,
        paymentTerms,
        lineItems: lineItems.map((li) => ({
          skuId: li.skuId,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
        })),
      });
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sales order');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">New Sales Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border rounded-lg p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name *</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. PhysioWorks Clinic"
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address (optional)</label>
            <input
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Shipping address"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Terms</label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="NET 7">NET 7</option>
              <option value="NET 15">NET 15</option>
              <option value="NET 30">NET 30</option>
              <option value="NET 60">NET 60</option>
              <option value="COD">Cash on Delivery</option>
              <option value="PREPAID">Prepaid</option>
            </select>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-3">Line Items</h3>

          {availableSkus.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs text-muted-foreground mb-1">Add from available stock:</label>
              <div className="flex flex-wrap gap-2">
                {availableSkus.slice(0, 10).map((inv) => (
                  <button
                    key={inv.skuId}
                    type="button"
                    onClick={() => addLineItem(inv)}
                    className="px-2 py-1 text-xs border rounded hover:bg-muted"
                  >
                    {inv.sku?.code} ({inv.quantity} avail)
                  </button>
                ))}
              </div>
            </div>
          )}

          {lineItems.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">SKU</th>
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2 w-24">Available</th>
                  <th className="text-right py-2 w-24">Qty</th>
                  <th className="text-right py-2 w-28">Unit Price</th>
                  <th className="text-right py-2 w-28">Subtotal</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((li, i) => (
                  <tr key={li.skuId} className="border-b">
                    <td className="py-2 font-mono text-xs">{li.skuCode}</td>
                    <td className="py-2 text-muted-foreground">{li.productName}</td>
                    <td className="py-2 text-right text-muted-foreground">{li.available}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        min={1}
                        max={li.available}
                        value={li.quantity}
                        onChange={(e) => updateLineItem(i, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 border rounded text-sm text-right"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={li.unitPrice}
                        onChange={(e) => updateLineItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded text-sm text-right"
                      />
                    </td>
                    <td className="py-2 text-right font-medium">
                      ${(li.quantity * li.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-2 text-center">
                      <button type="button" onClick={() => removeLineItem(i)} className="text-destructive text-xs">
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Select SKUs from available stock above
            </p>
          )}

          {lineItems.length > 0 && (
            <div className="mt-4 pt-4 border-t flex justify-end gap-8 text-sm">
              <div className="text-right">
                <p className="text-muted-foreground">Subtotal: <span className="text-foreground">${subtotal.toLocaleString()}</span></p>
                {discountPercent > 0 && (
                  <p className="text-muted-foreground">Discount ({discountPercent}%): <span className="text-destructive">-${(subtotal - total).toLocaleString()}</span></p>
                )}
                <p className="font-bold mt-1">Total: <span className="text-primary">${total.toLocaleString()}</span></p>
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Sales Order'}
          </button>
          <button type="button" onClick={onBack} className="px-4 py-2 border rounded-md text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
