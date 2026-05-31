import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale, t as translate } from '@/lib/i18n';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale: Locale) => set({ locale }),
      t: (key: string) => translate(key, get().locale),
    }),
    { name: 'wms-locale' },
  ),
);
