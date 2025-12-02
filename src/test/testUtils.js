import { render } from '@testing-library/react';

export function renderWithProviders(ui, options = {}) {
  return render(ui, { ...options });
}

// Mock products matching constants/products.js
export const mockProducts = {
  svarak: { id: 1, name: 'Svařák', icon: 'wine.svg', price: 60.00 },
  most: { id: 2, name: 'Horký mošt', icon: 'apple.svg', price: 40.00 },
  certovsky: { id: 3, name: 'Čertovský mošt', icon: 'apple-extra.svg', price: 80.00 },
  cup: { id: 'cup', name: 'Kelímek', price: 50.00 },
};

export const createCartItem = (overrides = {}) => ({
  id: 1,
  cartKey: '1',
  name: 'Svařák',
  price: 60.00,
  quantity: 1,
  isReturn: false,
  ...overrides,
});

export * from '@testing-library/react';
