import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to monitor network status and Supabase connectivity
 * Returns whether the app is currently online and able to reach Supabase
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const timeoutRef = useRef(null);

  /**
   * Verify actual Supabase connectivity (not just network interface)
   */
  const verifyConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const { error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);

      clearTimeout(timeoutId);
      return !error;
    } catch (error) {
      console.warn('Failed to verify Supabase connection:', error.message);
      return false;
    }
  };

  /**
   * Perform periodic connectivity checks (every 10 seconds)
   */
  useEffect(() => {
    const performCheck = async () => {
      const connected = await verifyConnection();
      setIsOnline(connected);

      // Schedule next check
      timeoutRef.current = setTimeout(performCheck, 10000);
    };

    // Start periodic checks
    timeoutRef.current = setTimeout(performCheck, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    /**
     * Handle online event - verify actual connection
     */
    const handleOnline = async () => {
      console.log('Online event detected, verifying connection...');
      const connected = await verifyConnection();
      setIsOnline(connected);
    };

    /**
     * Handle offline event
     */
    const handleOffline = () => {
      console.log('Offline event detected');
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    checkConnection: verifyConnection
  };
};
