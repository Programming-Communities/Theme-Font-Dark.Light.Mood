'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface LocalStorageOptions<T> {
  defaultValue?: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: Error) => void;
  syncAcrossTabs?: boolean;
}

export function useLocalStorage<T>(
  key: string,
  options: LocalStorageOptions<T> = {}
) {
  const {
    defaultValue,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError,
    syncAcrossTabs = true,
  } = options;

  // Get initial value from localStorage or use defaultValue
  const getStoredValue = useCallback((): T | undefined => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return deserializer(item);
    } catch (error) {
      onError?.(error as Error);
      return defaultValue;
    }
  }, [key, defaultValue, deserializer, onError]);

  const [storedValue, setStoredValue] = useState<T | undefined>(getStoredValue);
  const [isPersistent, setIsPersistent] = useState(true);

  // Listen for storage events (changes from other tabs)
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue === null 
            ? defaultValue 
            : deserializer(event.newValue);
          setStoredValue(newValue);
        } catch (error) {
          onError?.(error as Error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, deserializer, syncAcrossTabs, onError]);

  // Check if localStorage is available and persistent
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const testKey = `__test_persistence_${Date.now()}`;
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      setIsPersistent(true);
    } catch (error) {
      setIsPersistent(false);
      onError?.(error as Error);
    }
  }, [onError]);

  const setValue = useCallback((
    value: T | ((prevValue: T | undefined) => T)
  ) => {
    if (typeof window === 'undefined') return;

    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;

      // Save to state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serializer(valueToStore));
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, serializer, storedValue, onError]);

  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, defaultValue, onError]);

  const clearAll = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.clear();
      setStoredValue(defaultValue);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [defaultValue, onError]);

  const getKeys = useCallback((): string[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      onError?.(error as Error);
      return [];
    }
  }, [onError]);

  const hasKey = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      onError?.(error as Error);
      return false;
    }
  }, [key, onError]);

  const getSize = useCallback((): number => {
    if (typeof window === 'undefined') return 0;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? new Blob([item]).size : 0;
    } catch (error) {
      onError?.(error as Error);
      return 0;
    }
  }, [key, onError]);

  const getTotalSize = useCallback((): number => {
    if (typeof window === 'undefined') return 0;
    
    try {
      let total = 0;
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          const value = window.localStorage.getItem(key);
          if (value) {
            total += new Blob([key, value]).size;
          }
        }
      }
      return total;
    } catch (error) {
      onError?.(error as Error);
      return 0;
    }
  }, [onError]);

  // Force sync with localStorage (useful after restoring from session)
  const forceSync = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const value = getStoredValue();
      setStoredValue(value);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [getStoredValue, onError]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    clearAll,
    getKeys,
    hasKey,
    getSize,
    getTotalSize,
    isPersistent,
    forceSync,
  };
}

export interface UseSessionStorageOptions<T> extends LocalStorageOptions<T> {
  // SessionStorage-specific options can be added here
}

export function useSessionStorage<T>(
  key: string,
  options: UseSessionStorageOptions<T> = {}
) {
  const {
    defaultValue,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError,
  } = options;

  const getStoredValue = useCallback((): T | undefined => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return deserializer(item);
    } catch (error) {
      onError?.(error as Error);
      return defaultValue;
    }
  }, [key, defaultValue, deserializer, onError]);

  const [storedValue, setStoredValue] = useState<T | undefined>(getStoredValue);
  const [isPersistent, setIsPersistent] = useState(true);

  // Check if sessionStorage is available
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const testKey = `__test_session_persistence_${Date.now()}`;
      window.sessionStorage.setItem(testKey, 'test');
      window.sessionStorage.removeItem(testKey);
      setIsPersistent(true);
    } catch (error) {
      setIsPersistent(false);
      onError?.(error as Error);
    }
  }, [onError]);

  const setValue = useCallback((
    value: T | ((prevValue: T | undefined) => T)
  ) => {
    if (typeof window === 'undefined') return;

    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;

      setStoredValue(valueToStore);

      if (valueToStore === undefined) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, serializer(valueToStore));
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, serializer, storedValue, onError]);

  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, defaultValue, onError]);

  const clearAll = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.clear();
      setStoredValue(defaultValue);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [defaultValue, onError]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    clearAll,
    isPersistent,
  };
}

export interface StorageManager {
  getItem: <T>(key: string, defaultValue?: T) => T | undefined;
  setItem: <T>(key: string, value: T) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  getKeys: () => string[];
  hasItem: (key: string) => boolean;
  getSize: (key: string) => number;
  getTotalSize: () => number;
}

