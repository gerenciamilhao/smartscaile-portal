export interface PurchaseEntry {
  platform: { initial: string; color: string; bg: string };
  name: string;
  value: string;
}

export const PURCHASE_POOL: PurchaseEntry[] = [
  { platform: { initial: 'GA', color: '#E37400', bg: 'rgba(227,116,0,0.14)' }, name: 'purchase',        value: 'R$ 749,00' },
  { platform: { initial: 'M',  color: '#0081FB', bg: 'rgba(0,129,251,0.14)' }, name: 'Purchase',        value: 'R$ 215,00' },
  { platform: { initial: 'GA', color: '#E37400', bg: 'rgba(227,116,0,0.14)' }, name: 'purchase',        value: 'R$ 1.247,00' },
  { platform: { initial: 'TK', color: '#fe2c55', bg: 'rgba(254,44,85,0.14)' }, name: 'CompletePayment', value: 'R$ 89,90' },
  { platform: { initial: 'M',  color: '#0081FB', bg: 'rgba(0,129,251,0.14)' }, name: 'Purchase',        value: 'R$ 412,00' },
];

export const PURCHASE_POOL_EXTENDED: PurchaseEntry[] = [
  ...PURCHASE_POOL,
  { platform: { initial: 'GA', color: '#E37400', bg: 'rgba(227,116,0,0.14)' }, name: 'add_to_cart',      value: 'R$ 145,00' },
  { platform: { initial: 'TK', color: '#fe2c55', bg: 'rgba(254,44,85,0.14)' }, name: 'ViewContent',      value: 'R$ 67,50' },
  { platform: { initial: 'M',  color: '#0081FB', bg: 'rgba(0,129,251,0.14)' }, name: 'InitiateCheckout', value: 'R$ 523,00' },
];
