import { useState } from 'react';
import { useSalesOrders, useAdvanceSalesStage, useCancelSalesOrder } from '@/hooks/use-api';
import { CreateSalesOrderPage } from './create-sales-order';

interface StageHistory {
  stage: string;
  completedById: string | null;
  completedAt: string | null;
  deadlineAt: string;
  slaBreached: boolean;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string | null;
  discountPercent: number;
  paymentTerms: string;
  currentStage: string;
  createdAt: string;
  cancelledReason: string | null;
  lineItems: { id: string; skuId: string; quantity: number; unitPrice: number }[];
  stageHistory: StageHistory[];
  documents: { type: string; generatedAt: string }[];
}

const STAGE_OWNERS: Record<string, string> = {
  SALES_QUOTE: 'Sales',
  DOCUMENT_PREPARATION: 'Admin',
  WAREHOUSE_RELEASE: 'Warehouse',
  FULFILLED: '—',
  CANCELLED: '—',
};

const STAGE_LABELS: Record<string, string> = {
  SALES_QUOTE: 'Sales Quote',
  DOCUMENT_PREPARATION: 'Document Prep',
  WAREHOUSE_RELEASE: 'Warehouse Release',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled',
};

export function SalesOrdersPage() {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [stageFilter, setStageFilter] = useState('');
  const params = stageFilter ? { stage: stageFilter } : undefined;

  const { data, isLoading } = useSalesOrders(params);
  const advanceMutation = useAdvanceSalesStage();
  const cancelMutation = useCancelSalesOrder();

  if (view === 'create') {
    return <CreateSalesOrderPage onBack={() => setView('list')} />;
  }

  const orders = (data?.data as SalesOrder[]) || [];

  const handleAdvance = async (id: string, currentStage: string) => {
    if (!confirm(`Advance from ${STAGE_LABELS[currentStage]} to next stage?`)) return;
    try {
      await advanceMutation.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to advance stage');
    }
  };

  const handleCancel = (id: string) => {
    const reason = prompt('Cancellation reason (min 5 characters):');
    if (reason && reason.length >= 5) cancelMutation.mutate({ id, reason });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sales Orders</h1>
        <button
          onClick={() => setView('create')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          + New Sales Order
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All Stages</option>
          <option value="SALES_QUOTE">Sales Quote</option>
          <option value="DOCUMENT_PREPARATION">Document Preparation</option>
          <option value="WAREHOUSE_RELEASE">Warehouse Release</option>
          <option value="FULFILLED">Fulfilled</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No sales orders. Create one to get started.
          </p>
        ) : (
          orders.map((order) => (
            <SalesOrderCard
              key={order.id}
              order={order}
              onAdvance={() => handleAdvance(order.id, order.currentStage)}
              onCancel={() => handleCancel(order.id)}
              isAdvancing={advanceMutation.isPending}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SalesOrderCard({
  order,
  onAdvance,
  onCancel,
  isAdvancing,
}: {
  order: SalesOrder;
  onAdvance: () => void;
  onCancel: () => void;
  isAdvancing: boolean;
}) {
  const totalValue = order.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
  const discounted = totalValue * (1 - order.discountPercent / 100);
  const isFinal = order.currentStage === 'FULFILLED' || order.currentStage === 'CANCELLED';

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
            <StageBadge stage={order.currentStage} />
            {order.stageHistory.find((sh) => !sh.completedAt && sh.slaBreached) && (
              <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                ⚠ SLA Breached
              </span>
            )}
          </div>
          <p className="text-sm font-medium mt-1">{order.customerName}</p>
          {order.customerAddress && (
            <p className="text-xs text-muted-foreground">{order.customerAddress}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">${discounted.toLocaleString()}</p>
          {order.discountPercent > 0 && (
            <p className="text-xs text-muted-foreground">
              -{order.discountPercent}% off ${totalValue.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{order.paymentTerms}</p>
        </div>
      </div>

      <StageTracker order={order} />

      <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
        <span>{order.lineItems.length} items · Created {new Date(order.createdAt).toLocaleDateString()}</span>
        {!isFinal && (
          <div className="flex gap-2">
            <button
              onClick={onAdvance}
              disabled={isAdvancing}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium disabled:opacity-50"
            >
              Complete {STAGE_LABELS[order.currentStage]} →
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1 border rounded text-xs hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {order.documents.length > 0 && (
        <div className="mt-3 pt-3 border-t flex gap-2 text-xs">
          <span className="text-muted-foreground">Documents:</span>
          {order.documents.map((doc) => (
            <span key={doc.type} className="px-2 py-0.5 rounded bg-accent text-accent-foreground">
              📄 {doc.type.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}

      {order.cancelledReason && (
        <p className="mt-3 pt-3 border-t text-xs text-destructive">
          Cancelled: {order.cancelledReason}
        </p>
      )}
    </div>
  );
}

function StageTracker({ order }: { order: SalesOrder }) {
  const stages = ['SALES_QUOTE', 'DOCUMENT_PREPARATION', 'WAREHOUSE_RELEASE'];

  if (order.currentStage === 'CANCELLED') {
    return (
      <div className="px-3 py-2 bg-destructive/10 text-destructive rounded text-xs font-medium">
        Order Cancelled
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {stages.map((stage) => {
        const history = order.stageHistory.find((sh) => sh.stage === stage);
        const isComplete = !!history?.completedAt;
        const isCurrent = order.currentStage === stage;
        const isBreached = history?.slaBreached && !isComplete;

        return (
          <div
            key={stage}
            className={`p-2 rounded text-xs border ${
              isComplete
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                : isCurrent
                  ? isBreached
                    ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                    : 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-muted/50 border-border text-muted-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {isComplete ? '✓' : isCurrent ? '●' : '○'} {STAGE_LABELS[stage]}
              </span>
            </div>
            <div className="text-[10px] mt-0.5 opacity-75">
              {STAGE_OWNERS[stage]} ·{' '}
              {isComplete && history?.completedAt
                ? new Date(history.completedAt).toLocaleDateString()
                : history?.deadlineAt
                  ? `SLA: ${new Date(history.deadlineAt).toLocaleString()}`
                  : '—'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    SALES_QUOTE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    DOCUMENT_PREPARATION: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    WAREHOUSE_RELEASE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    FULFILLED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    CANCELLED: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${colors[stage] || ''}`}>
      {STAGE_LABELS[stage]}
    </span>
  );
}
