"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceMin: number;
  priceMax: number;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      setQuantity: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.priceMin * i.quantity, 0),
    }),
    { name: "wind-cart" },
  ),
);

// ===== Auth store (client) =====
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  phone?: string | null;
  address?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  setUser: (u: AuthUser | null) => void;
  setLoading: (b: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (u) => set({ user: u }),
  setLoading: (b) => set({ loading: b }),
}));
