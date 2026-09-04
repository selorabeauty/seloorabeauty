import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString('ar-SA')} ر.س`;
}

export function generateOrderId() {
  return `SLR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export function validateKSAPhone(phone: string) {
  return /^0[0-9]{9}$/.test(phone.replace(/\s/g, ''));
}
