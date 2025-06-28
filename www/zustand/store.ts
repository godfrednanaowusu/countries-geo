import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const configStore = (set: any) => ({
    asBusiness: false,
    toggleAsBusiness: () => set((state: any) => ({ asBusiness: !state.asBusiness })),

    login_pane_visibility: false,
    set_login_pane_visibility: (state: any) => set(() => ({ login_pane_visibility: state })),

    drawer_visibility: false,
    set_drawer_visibility: (state: any) => set(() => ({ drawer_visibility: state })),

    user_country_data: {} as any,
    set_user_country_data: (payload: any) => set(() => ({ user_country_data: payload })),

    payment_widget_visibility: false,
    set_payment_widget_visibility: (state: any) => set(() => ({ payment_widget_visibility: state })),

    payment_pane_status: false,
    open_payment_pane: () => set(() => ({ payment_pane_status: true })),
    close_payment_pane: () => set(() => ({ payment_pane_status: false })),

    payment_callback: '',
    set_payment_callback: (callback: any) => set(() => ({ payment_callback: callback })),

    tutorial_watch_pane: false,
    set_tutorial_watch_pane: (bool: any) => set(() => ({ tutorial_watch_pane: bool })),

    pageTitle: `` as any,
    setPageTitle: (title: any) => set(() => ({ pageTitle: `${title}` })),

    appTheme: `light` as any,
    setAppTheme: (theme: any) => set(() => ({ appTheme: `${theme}` })),

    sideBarCollapse: false,
    setSideBarCollapse: (collapse: boolean) => set(() => ({ sideBarCollapse: collapse })),

    
});

const cartStore = (set: any) => ({
    cart: [],
    orderNo: '',
    cart_grand_total: () => set((state: any) => ({})),

    add_to_cart: (payload: any) => set((state: any) => {
        const itemPresent = state.cart.find((item: any) => item.identifier === payload.identifier);
        if (!itemPresent) { return { ...state, cart: [...state.cart, payload] }; }
        const updatedItem = state.cart.map((item: any) => item.identifier === payload.identifier ? payload : item);
        return { ...state, cart: updatedItem };
    }),

    remove_from_cart: (identifier: any) => set((state: any) => {
        const newItem = state.cart.filter((trade: any) => trade.identifier !== identifier);
        return { ...state, cart: newItem };
    }),

    empty_cart: () => set(() => ({
        cart: []
    })),

    set_cart_grand_total: (payload: any) => set(() => ({
        cart_grand_total: payload
    })),

    get_cart_grand_total: () => set((state: any) => ({
        cart_grand_total: state.cart.length
    })),

    setOrderNo: (number: any) => set(() => ({ orderNo: number })),

    cartOpen: false,
    setCartOpen: (state: any) => set(() => ({ cartOpen: state })),
});

// Apply middlewares (devtools and persist)
export const useConfigStore = create(
    devtools(
        persist(configStore, { name: 'g4m_config' })
    )
);

export const useCartStore = create(
    devtools(
        persist(cartStore, { name: 'g4m_cart' })
    )
);
