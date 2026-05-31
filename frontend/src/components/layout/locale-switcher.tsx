import { useLocaleStore } from '@/stores/locale.store';
import { getLocales, type Locale } from '@/lib/i18n';

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const locales = getLocales();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
      {locales.map((l) => (
        <button
          key={l.value}
          onClick={() => setLocale(l.value as Locale)}
          title={l.label}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            locale === l.value
              ? 'bg-background shadow-sm'
              : 'hover:bg-background/50'
          }`}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
