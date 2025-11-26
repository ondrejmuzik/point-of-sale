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
        let updatedCart = prevCart.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        // Also add a cup when adding a drink (not when adding a cup itself)
        if (product.id !== 'cup') {
          const cupKey = 'cup';
          const existingCup = updatedCart.find(item => item.cartKey === cupKey);
          if (existingCup) {
            updatedCart = updatedCart.map(item =>
              item.cartKey === cupKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedCart = [...updatedCart, {
              id: 'cup',
              cartKey: cupKey,
              name: 'Kelímek',
              price: cupDeposit,
              quantity: 1,
              isReturn: false,
              isAutoCup: true
            }];
          }
        } else {
          // Adding extra cup separately
          const extraCupKey = 'cup-extra';
          const existingExtraCup = updatedCart.find(item => item.cartKey === extraCupKey);
          if (existingExtraCup) {
            updatedCart = updatedCart.map(item =>
              item.cartKey === extraCupKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedCart = [...updatedCart, {
              id: 'cup-extra',
              cartKey: extraCupKey,
              name: 'Kelímek prázdný',
              price: cupDeposit,
              quantity: 1,
              isReturn: false,
              isAutoCup: false
            }];
          }
        }

        return updatedCart;
      });
    } else {
      setCart(prevCart => {
        let newCart = prevCart;

        // Also add a cup when adding a drink (not when adding a cup itself)
        if (product.id !== 'cup') {
          // Add the product first
          newCart = [...newCart, {
            id: product.id,
            cartKey: cartKey,
            name: product.name,
            price: product.price,
            quantity: 1,
            isReturn: false
          }];

          const cupKey = 'cup';
          const existingCup = newCart.find(item => item.cartKey === cupKey);
          if (existingCup) {
            newCart = newCart.map(item =>
              item.cartKey === cupKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newCart = [...newCart, {
              id: 'cup',
              cartKey: cupKey,
              name: 'Kelímek',
              price: cupDeposit,
              quantity: 1,
              isReturn: false,
              isAutoCup: true
            }];
          }
        } else {
          // Adding extra cup separately - don't add the product itself, just the extra cup
          const extraCupKey = 'cup-extra';
          const existingExtraCup = newCart.find(item => item.cartKey === extraCupKey);
          if (existingExtraCup) {
            newCart = newCart.map(item =>
              item.cartKey === extraCupKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newCart = [...newCart, {
              id: 'cup-extra',
              cartKey: extraCupKey,
              name: 'Kelímek prázdný',
              price: cupDeposit,
              quantity: 1,
              isReturn: false,
              isAutoCup: false
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
    // When removing a beverage, also remove its cups
    const item = cart.find(i => i.cartKey === cartKey);
    if (item && item.id !== 'cup' && item.id !== 'return') {
      // This is a beverage being removed
      const newQuantity = Math.max(0, item.quantity + delta);
      const quantityChange = newQuantity - item.quantity;

      setCart(prevCart => {
        let updatedCart = prevCart.map(cartItem =>
          cartItem.cartKey === cartKey
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );

        // Adjust cup quantity by the same amount
        if (quantityChange !== 0) {
          updatedCart = updatedCart.map(cartItem =>
            cartItem.cartKey === 'cup'
              ? { ...cartItem, quantity: Math.max(0, cartItem.quantity + quantityChange) }
              : cartItem
          );
        }

        return updatedCart.filter(cartItem => cartItem.quantity > 0);
      });
    } else if (item && item.id === 'cup') {
      // When removing cups, also remove beverages proportionally
      const newQuantity = Math.max(0, item.quantity + delta);
      const quantityChange = newQuantity - item.quantity;

      setCart(prevCart => {
        let updatedCart = prevCart.map(cartItem =>
          cartItem.cartKey === 'cup'
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );

        // Remove beverages proportionally (remove all if cups go to 0)
        if (quantityChange !== 0) {
          const beverages = prevCart.filter(cartItem =>
            cartItem.id !== 'cup' && cartItem.id !== 'return'
          );

          beverages.forEach(beverage => {
            updatedCart = updatedCart.map(cartItem =>
              cartItem.cartKey === beverage.cartKey
                ? { ...cartItem, quantity: Math.max(0, cartItem.quantity + quantityChange) }
                : cartItem
            );
          });
        }

        return updatedCart.filter(cartItem => cartItem.quantity > 0);
      });
    } else {
      // Cup return - handle normally
      setCart(cart.map(cartItem =>
        cartItem.cartKey === cartKey
          ? { ...cartItem, quantity: Math.max(0, cartItem.quantity + delta) }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0));
    }
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
