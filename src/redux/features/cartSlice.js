import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    original_total: 0,
    final_total: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        // Add item — if already in cart, increase qty
        addToCart: (state, { payload }) => {
            const existing = state.items.find((item) => item.id === payload.id);
            if (existing) {
                existing.qty += 1;
            } else {
                state.items.push({ ...payload, qty: payload.qty ?? 1 });
            }
            state.original_total += Number(payload.originalPrice);
            state.final_total += Number(payload.salePrice);
            localStorage.setItem('cart', JSON.stringify(state));
        },

        // Remove item entirely (all qty)
        removeFromCart: (state, { payload }) => {
            const item = state.items.find((i) => i.id === payload.id);
            if (item) {
                state.original_total -= Number(item.originalPrice) * item.qty;
                state.final_total -= Number(item.salePrice) * item.qty;
                state.items = state.items.filter((i) => i.id !== payload.id);
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },

        // Increase qty by 1
        increaseQuantity: (state, { payload }) => {
            const item = state.items.find((i) => i.id === payload.id);
            if (!item) return;
            item.qty += 1;
            state.original_total += Number(item.originalPrice);
            state.final_total += Number(item.salePrice);
            localStorage.setItem('cart', JSON.stringify(state));
        },

        // Decrease qty by 1; remove if qty reaches 0
        decreaseQuantity: (state, { payload }) => {
            const item = state.items.find((i) => i.id === payload.id);
            if (!item) return;
            state.original_total -= Number(item.originalPrice);
            state.final_total -= Number(item.salePrice);
            if (item.qty > 1) {
                item.qty -= 1;
            } else {
                state.items = state.items.filter((i) => i.id !== payload.id);
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },

        // Update qty to a specific value
        updateQuantity: (state, { payload }) => {
            const item = state.items.find((i) => i.id === payload.id);
            if (!item) return;
            const diff = payload.qty - item.qty;
            item.qty = payload.qty;
            state.original_total += Number(item.originalPrice) * diff;
            state.final_total += Number(item.salePrice) * diff;
            localStorage.setItem('cart', JSON.stringify(state));
        },

        // Empty the entire cart
        clearCart: (state) => {
            state.items = [];
            state.original_total = 0;
            state.final_total = 0;
            localStorage.removeItem('cart');
        },

        // Hydrate Redux from localStorage (call on app mount)
        lsToCart: (state) => {
            try {
                const saved = JSON.parse(localStorage.getItem('cart'));
                if (saved) {
                    state.items = saved.items ?? [];
                    state.original_total = Number(saved.original_total) || 0;
                    state.final_total = Number(saved.final_total) || 0;
                }
            } catch {
                // Corrupted localStorage — ignore
            }
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    lsToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
