import { CURRENCY_SYMBOL } from '../constants';

export const formatCurrency = (amount: number): string => {
  // Indian number format: 1,00,000
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formattedAmount;
};

export const formatPrice = (amount: number): string => {
  // Simple format with symbol
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`;
};
