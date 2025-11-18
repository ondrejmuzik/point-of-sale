export const useStorage = () => {
  const get = async (key, parse = false) => {
    try {
      const result = await window.storage.get(key, true);
      if (result && parse) {
        return JSON.parse(result.value);
      }
      return result?.value;
    } catch (error) {
      console.log(`No existing data for key: ${key}`);
      return null;
    }
  };

  const set = async (key, value, stringify = false) => {
    try {
      const dataToStore = stringify ? JSON.stringify(value) : value;
      await window.storage.set(key, dataToStore, true);
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
    }
  };

  return { get, set };
};
