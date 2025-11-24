import { supabase } from '../lib/supabase';

/**
 * Storage hook using Supabase for persistent data storage
 * Provides get/set interface compatible with the original useStorage API
 */
export const useStorage = () => {
  /**
   * Get data from Supabase storage
   * @param {string} key - Storage key
   * @param {boolean} parse - Whether to parse JSON (kept for API compatibility)
   * @returns {Promise<any>} Stored value or null
   */
  const get = async (key, parse = false) => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - key doesn't exist yet
          console.log(`No existing data for key: ${key}`);
          return null;
        }
        throw error;
      }

      // Value is already parsed from JSON by Supabase (stored as JSONB)
      return data?.value;
    } catch (error) {
      console.error(`Failed to get data for key ${key}:`, error);
      return null;
    }
  };

  /**
   * Set data in Supabase storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {boolean} stringify - Whether to stringify (kept for API compatibility, not needed with JSONB)
   */
  const set = async (key, value, stringify = false) => {
    try {
      // Use upsert to insert or update
      const { error } = await supabase
        .from('settings')
        .upsert(
          {
            key: key,
            value: value, // Supabase JSONB column handles JSON automatically
          },
          {
            onConflict: 'key',
          }
        );

      if (error) throw error;
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
      throw error; // Re-throw so caller can handle
    }
  };

  return { get, set };
};
