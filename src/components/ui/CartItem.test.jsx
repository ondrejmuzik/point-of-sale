import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartItem from './CartItem';

describe('CartItem', () => {
  const mockOnUpdateQuantity = vi.fn();
  const mockCupItem = { name: 'Kelímek', price: 50 };

  beforeEach(() => {
    mockOnUpdateQuantity.mockClear();
  });

  describe('Rendering', () => {
    it('should render item name, quantity, and total price', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 2,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      expect(screen.getByText('Svařák')).toBeInTheDocument();
      expect(screen.getByText('x2')).toBeInTheDocument();
      expect(screen.getByText('120,-')).toBeInTheDocument();
    });

    it('should format price with ",-" suffix', () => {
      const item = {
        cartKey: '1',
        name: 'Test Item',
        price: 75,
        quantity: 1,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      expect(screen.getByText('75,-')).toBeInTheDocument();
    });

    it('should calculate total price correctly (price * quantity)', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 3,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      expect(screen.getByText('180,-')).toBeInTheDocument();
    });

    it('should render remove button', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 1,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      const removeButton = screen.getByRole('button', { name: '-' });
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe('Styling Classes', () => {
    it('should apply return class for cup returns', () => {
      const item = {
        cartKey: 'cup-return',
        name: 'Vrácení kelímku',
        price: -50,
        quantity: 1,
        id: 'return',
        isReturn: true
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      const itemElement = container.querySelector('.order-summary__item--return');
      expect(itemElement).toBeInTheDocument();
    });

    it('should apply cup class for cup items', () => {
      const item = {
        cartKey: 'cup',
        name: 'Kelímek',
        price: 50,
        quantity: 1,
        id: 'cup',
        isReturn: false
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      const itemElement = container.querySelector('.order-summary__item--cup');
      expect(itemElement).toBeInTheDocument();
    });

    it('should apply cup class for extra cup items', () => {
      const item = {
        cartKey: 'cup-extra',
        name: 'Kelímek prázdný',
        price: 50,
        quantity: 1,
        id: 'cup-extra',
        isReturn: false
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      const itemElement = container.querySelector('.order-summary__item--cup');
      expect(itemElement).toBeInTheDocument();
    });

    it('should not apply special classes for regular beverage items', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 1,
        id: 1,
        isReturn: false
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      expect(container.querySelector('.order-summary__item--return')).not.toBeInTheDocument();
      expect(container.querySelector('.order-summary__item--cup')).not.toBeInTheDocument();
    });
  });

  describe('Grouped Cup Display', () => {
    it('should show grouped cup under beverage when cupItem provided', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 2,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} cupItem={mockCupItem} />);

      expect(screen.getByText('Kelímek')).toBeInTheDocument();
    });

    it('should match cup quantity to beverage quantity in grouped display', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 3,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} cupItem={mockCupItem} />);

      const quantityElements = screen.getAllByText('x3');
      expect(quantityElements).toHaveLength(2); // One for beverage, one for grouped cup
    });

    it('should display cup price in grouped display', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 2,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} cupItem={mockCupItem} />);

      expect(screen.getByText('100,-')).toBeInTheDocument(); // 50 * 2
    });

    it('should apply grouped-cup styling class', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 1,
        id: 1,
        isReturn: false
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} cupItem={mockCupItem} />);

      const groupedCup = container.querySelector('.order-summary__item--grouped-cup');
      expect(groupedCup).toBeInTheDocument();
    });

    it('should apply muted classes to grouped cup elements', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 1,
        id: 1,
        isReturn: false
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} cupItem={mockCupItem} />);

      expect(container.querySelector('.order-summary__item-name--muted')).toBeInTheDocument();
      expect(container.querySelector('.order-summary__item-quantity--muted')).toBeInTheDocument();
      expect(container.querySelector('.order-summary__item-price--muted')).toBeInTheDocument();
    });

    it('should not show grouped cup for cup items', () => {
      const item = {
        cartKey: 'cup',
        name: 'Kelímek',
        price: 50,
        quantity: 1,
        id: 'cup',
        isReturn: false
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} cupItem={mockCupItem} />);

      const groupedCup = container.querySelector('.order-summary__item--grouped-cup');
      expect(groupedCup).not.toBeInTheDocument();
    });

    it('should not show grouped cup for return items', () => {
      const item = {
        cartKey: 'cup-return',
        name: 'Vrácení kelímku',
        price: -50,
        quantity: 1,
        id: 'return',
        isReturn: true
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} cupItem={mockCupItem} />);

      const groupedCup = container.querySelector('.order-summary__item--grouped-cup');
      expect(groupedCup).not.toBeInTheDocument();
    });

    it('should not show grouped cup when cupItem is not provided', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 1,
        id: 1,
        isReturn: false
      };

      const { container } = render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      const groupedCup = container.querySelector('.order-summary__item--grouped-cup');
      expect(groupedCup).not.toBeInTheDocument();
    });
  });

  describe('Staff Orders', () => {
    it('should show "0,-" for all items when isStaffOrder is true', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 2,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} isStaffOrder={true} />);

      expect(screen.getByText('0,-')).toBeInTheDocument();
      expect(screen.queryByText('120,-')).not.toBeInTheDocument();
    });

    it('should show "0,-" for grouped cup in staff orders', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 2,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} cupItem={mockCupItem} isStaffOrder={true} />);

      const zeroPrices = screen.getAllByText('0,-');
      expect(zeroPrices).toHaveLength(2); // One for item, one for grouped cup
    });

    it('should show calculated price when isStaffOrder is false', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 2,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} isStaffOrder={false} />);

      expect(screen.getByText('120,-')).toBeInTheDocument();
      expect(screen.queryByText('0,-')).not.toBeInTheDocument();
    });

    it('should show calculated price when isStaffOrder is not provided', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 1,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      expect(screen.getByText('60,-')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onUpdateQuantity with cartKey and -1 when remove clicked', async () => {
      const user = userEvent.setup();
      const item = {
        cartKey: 'test-key',
        name: 'Test Item',
        price: 60,
        quantity: 1,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      const removeButton = screen.getByRole('button', { name: '-' });
      await user.click(removeButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledTimes(1);
      expect(mockOnUpdateQuantity).toHaveBeenCalledWith('test-key', -1);
    });

    it('should call onUpdateQuantity with correct cartKey for different items', async () => {
      const user = userEvent.setup();
      const item = {
        cartKey: 'custom-cart-key-123',
        name: 'Svařák',
        price: 60,
        quantity: 5,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      const removeButton = screen.getByRole('button', { name: '-' });
      await user.click(removeButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith('custom-cart-key-123', -1);
    });

    it('should call onUpdateQuantity multiple times for multiple clicks', async () => {
      const user = userEvent.setup();
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 3,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      const removeButton = screen.getByRole('button', { name: '-' });
      await user.click(removeButton);
      await user.click(removeButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative prices for returns', () => {
      const item = {
        cartKey: 'cup-return',
        name: 'Vrácení kelímku',
        price: -50,
        quantity: 2,
        id: 'return',
        isReturn: true
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      expect(screen.getByText('-100,-')).toBeInTheDocument();
    });

    it('should handle zero quantity', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 0,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      expect(screen.getByText('x0')).toBeInTheDocument();
      expect(screen.getByText('0,-')).toBeInTheDocument();
    });

    it('should handle large quantities', () => {
      const item = {
        cartKey: '1',
        name: 'Svařák',
        price: 60,
        quantity: 100,
        id: 1,
        isReturn: false
      };

      render(<CartItem item={item} onUpdateQuantity={mockOnUpdateQuantity} />);

      expect(screen.getByText('x100')).toBeInTheDocument();
      expect(screen.getByText('6000,-')).toBeInTheDocument();
    });
  });
});
