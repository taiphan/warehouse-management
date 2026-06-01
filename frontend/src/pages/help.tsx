import { useState } from 'react';
import { useLocaleStore } from '@/stores/locale.store';

const APP_VERSION = '1.2.0';
const RELEASE_DATE = '2026-05-31';

interface FeatureGuide {
  icon: string;
  titleKey: string;
  descKey: string;
  steps: string[];
}

const FEATURES: FeatureGuide[] = [
  {
    icon: '📊',
    titleKey: 'help.dashboard.title',
    descKey: 'help.dashboard.desc',
    steps: ['help.dashboard.s1', 'help.dashboard.s2', 'help.dashboard.s3'],
  },
  {
    icon: '📦',
    titleKey: 'help.catalog.title',
    descKey: 'help.catalog.desc',
    steps: ['help.catalog.s1', 'help.catalog.s2', 'help.catalog.s3', 'help.catalog.s4'],
  },
  {
    icon: '🔄',
    titleKey: 'help.operations.title',
    descKey: 'help.operations.desc',
    steps: [
      'help.operations.s1',
      'help.operations.s2',
      'help.operations.s3',
      'help.operations.s4',
      'help.operations.s5',
    ],
  },
  {
    icon: '🛒',
    titleKey: 'help.sales.title',
    descKey: 'help.sales.desc',
    steps: ['help.sales.s1', 'help.sales.s2', 'help.sales.s3', 'help.sales.s4'],
  },
  {
    icon: '📋',
    titleKey: 'help.inventory.title',
    descKey: 'help.inventory.desc',
    steps: ['help.inventory.s1', 'help.inventory.s2', 'help.inventory.s3'],
  },
  {
    icon: '📈',
    titleKey: 'help.reports.title',
    descKey: 'help.reports.desc',
    steps: ['help.reports.s1', 'help.reports.s2', 'help.reports.s3'],
  },
  {
    icon: '🔬',
    titleKey: 'help.analytics.title',
    descKey: 'help.analytics.desc',
    steps: ['help.analytics.s1', 'help.analytics.s2', 'help.analytics.s3'],
  },
];

const CHANGELOG = [
  {
    version: '1.2.0',
    date: '2026-05-31',
    changes: [
      'Added multi-stage sales order workflow (Sales → Admin → Warehouse)',
      'Added SLA tracking with breach alerts per stage',
      'Auto-generation of Invoice, Packing List, and Delivery Note',
      'Added Help & Guideline page with feature documentation',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-05-31',
    changes: [
      'i18n support — English and Vietnamese',
      'Dark/Light/System theme switcher',
      'Demo user picker on login page',
      'Mock API for serverless deployment on Vercel',
      'INDIBA Asia branding adaptation',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-05-31',
    changes: [
      'Initial release: full-stack WMS with Express + Prisma + React',
      'Catalog, SKU, Barcode management (EAN-13, UPC-A, Code 128)',
      'Import/Export operations with approval workflow',
      'Atomic inventory updates via database transactions',
      'Reports (daily/weekly/monthly/quarterly/yearly)',
      'Analytics (moving averages, top products, predictions)',
      'JWT auth with role-based access control',
    ],
  },
];

export function HelpPage() {
  const { t } = useLocaleStore();
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{t('help.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('help.subtitle')}</p>
      </div>

      {/* Version Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-accent border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {t('help.current_version')}
            </p>
            <p className="text-2xl font-bold text-primary">v{APP_VERSION}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('help.released')} {RELEASE_DATE}
            </p>
          </div>
          <div className="text-right text-xs">
            <a
              href="https://github.com/taiphan/warehouse-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline block"
            >
              📦 GitHub
            </a>
            <a
              href="https://gitlab.com/taiphan/warehouse-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline block mt-1"
            >
              🦊 GitLab
            </a>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-card border rounded-lg p-4">
        <h2 className="font-semibold mb-3">{t('help.quick_start')}</h2>
        <ol className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="font-bold text-primary">1.</span>
            <span>{t('help.qs.s1')}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary">2.</span>
            <span>{t('help.qs.s2')}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary">3.</span>
            <span>{t('help.qs.s3')}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary">4.</span>
            <span>{t('help.qs.s4')}</span>
          </li>
        </ol>
      </div>

      {/* Features */}
      <div>
        <h2 className="font-semibold mb-3">{t('help.features')}</h2>
        <div className="space-y-2">
          {FEATURES.map((f) => {
            const isOpen = expandedFeature === f.titleKey;
            return (
              <div key={f.titleKey} className="bg-card border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFeature(isOpen ? null : f.titleKey)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 text-left"
                >
                  <span className="text-2xl">{f.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{t(f.titleKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(f.descKey)}</p>
                  </div>
                  <span className="text-muted-foreground">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pl-14">
                    <ol className="space-y-1.5 text-sm">
                      {f.steps.map((stepKey, idx) => (
                        <li key={stepKey} className="flex gap-2">
                          <span className="text-muted-foreground">{idx + 1}.</span>
                          <span>{t(stepKey)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Changelog */}
      <div>
        <h2 className="font-semibold mb-3">{t('help.changelog')}</h2>
        <div className="space-y-3">
          {CHANGELOG.map((release) => (
            <div key={release.version} className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-primary text-primary-foreground font-mono">
                  v{release.version}
                </span>
                <span className="text-xs text-muted-foreground">{release.date}</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-card border rounded-lg p-4">
        <h2 className="font-semibold mb-3">{t('help.tech_stack')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <TechItem label="Frontend" value="React 18 + Vite 6" />
          <TechItem label="Language" value="TypeScript 5" />
          <TechItem label="Styling" value="Tailwind CSS" />
          <TechItem label="State" value="Zustand + TanStack Query" />
          <TechItem label="Backend" value="Express + Prisma" />
          <TechItem label="Database" value="PostgreSQL 16" />
          <TechItem label="Cache" value="Redis 7" />
          <TechItem label="Queue" value="BullMQ" />
          <TechItem label="Deploy" value="Vercel" />
        </div>
      </div>
    </div>
  );
}

function TechItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
