import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductButton from './ProductButton';

// Mock the SVG imports
vi.mock('../../assets/wine.svg', () => ({
  default: 'wine-icon-mock'
}));

vi.mock('../../assets/apple.svg', () => ({
  default: 'apple-icon-mock'
}));

vi.mock('../../assets/apple-devil.svg', () => ({
  default: 'apple-devil-icon-mock'
}));

describe('ProductButton', () => {
  const mockProduct = {
    id: 1,
    name: 'Svařák',
    icon: 'wine.svg',
    price: 60.00
  };
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Rendering', () => {
    it('should render product name', () => {
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      expect(screen.getByText('Svařák')).toBeInTheDocument();
    });

    it('should render product price with formatting', () => {
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      expect(screen.getByText('60,-')).toBeInTheDocument();
    });

    it('should format price to 0 decimal places', () => {
      const product = {
        ...mockProduct,
        price: 65.99
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      expect(screen.getByText('66,-')).toBeInTheDocument(); // toFixed(0) rounds 65.99 to 66
    });

    it('should render product icon image', () => {
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const img = screen.getByAltText('Svařák');
      expect(img).toBeInTheDocument();
      expect(img.tagName).toBe('IMG');
    });

    it('should set correct image src for wine icon', () => {
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const img = screen.getByAltText('Svařák');
      expect(img.src).toContain('wine-icon-mock');
    });
  });

  describe('Icon Mapping', () => {
    it('should use wine icon for wine.svg', () => {
      const product = {
        id: 1,
        name: 'Svařák',
        icon: 'wine.svg',
        price: 60.00
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      const img = screen.getByAltText('Svařák');
      expect(img.src).toContain('wine-icon-mock');
    });

    it('should use apple icon for apple.svg', () => {
      const product = {
        id: 2,
        name: 'Horký mošt',
        icon: 'apple.svg',
        price: 40.00
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      const img = screen.getByAltText('Horký mošt');
      expect(img.src).toContain('apple-icon-mock');
    });

    it('should use apple-devil icon for apple-extra.svg', () => {
      const product = {
        id: 3,
        name: 'Čertovský mošt',
        icon: 'apple-extra.svg',
        price: 80.00
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      const img = screen.getByAltText('Čertovský mošt');
      expect(img.src).toContain('apple-devil-icon-mock');
    });

    it('should fallback to wine icon for unknown icon names', () => {
      const product = {
        id: 4,
        name: 'Unknown Product',
        icon: 'unknown.svg',
        price: 50.00
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      const img = screen.getByAltText('Unknown Product');
      expect(img.src).toContain('wine-icon-mock'); // Should fallback to wine icon
    });
  });

  describe('Styling', () => {
    it('should have product-card class by default', () => {
      const { container } = render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const button = container.querySelector('.product-card');
      expect(button).toBeInTheDocument();
    });

    it('should apply clicked class when isClicked is true', () => {
      const { container } = render(
        <ProductButton product={mockProduct} onClick={mockOnClick} isClicked={true} />
      );

      const button = container.querySelector('.product-card--clicked');
      expect(button).toBeInTheDocument();
    });

    it('should not apply clicked class when isClicked is false', () => {
      const { container } = render(
        <ProductButton product={mockProduct} onClick={mockOnClick} isClicked={false} />
      );

      const button = container.querySelector('.product-card--clicked');
      expect(button).not.toBeInTheDocument();
    });

    it('should not apply clicked class when isClicked is not provided', () => {
      const { container } = render(
        <ProductButton product={mockProduct} onClick={mockOnClick} />
      );

      const button = container.querySelector('.product-card--clicked');
      expect(button).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick with product when button clicked', async () => {
      const user = userEvent.setup();
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockProduct);
    });

    it('should pass the complete product object to onClick', async () => {
      const user = userEvent.setup();
      const fullProduct = {
        id: 2,
        name: 'Horký mošt',
        icon: 'apple.svg',
        price: 40.00
      };

      render(<ProductButton product={fullProduct} onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledWith(fullProduct);
    });

    it('should handle multiple clicks', async () => {
      const user = userEvent.setup();
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Component Structure', () => {
    it('should render icon section with correct class', () => {
      const { container } = render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const iconSection = container.querySelector('.product-card__icon');
      expect(iconSection).toBeInTheDocument();
    });

    it('should render name section with correct class', () => {
      const { container } = render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const nameSection = container.querySelector('.product-card__name');
      expect(nameSection).toBeInTheDocument();
      expect(nameSection.textContent).toBe('Svařák');
    });

    it('should render price section with correct class', () => {
      const { container } = render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const priceSection = container.querySelector('.product-card__price');
      expect(priceSection).toBeInTheDocument();
      expect(priceSection.textContent).toBe('60,-');
    });

    it('should render as a button element', () => {
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Edge Cases', () => {
    it('should handle products with very long names', () => {
      const product = {
        id: 1,
        name: 'This is a very long product name that might wrap to multiple lines',
        icon: 'wine.svg',
        price: 60.00
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      expect(screen.getByText('This is a very long product name that might wrap to multiple lines')).toBeInTheDocument();
    });

    it('should handle zero price', () => {
      const product = {
        id: 1,
        name: 'Free Item',
        icon: 'wine.svg',
        price: 0.00
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      expect(screen.getByText('0,-')).toBeInTheDocument();
    });

    it('should handle large prices', () => {
      const product = {
        id: 1,
        name: 'Expensive Item',
        icon: 'wine.svg',
        price: 9999.00
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      expect(screen.getByText('9999,-')).toBeInTheDocument();
    });

    it('should handle decimal prices and round correctly', () => {
      const product = {
        id: 1,
        name: 'Item',
        icon: 'wine.svg',
        price: 42.50
      };

      render(<ProductButton product={product} onClick={mockOnClick} />);

      expect(screen.getByText('43,-')).toBeInTheDocument(); // toFixed(0) rounds 42.50 to 43
    });
  });

  describe('Accessibility', () => {
    it('should have alt text on image matching product name', () => {
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const img = screen.getByAltText('Svařák');
      expect(img).toBeInTheDocument();
    });

    it('should be keyboard accessible as a button', () => {
      render(<ProductButton product={mockProduct} onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});
