import type { CartLine } from './cart-store';

export type DemoOrder = {
  reference: string;
  lines: CartLine[];
  total: number | null;
  name: string;
  email: string;
  address: string[];
  payment: string;
};

// This demo is deliberately memory-only. No customer or payment data is persisted.
let receipt: DemoOrder | null = null;
const listeners = new Set<() => void>();
export const getDemoOrder = () => receipt;
export const getServerDemoOrder = () => null;
export const subscribeDemoOrder = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export function setDemoOrder(order: DemoOrder) { receipt = order; listeners.forEach(listener => listener()); }

export function validateCheckout(data: FormData) {
  const errors: Record<string, string> = {};
  for (const [name, label] of [['name', 'full name'], ['email', 'email address'], ['phone', 'phone number'], ['address', 'address'], ['postcode', 'postcode'], ['city', 'city'], ['state', 'state or territory']]) {
    if (!String(data.get(name) || '').trim()) errors[name] = `Please enter your ${label}.`;
  }
  if (data.get('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email')))) errors.email = 'Enter a valid email address.';
  if (data.get('postcode') && !/^\d{5}$/.test(String(data.get('postcode')))) errors.postcode = 'Enter a 5-digit Malaysian postcode.';
  if (data.get('phone') && !/^[+\d\s()-]{8,20}$/.test(String(data.get('phone')))) errors.phone = 'Enter a valid phone number.';
  if (!['Visa', 'Mastercard', 'Bank Transfer'].includes(String(data.get('payment')))) errors.payment = 'Choose a demo payment method.';
  return errors;
}
