import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStorage } from './useStorage';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderNumber, setOrderNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const storage = useStorage();

  useEffect(() => {
    loadData();

    // Subscribe to real-time changes in orders table
    const subscription = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          // Reload orders when any change happens
          loadOrders();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadOrders(), loadOrderNumber()]);
    setLoading(false);
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    }
  };

  const loadOrderNumber = async () => {
    const result = await storage.get('orderNumber');
    if (result) {
      setOrderNumber(parseInt(result));
    }
  };

  const saveOrderNumber = async (num) => {
    await storage.set('orderNumber', num);
    setOrderNumber(num);
  };

  const addOrder = async (cart, getTotal, isStaffOrder = false) => {
    try {
      // Prepare order items
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
        order_number: orderNumber,
        items: orderItems,
        total: getTotal(),
        timestamp: new Date().toLocaleTimeString(),
        completed: false,
        is_staff_order: isStaffOrder
      };

      // Insert into Supabase
      const { error } = await supabase
        .from('orders')
        .insert([newOrder]);

      if (error) throw error;

      // Increment order number
      const nextOrderNum = orderNumber + 1;
      await saveOrderNumber(nextOrderNum);

      // Reload orders to get updated state
      await loadOrders();
    } catch (error) {
      console.error('Failed to add order:', error);
      throw error;
    }
  };

  const updateOrder = async (orderId, cart, getTotal) => {
    try {
      // Prepare order items
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

      // Update in Supabase
      const { error } = await supabase
        .from('orders')
        .update({
          items: orderItems,
          total: getTotal(),
          timestamp: new Date().toLocaleTimeString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Reload orders to get updated state
      await loadOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  };

  const toggleOrderComplete = async (orderId) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const { error } = await supabase
        .from('orders')
        .update({ completed: !order.completed })
        .eq('id', orderId);

      if (error) throw error;

      // Reload orders to get updated state
      await loadOrders();
    } catch (error) {
      console.error('Failed to toggle order completion:', error);
      throw error;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      // Reload orders to get updated state
      await loadOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
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
    deleteOrder,
    loading
  };
};
