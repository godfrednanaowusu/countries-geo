import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { defaultDataLanguage, type DataLanguage } from '@/messages/config';

const configStore = (set: any) => ({
    appTheme: `light` as any,
    setAppTheme: (theme: any) => set(() => ({ appTheme: `${theme}` })),
    // Language used to resolve names in the package data; independent of the UI locale
    dataLanguage: defaultDataLanguage as DataLanguage,
    setDataLanguage: (dataLanguage: DataLanguage) => set(() => ({ dataLanguage })),
});


// Apply middlewares (devtools and persist).
// Hydration is skipped so the first client render matches the static HTML; LocaleProvider rehydrates on mount.
export const useConfigStore = create(
    devtools(
        persist(configStore, { name: 'countries_geo_config', skipHydration: true })
    )
);
