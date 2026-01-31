/**
 * Storage Helper - Compatível com Web e Mobile
 * 
 * Usa localStorage na web e AsyncStorage no mobile
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = typeof window !== 'undefined';

class Storage {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      return localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      localStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    if (isWeb) {
      return keys.map(key => [key, localStorage.getItem(key)]);
    }
    return await AsyncStorage.multiGet(keys);
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    if (isWeb) {
      keyValuePairs.forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      return;
    }
    await AsyncStorage.multiSet(keyValuePairs);
  }

  async multiRemove(keys: string[]): Promise<void> {
    if (isWeb) {
      keys.forEach(key => localStorage.removeItem(key));
      return;
    }
    await AsyncStorage.multiRemove(keys);
  }
}

export default new Storage();
