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
      setCart(cart.map(item =>
        item.cartKey === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        cartKey: cartKey,
        name: product.name,
        price: product.price,
        quantity: 1,
        isReturn: false
      }]);
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
        name: 'Cup Return',
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
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
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
