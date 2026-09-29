'use client';

import { createContext, useContext } from 'react';
import type { CartLine } from '@/lib/cart-store';

export type AddOptions = { origin?: HTMLElement; drawer?: boolean; variant?: string };
export type Store = {
  lines: CartLine[];
  loaded: boolean;
  add: (slug: string, quantity?: number, options?: AddOptions) => Promise<void>;
  update: (slug: string, quantity: number) => void;
  openCart: () => void;
};
export const StoreContext = createContext<Store | null>(null);
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Store provider required');
  return store;
}
