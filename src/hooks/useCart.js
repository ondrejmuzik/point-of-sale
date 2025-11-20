import { useState } from 'react';
import { cupDeposit } from '../constants/products';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [clickedButton, setClickedButton] = useState(null);

  const addToCart = (product) => {
    const cartKey = `${product.id}`;

    // Visual feedback
    setClickedButton(product.id);
    setTimeout(() => setClickedButton(null), 200);

    const existing = cart.find(item => item.cartKey === cartKey);
    if (existing) {
      setCart(prevCart => {
        const updatedCart = prevCart.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        // Also add a cup when adding a drink (not when adding a cup itself)
        if (product.id !== 'cup') {
          const cupKey = 'cup';
          const existingCup = updatedCart.find(item => item.cartKey === cupKey);
          if (existingCup) {
            return updatedCart.map(item =>
              item.cartKey === cupKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...updatedCart, {
              id: 'cup',
              cartKey: cupKey,
              name: 'Kelímek',
              price: cupDeposit,
              quantity: 1,
              isReturn: false
            }];
          }
        }

        return updatedCart;
      });
    } else {
      setCart(prevCart => {
        const newCart = [...prevCart, {
          id: product.id,
          cartKey: cartKey,
          name: product.name,
          price: product.price,
          quantity: 1,
          isReturn: false
        }];

        // Also add a cup when adding a drink (not when adding a cup itself)
        if (product.id !== 'cup') {
          const cupKey = 'cup';
          const existingCup = newCart.find(item => item.cartKey === cupKey);
          if (existingCup) {
            return newCart.map(item =>
              item.cartKey === cupKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...newCart, {
              id: 'cup',
              cartKey: cupKey,
              name: 'Kelímek',
              price: cupDeposit,
              quantity: 1,
              isReturn: false
            }];
          }
        }

        return newCart;
      });
    }
  };

  const addCupReturn = () => {
    const cartKey = 'cup-return';
    const existing = cart.find(item => item.cartKey === cartKey);

    if (existing) {
      setCart(cart.map(item =>
        item.cartKey === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: 'return',
        cartKey: cartKey,
        name: 'Vrácení kelímku',
        price: -cupDeposit,
        quantity: 1,
        isReturn: true
      }]);
    }
  };

  const updateQuantity = (cartKey, delta) => {
    setCart(cart.map(item =>
      item.cartKey === cartKey
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0);
  };

  const loadCartFromOrder = (order) => {
    const cartItems = {};
    order.items.forEach(item => {
      const key = item.cartKey || `${item.id}`;
      if (cartItems[key]) {
        cartItems[key].quantity += 1;
      } else {
        cartItems[key] = {
          id: item.id,
          cartKey: key,
          name: item.name,
          price: item.price,
          quantity: 1,
          isReturn: false
        };
      }
    });

    setCart(Object.values(cartItems));
  };

  return {
    cart,
    setCart,
    clickedButton,
    addToCart,
    addCupReturn,
    updateQuantity,
    clearCart,
    getTotal,
    loadCartFromOrder
  };
};
