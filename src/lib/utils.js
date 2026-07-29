export function cn(...classNames) {
  return classNames.filter(Boolean).join(' ');
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
    .substring(0, 100);
}

export function formatCurrency(amount, currency = 'PKR', locale = 'en-PK') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateDiscount(unitPrice, discountType, discountValue, quantity = 1) {
  if (!discountType || discountValue <= 0) return 0;

  let subtotal = unitPrice * quantity;

  if (discountType === 'percentage') {
    return (subtotal * discountValue) / 100;
  } else if (discountType === 'fixed') {
    return Math.min(discountValue * quantity, subtotal);
  }

  return 0;
}

export function getCurrencySymbol(currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0)
    .replace(/0|[,.]/g, '');
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateRandomString(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return str;
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
    .substring(0, 100);
}