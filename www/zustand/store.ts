import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const configStore = (set: any) => ({
    appTheme: `light` as any,
    setAppTheme: (theme: any) => set(() => ({ appTheme: `${theme}` })),
    
});


// Apply middlewares (devtools and persist)
export const useConfigStore = create(
    devtools(
        persist(configStore, { name: 'countries_geo_config' })
    )
);

