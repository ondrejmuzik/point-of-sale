/**
 * Offline Storage Utility
 * Manages localStorage operations for offline orders and sync queue
 */

const OFFLINE_ORDERS_KEY = 'pos_offline_orders';
const SYNC_QUEUE_KEY = 'pos_sync_queue';

/**
 * Get all offline orders from localStorage
 */
export const getOfflineOrders = () => {
  try {
    const data = localStorage.getItem(OFFLINE_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get offline orders:', error);
    return [];
  }
};

/**
 * Save a new offline order to localStorage
 */
export const saveOfflineOrder = (order) => {
  try {
    const orders = getOfflineOrders();
    orders.push(order);
    localStorage.setItem(OFFLINE_ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Failed to save offline order:', error);
    throw error;
  }
};

/**
 * Update an existing offline order
 */
export const updateOfflineOrder = (orderId, updates) => {
  try {
    const orders = getOfflineOrders();
    const index = orders.findIndex(o => o.id === orderId);

    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(OFFLINE_ORDERS_KEY, JSON.stringify(orders));
    }
  } catch (error) {
    console.error('Failed to update offline order:', error);
    throw error;
  }
};

/**
 * Remove an offline order from localStorage
 */
export const removeOfflineOrder = (orderId) => {
  try {
    const orders = getOfflineOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    localStorage.setItem(OFFLINE_ORDERS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove offline order:', error);
    throw error;
  }
};

/**
 * Get the sync queue
 */
export const getSyncQueue = () => {
  try {
    const data = localStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get sync queue:', error);
    return [];
  }
};

/**
 * Add operation to sync queue
 */
export const addToSyncQueue = (operation) => {
  try {
    const queue = getSyncQueue();
    queue.push(operation);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to add to sync queue:', error);
    throw error;
  }
};

/**
 * Remove operation from sync queue after successful sync
 */
export const removeFromSyncQueue = (operationId) => {
  try {
    const queue = getSyncQueue();
    const filtered = queue.filter(op => op.id !== operationId);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from sync queue:', error);
    throw error;
  }
};

/**
 * Update retry count for an operation
 */
export const incrementRetryCount = (operationId) => {
  try {
    const queue = getSyncQueue();
    const operation = queue.find(op => op.id === operationId);

    if (operation) {
      operation.retries = (operation.retries || 0) + 1;
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  } catch (error) {
    console.error('Failed to increment retry count:', error);
    throw error;
  }
};

/**
 * Deduplicate queue by merging redundant operations
 * For example: CREATE_ORDER + UPDATE_ORDER for same order = just CREATE_ORDER with latest data
 */
export const deduplicateQueue = () => {
  try {
    const queue = getSyncQueue();
    const latestOps = {};

    queue.forEach(op => {
      const key = `${op.type}_${op.payload?.id || op.id}`;

      // For CREATE operations, keep merging updates
      if (op.type === 'CREATE_ORDER') {
        if (!latestOps[key]) {
          latestOps[key] = op;
        } else {
          // Merge payload updates into the CREATE operation
          latestOps[key].payload = { ...latestOps[key].payload, ...op.payload };
          latestOps[key].timestamp = op.timestamp;
        }
      } else {
        // For other operations, just keep the latest
        if (!latestOps[key] || latestOps[key].timestamp < op.timestamp) {
          latestOps[key] = op;
        }
      }
    });

    const deduped = Object.values(latestOps).sort((a, b) => a.timestamp - b.timestamp);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(deduped));

    return deduped;
  } catch (error) {
    console.error('Failed to deduplicate queue:', error);
    return getSyncQueue();
  }
};

/**
 * Clear all offline data after successful sync
 */
export const clearOfflineData = () => {
  try {
    localStorage.removeItem(OFFLINE_ORDERS_KEY);
    localStorage.removeItem(SYNC_QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear offline data:', error);
    throw error;
  }
};

/**
 * Get count of pending operations
 */
export const getPendingCount = () => {
  return getSyncQueue().length;
};

/**
 * Check if there are any offline orders
 */
export const hasOfflineOrders = () => {
  return getOfflineOrders().length > 0;
};
