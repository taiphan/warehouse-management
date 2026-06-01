import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { ThemeSwitcher } from './theme-switcher';
import { LocaleSwitcher } from './locale-switcher';

const navItems = [
  { key: 'Dashboard', icon: '📊', i18n: 'nav.dashboard' },
  { key: 'Catalog', icon: '📦', i18n: 'nav.catalog' },
  { key: 'Operations', icon: '🔄', i18n: 'nav.operations' },
  { key: 'SalesOrders', icon: '🛒', i18n: 'nav.sales_orders' },
  { key: 'Inventory', icon: '📋', i18n: 'nav.inventory' },
  { key: 'Reports', icon: '📈', i18n: 'nav.reports' },
  { key: 'Analytics', icon: '🔬', i18n: 'nav.analytics' },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const { t } = useLocaleStore();

  return (
    <aside className="w-64 bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">{t('app.name')}</h2>
        <p className="text-xs text-muted-foreground">{t('app.title')}</p>
      </div>

      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left ${
              activePage === item.key
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <span>{item.icon}</span>
            <span>{t(item.i18n)}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t space-y-3">
        <div className="flex gap-2">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
        <div>
          <p className="text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
          <button
            onClick={logout}
            className="mt-2 text-xs text-destructive hover:underline"
          >
            {t('auth.logout')}
          </button>
        </div>
      </div>
    </aside>
  );
}
