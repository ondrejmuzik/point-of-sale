import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  getSyncQueue,
  removeFromSyncQueue,
  incrementRetryCount,
  clearOfflineData,
  getOfflineOrders,
  removeOfflineOrder,
  deduplicateQueue,
  getPendingCount
} from '../utils/offlineStorage';
import { useStorage } from './useStorage';

const MAX_RETRIES = 5;

/**
 * Hook to manage sync queue processing and Supabase operations
 */
export const useSyncManager = (onSyncComplete) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [pendingCount, setPendingCount] = useState(() => getPendingCount());
  const storage = useStorage();

  /**
   * Update pending count from localStorage (triggers on component mount and periodically)
   */
  useEffect(() => {
    const updatePendingCount = () => {
      setPendingCount(getPendingCount());
    };

    // Update immediately
    updatePendingCount();

    // Update every 2 seconds to catch changes from other tabs/windows
    const interval = setInterval(updatePendingCount, 2000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Process a single sync queue operation
   */
  const processOperation = useCallback(async (operation) => {
    try {
      switch (operation.type) {
        case 'CREATE_ORDER': {
          // For CREATE operations, assign order number if null and insert into Supabase
          let payload = operation.payload;
          let assignedOrderNumber = payload.order_number;

          if (payload.order_number === null) {
            // Get current max order number from Supabase
            const { data } = await supabase
              .from('orders')
              .select('order_number')
              .order('order_number', { ascending: false })
              .limit(1);

            const nextNumber = data?.[0]?.order_number ? data[0].order_number + 1 : 1;
            assignedOrderNumber = nextNumber;
            payload = { ...payload, order_number: nextNumber };
          }

          const { error } = await supabase
            .from('orders')
            .insert([payload]);

          if (error) throw error;

          // Update the settings table with the next order number
          await storage.set('orderNumber', assignedOrderNumber + 1);

          // Remove from offline orders after successful sync
          removeOfflineOrder(operation.payload.id);
          break;
        }

        case 'UPDATE_ORDER': {
          // For UPDATE operations, update the order
          const { error } = await supabase
            .from('orders')
            .update(operation.payload.updates)
            .eq('id', operation.payload.id);

          if (error) throw error;
          break;
        }

        case 'DELETE_ORDER': {
          // For DELETE operations, delete the order
          const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', operation.payload.id);

          if (error) throw error;
          break;
        }

        case 'TOGGLE_COMPLETE': {
          // For TOGGLE operations, update the completed status
          const { error } = await supabase
            .from('orders')
            .update({ completed: operation.payload.completed })
            .eq('id', operation.payload.id);

          if (error) throw error;
          break;
        }

        case 'UPDATE_NOTE': {
          // For UPDATE_NOTE operations, update the note
          const { error } = await supabase
            .from('orders')
            .update({ note: operation.payload.note })
            .eq('id', operation.payload.id);

          if (error) throw error;
          break;
        }

        default:
          console.warn(`Unknown operation type: ${operation.type}`);
      }

      // Operation successful - remove from queue
      removeFromSyncQueue(operation.id);
      return true;
    } catch (error) {
      console.error(`Failed to process operation ${operation.id}:`, error);

      // Increment retry count
      incrementRetryCount(operation.id);

      return false;
    }
  }, [storage]);

  /**
   * Sync all pending operations
   */
  const syncPendingOperations = useCallback(async () => {
    if (isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Deduplicate queue to merge redundant operations
      const queue = deduplicateQueue();

      if (queue.length === 0) {
        console.log('No operations to sync');
        setIsSyncing(false);
        return;
      }

      console.log(`Starting sync of ${queue.length} operations`);

      // Process queue sequentially
      for (const operation of queue) {
        // Check retry limit
        if (operation.retries >= MAX_RETRIES) {
          console.error(
            `Operation ${operation.id} exceeded max retries (${MAX_RETRIES})`,
            operation
          );
          removeFromSyncQueue(operation.id);
          continue;
        }

        console.log(`Processing operation: ${operation.id} (type: ${operation.type})`);
        const success = await processOperation(operation);

        if (!success) {
          console.warn(`Operation ${operation.id} failed, will retry on next sync`);
          // Don't break - continue processing other operations
        } else {
          console.log(`Operation ${operation.id} synced successfully`);
        }
      }

      // Only clear offline data if sync queue is now empty
      const remainingQueue = deduplicateQueue();
      if (remainingQueue.length === 0) {
        clearOfflineData();
        console.log('Sync completed successfully - all operations synced and data cleared');
      } else {
        console.log(`Sync completed with ${remainingQueue.length} operations still pending`);
      }

      // Update pending count
      setPendingCount(getPendingCount());

      // Call the callback if provided
      if (onSyncComplete) {
        console.log('Calling onSyncComplete callback');
        onSyncComplete();
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, processOperation, onSyncComplete]);

  return {
    syncPendingOperations,
    isSyncing,
    syncError,
    pendingCount
  };
};
