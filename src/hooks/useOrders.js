import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStorage } from './useStorage';
import { useNetworkStatus } from './useNetworkStatus';
import {
  addToSyncQueue,
  getOfflineOrders,
  saveOfflineOrder
} from '../utils/offlineStorage';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOnline } = useNetworkStatus();

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
    await loadOrders();
    setLoading(false);
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      // Merge online orders with offline orders
      const offlineOrders = getOfflineOrders();
      const allOrders = [...(data || []), ...offlineOrders];
      setOrders(allOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);

      // If loading fails, show only offline orders
      const offlineOrders = getOfflineOrders();
      setOrders(offlineOrders);
    }
  };

  const getNextOrderNumber = async () => {
    try {
      // Always get the max order number from the orders table
      const { data, error } = await supabase
        .from('orders')
        .select('order_number')
        .order('order_number', { ascending: false })
        .limit(1);

      if (error) throw error;

      return data?.[0]?.order_number ? data[0].order_number + 1 : 1;
    } catch (error) {
      console.error('Failed to get next order number:', error);
      return 1; // Fallback to 1 if query fails
    }
  };

  const addOrder = async (cart, getTotal, isStaffOrder = false, note = '') => {
    // Prepare order items
    const orderItems = [];
    cart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        orderItems.push({
          ...item,
          quantity: 1,
          ready: false,
          itemId: `${Date.now()}-${Math.random()}-${i}`
        });
      }
    });

    const newOrder = {
      id: Date.now(),
      order_number: null, // Will be assigned during sync or below
      items: orderItems,
      total: getTotal(),
      timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', hour12: false }),
      completed: false,
      is_staff_order: isStaffOrder,
      note: note.trim()
    };

    if (!isOnline) {
      // Offline: Save to localStorage and queue for sync
      saveOfflineOrder(newOrder);
      addToSyncQueue({
        id: `sync-${Date.now()}-${Math.random()}`,
        type: 'CREATE_ORDER',
        payload: newOrder,
        timestamp: Date.now(),
        retries: 0
      });

      // Manually add to local state for immediate UI update
      setOrders(prev => [...prev, newOrder]);
      return;
    }

    try {
      // Online: Get next order number and insert
      const nextOrderNumber = await getNextOrderNumber();
      const orderWithNumber = { ...newOrder, order_number: nextOrderNumber };
      const { error } = await supabase
        .from('orders')
        .insert([orderWithNumber]);

      if (error) throw error;

      // Reload orders to get updated state
      await loadOrders();
    } catch (error) {
      console.error('Failed to add order:', error);

      // If online insert failed, fall back to offline mode
      saveOfflineOrder(newOrder);
      addToSyncQueue({
        id: `sync-${Date.now()}-${Math.random()}`,
        type: 'CREATE_ORDER',
        payload: newOrder,
        timestamp: Date.now(),
        retries: 0
      });

      // Manually add to local state for immediate UI update
      setOrders(prev => [...prev, newOrder]);
    }
  };

  const updateOrder = async (orderId, cart, getTotal, isStaffOrder, note = '') => {
    try {
      // Prepare order items
      const orderItems = [];
      cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          orderItems.push({
            ...item,
            quantity: 1,
            ready: false,
            itemId: `${Date.now()}-${Math.random()}-${i}`
          });
        }
      });

      // Update in Supabase
      const { error } = await supabase
        .from('orders')
        .update({
          items: orderItems,
          total: getTotal(),
          timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', hour12: false }),
          is_staff_order: isStaffOrder,
          note: note.trim()
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

  const updateOrderNote = async (orderId, newNote) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ note: newNote.trim() })
        .eq('id', orderId);

      if (error) throw error;

      await loadOrders();
    } catch (error) {
      console.error('Failed to update order note:', error);
      throw error;
    }
  };

  const getOrdersForExport = () => orders;

  const purgeAllOrders = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .neq('id', 0); // Delete all orders (neq id 0 matches all rows)

      if (error) throw error;

      // Reload orders to clear state
      await loadOrders();

      return { success: true };
    } catch (error) {
      console.error('Failed to purge orders:', error);
      return { success: false, error: error.message };
    }
  };

  const pendingOrders = orders.filter(o => !o.completed);
  const completedOrders = orders.filter(o => o.completed).reverse();

  return {
    orders,
    pendingOrders,
    completedOrders,
    addOrder,
    updateOrder,
    toggleOrderComplete,
    deleteOrder,
    updateOrderNote,
    getOrdersForExport,
    purgeAllOrders,
    loading,
    loadOrders,
    getNextOrderNumber
  };
};