export function useStorageManager(
  storageType: 'local' | 'session' = 'local',
  onError?: (error: Error) => void
): StorageManager {
  const storage = storageType === 'local' 
    ? typeof window !== 'undefined' ? window.localStorage : null
    : typeof window !== 'undefined' ? window.sessionStorage : null;

  const getItem = useCallback(<T>(key: string, defaultValue?: T): T | undefined => {
    if (!storage) return defaultValue;

    try {
      const item = storage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      onError?.(error as Error);
      return defaultValue;
    }
  }, [storage, onError]);

  const setItem = useCallback(<T>(key: string, value: T): void => {
    if (!storage) return;

    try {
      if (value === undefined) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [storage, onError]);

  const removeItem = useCallback((key: string): void => {
    if (!storage) return;

    try {
      storage.removeItem(key);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [storage, onError]);

  const clear = useCallback((): void => {
    if (!storage) return;

    try {
      storage.clear();
    } catch (error) {
      onError?.(error as Error);
    }
  }, [storage, onError]);

  const getKeys = useCallback((): string[] => {
    if (!storage) return [];

    try {
      return Object.keys(storage);
    } catch (error) {
      onError?.(error as Error);
      return [];
    }
  }, [storage, onError]);

  const hasItem = useCallback((key: string): boolean => {
    if (!storage) return false;

    try {
      return storage.getItem(key) !== null;
    } catch (error) {
      onError?.(error as Error);
      return false;
    }
  }, [storage, onError]);

  const getSize = useCallback((key: string): number => {
    if (!storage) return 0;

    try {
      const item = storage.getItem(key);
      return item ? new Blob([item]).size : 0;
    } catch (error) {
      onError?.(error as Error);
      return 0;
    }
  }, [storage, onError]);

  const getTotalSize = useCallback((): number => {
    if (!storage) return 0;

    try {
      let total = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          const value = storage.getItem(key);
          if (value) {
            total += new Blob([key, value]).size;
          }
        }
      }
      return total;
    } catch (error) {
      onError?.(error as Error);
      return 0;
    }
  }, [storage, onError]);

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    getKeys,
    hasItem,
    getSize,
    getTotalSize,
  };
}

export interface EncryptedStorageOptions<T> {
  encryptionKey?: string;
  defaultValue?: T;
  onError?: (error: Error) => void;
}

export function useEncryptedLocalStorage<T>(
  key: string,
  options: EncryptedStorageOptions<T> = {}
) {
  const {
    encryptionKey = 'default-encryption-key',
    defaultValue,
    onError,
  } = options;

  // Simple encryption/decryption functions (for demonstration)
  // In production, use a proper encryption library like Web Crypto API
  const encrypt = useCallback((text: string): string => {
    try {
      // This is a simple XOR encryption for demonstration
      // DO NOT use in production
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
        result += String.fromCharCode(charCode);
      }
      return btoa(result);
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }, [encryptionKey]);

  const decrypt = useCallback<(text: string) => string>((
    encryptedText: string
  ): string => {
    try {
      const decoded = atob(encryptedText);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }, [encryptionKey]);

  const getStoredValue = useCallback((): T | undefined => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const encryptedItem = window.localStorage.getItem(key);
      if (encryptedItem === null) {
        return defaultValue;
      }

      const decrypted = decrypt(encryptedItem);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      onError?.(error as Error);
      return defaultValue;
    }
  }, [key, defaultValue, decrypt, onError]);

  const [storedValue, setStoredValue] = useState<T | undefined>(getStoredValue);

  const setValue = useCallback((
    value: T | ((prevValue: T | undefined) => T)
  ) => {
    if (typeof window === 'undefined') return;

    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;

      setStoredValue(valueToStore);

      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        const serialized = JSON.stringify(valueToStore);
        const encrypted = encrypt(serialized);
        window.localStorage.setItem(key, encrypted);
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, encrypt, storedValue, onError]);

  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, defaultValue, onError]);

  return {
    value: storedValue,
    setValue,
    removeValue,
  };
}

export function useStorageQuota() {
  const [quota, setQuota] = useState<{
    used: number;
    remaining: number;
    total: number;
    percentage: number;
  }>({
    used: 0,
    remaining: 0,
    total: 0,
    percentage: 0,
  });

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.storage) {
      setIsSupported(false);
      return;
    }

    const checkQuota = async () => {
      try {
        const estimate = await navigator.storage.estimate();
        
        if (estimate.usage && estimate.quota) {
          const used = estimate.usage;
          const total = estimate.quota;
          const remaining = total - used;
          const percentage = (used / total) * 100;

          setQuota({
            used,
            remaining,
            total,
            percentage,
          });
          setIsSupported(true);
        }
      } catch (error) {
        setIsSupported(false);
      }
    };

    checkQuota();
  }, []);

  const clearAll = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // Clear IndexedDB databases
      if (window.indexedDB) {
        const databases = await window.indexedDB.databases();
        databases.forEach(db => {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
          }
        });
      }

      // Clear cache storage
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map(name => window.caches.delete(name)));
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }, []);

  const getFormattedSize = useCallback((bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }, []);

  return {
    ...quota,
    isSupported,
    clearAll,
    getFormattedSize,
    formattedUsed: getFormattedSize(quota.used),
    formattedRemaining: getFormattedSize(quota.remaining),
    formattedTotal: getFormattedSize(quota.total),
  };
}