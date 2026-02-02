/**
 * Storage Manager: Provides safe access to localStorage and sessionStorage
 * with error handling and fallbacks for restricted/private browsing modes
 */

type StorageType = 'local' | 'session';

class StorageManager {
  private isStorageAvailable(storageType: StorageType): boolean {
    try {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch {
      // Storage unavailable in private browsing or quota exceeded
      return false;
    }
  }

  setItem(key: string, value: string, storageType: StorageType = 'local'): boolean {
    try {
      if (!this.isStorageAvailable(storageType)) {
        console.warn(`${storageType}Storage is not available`);
        return false;
      }
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Failed to set ${storageType}Storage[${key}]:`, error);
      return false;
    }
  }

  getItem(key: string, storageType: StorageType = 'local'): string | null {
    try {
      if (!this.isStorageAvailable(storageType)) {
        return null;
      }
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      return storage.getItem(key);
    } catch (error) {
      console.error(`Failed to get ${storageType}Storage[${key}]:`, error);
      return null;
    }
  }

  removeItem(key: string, storageType: StorageType = 'local'): boolean {
    try {
      if (!this.isStorageAvailable(storageType)) {
        return false;
      }
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove ${storageType}Storage[${key}]:`, error);
      return false;
    }
  }

  clear(storageType: StorageType = 'local'): boolean {
    try {
      if (!this.isStorageAvailable(storageType)) {
        return false;
      }
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.clear();
      return true;
    } catch (error) {
      console.error(`Failed to clear ${storageType}Storage:`, error);
      return false;
    }
  }

  /**
   * Safely get and parse JSON from storage
   */
  getJSON<T = unknown>(key: string, storageType: StorageType = 'local'): T | null {
    try {
      const item = this.getItem(key, storageType);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to parse JSON from ${storageType}Storage[${key}]:`, error);
      return null;
    }
  }

  /**
   * Safely set and stringify JSON to storage
   */
  setJSON<T = unknown>(key: string, value: T, storageType: StorageType = 'local'): boolean {
    try {
      const json = JSON.stringify(value);
      return this.setItem(key, json, storageType);
    } catch (error) {
      console.error(`Failed to stringify JSON for ${storageType}Storage[${key}]:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();
