export type CartLine = { slug: string; quantity: number; variant?: string };
export const cartLineKey = (line: CartLine) => JSON.stringify([line.slug, line.variant || '']);
type Snapshot = { lines: CartLine[]; loaded: boolean; storageError: boolean };
const key = 'astamall-cart-v1';
const serverSnapshot: Snapshot = { lines: [], loaded: false, storageError: false };
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();

function decode(raw: string | null): CartLine[] {
  const value: unknown = JSON.parse(raw || '[]');
  if (!Array.isArray(value)) return [];
  const merged = new Map<string, CartLine>();
  for (const item of value) {
    if (!item || typeof item.slug !== 'string' || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    const line: CartLine = { slug: item.slug, quantity: item.quantity, ...(typeof item.variant === 'string' && item.variant.length <= 100 ? { variant: item.variant } : {}) };
    const id = cartLineKey(line);
    merged.set(id, { ...line, quantity: Math.min(99, (merged.get(id)?.quantity || 0) + line.quantity) });
  }
  return [...merged.values()];
}

export function getCartSnapshot(): Snapshot {
  if (typeof window === 'undefined') return serverSnapshot;
  if (!snapshot.loaded) {
    try { snapshot = { lines: decode(window.localStorage.getItem(key)), loaded: true, storageError: false }; }
    catch { snapshot = { lines: [], loaded: true, storageError: true }; }
  }
  return snapshot;
}

export const getServerCartSnapshot = () => serverSnapshot;

function onStorage(event: StorageEvent) {
  if (event.key !== key && event.key !== null) return;
  try { snapshot = { lines: decode(event.newValue), loaded: true, storageError: false }; }
  catch { return; }
  listeners.forEach(listener => listener());
}

export function subscribeCart(listener: () => void) {
  if (!listeners.size) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener('storage', onStorage);
  };
}

export function changeCart(update: (lines: CartLine[]) => CartLine[]) {
  const lines = update(getCartSnapshot().lines);
  let storageError = false;
  try { window.localStorage.setItem(key, JSON.stringify(lines)); }
  catch { storageError = true; }
  snapshot = { lines, loaded: true, storageError };
  listeners.forEach(listener => listener());
}
