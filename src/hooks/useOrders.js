import { useState, useEffect } from 'react';
import { useStorage } from './useStorage';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderNumber, setOrderNumber] = useState(1);
  const storage = useStorage();

  useEffect(() => {
    loadOrders();
    loadOrderNumber();
  }, []);

  const loadOrders = async () => {
    const result = await storage.get('orders', true);
    if (result) {
      setOrders(result);
    }
  };

  const loadOrderNumber = async () => {
    const result = await storage.get('orderNumber');
    if (result) {
      setOrderNumber(parseInt(result));
    }
  };

  const saveOrders = async (newOrders) => {
    await storage.set('orders', newOrders, true);
    setOrders(newOrders);
  };

  const saveOrderNumber = async (num) => {
    await storage.set('orderNumber', num.toString());
    setOrderNumber(num);
  };

  const addOrder = async (cart, getTotal) => {
    const orderItems = [];
    cart.forEach(item => {
      if (!item.isReturn) {
        for (let i = 0; i < item.quantity; i++) {
          orderItems.push({
            ...item,
            quantity: 1,
            ready: false,
            itemId: `${Date.now()}-${Math.random()}-${i}`
          });
        }
      }
    });

    const newOrder = {
      id: Date.now(),
      orderNumber: orderNumber,
      items: orderItems,
      total: getTotal(),
      timestamp: new Date().toLocaleTimeString(),
      completed: false
    };

    const newOrders = [...orders, newOrder];
    await saveOrders(newOrders);

    const nextOrderNum = orderNumber + 1;
    await saveOrderNumber(nextOrderNum);
  };

  const updateOrder = async (orderId, cart, getTotal) => {
    const orderItems = [];
    cart.forEach(item => {
      if (!item.isReturn) {
        for (let i = 0; i < item.quantity; i++) {
          orderItems.push({
            ...item,
            quantity: 1,
            ready: false,
            itemId: `${Date.now()}-${Math.random()}-${i}`
          });
        }
      }
    });

    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? {
            ...order,
            items: orderItems,
            total: getTotal(),
            timestamp: new Date().toLocaleTimeString()
          }
        : order
    );

    await saveOrders(updatedOrders);
  };

  const toggleOrderComplete = async (orderId) => {
    const newOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, completed: !order.completed }
        : order
    );
    await saveOrders(newOrders);
  };

  const deleteOrder = async (orderId) => {
    const newOrders = orders.filter(order => order.id !== orderId);
    await saveOrders(newOrders);
  };

  const pendingOrders = orders.filter(o => !o.completed);
  const completedOrders = orders.filter(o => o.completed);

  return {
    orders,
    orderNumber,
    pendingOrders,
    completedOrders,
    addOrder,
    updateOrder,
    toggleOrderComplete,
    deleteOrder
  };
};
