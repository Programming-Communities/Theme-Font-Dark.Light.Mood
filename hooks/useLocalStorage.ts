'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize once
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsInitialized(true);
      return;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      const value = item ? (parseJSON(item) as T) : initialValue;
      
      setStoredValue(value);
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    } finally {
      setIsInitialized(true);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') {
      console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
      return;
    }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch storage event for other tabs/windows
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(valueToStore),
        storageArea: window.localStorage,
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn(`Tried removing localStorage key "${key}" even though environment is not a client`);
      return;
    }

    try {
      // Remove from local storage
      window.localStorage.removeItem(key);
      
      // Reset state
      setStoredValue(initialValue);
      
      // Dispatch storage event
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: null,
        storageArea: window.localStorage,
      }));
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window.localStorage) {
        try {
          const newValue = event.newValue ? (parseJSON(event.newValue) as T) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing updated localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  // Subscribe to storage events from same tab
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomStorageEvent = (event: CustomEvent) => {
      if (event.detail?.key === key) {
        try {
          const newValue = event.detail.value;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error updating from custom event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('local-storage', handleCustomStorageEvent as EventListener);
    return () => window.removeEventListener('local-storage', handleCustomStorageEvent as EventListener);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Custom hook for storing objects with schema validation
export function useStoredObject<T extends object>(
  key: string,
  initialValue: T,
  schema?: (value: any) => boolean
): [T, (updater: (current: T) => T) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage<T>(key, initialValue);

  const updateValue = useCallback((updater: (current: T) => T) => {
    setValue(current => {
      const updated = updater(current);
      
      // Validate against schema if provided
      if (schema && !schema(updated)) {
        console.warn(`Schema validation failed for key "${key}"`);
        return current; // Don't update if validation fails
      }
      
      return updated;
    });
  }, [setValue, schema, key]);

  return [value, updateValue, removeValue];
}

// Hook for storing array data
export function useStoredArray<T>(
  key: string,
  initialValue: T[] = []
): {
  items: T[];
  addItem: (item: T) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: T) => void;
  clearItems: () => void;
  setItems: (items: T[]) => void;
} {
  const [items, setItems, removeItems] = useLocalStorage<T[]>(key, initialValue);

  const addItem = useCallback((item: T) => {
    setItems(current => [...current, item]);
  }, [setItems]);

  const removeItem = useCallback((index: number) => {
    setItems(current => current.filter((_, i) => i !== index));
  }, [setItems]);

  const updateItem = useCallback((index: number, item: T) => {
    setItems(current => current.map((currentItem, i) => i === index ? item : currentItem));
  }, [setItems]);

  const clearItems = useCallback(() => {
    removeItems();
  }, [removeItems]);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    setItems,
  };
}

// Hook for storing map/dictionary data
export function useStoredMap<T>(
  key: string,
  initialValue: Record<string, T> = {}
): {
  map: Record<string, T>;
  setItem: (key: string, value: T) => void;
  getItem: (key: string) => T | undefined;
  removeItem: (key: string) => void;
  clearMap: () => void;
} {
  const [map, setMap, removeMap] = useLocalStorage<Record<string, T>>(key, initialValue);

  const setItem = useCallback((itemKey: string, value: T) => {
    setMap(current => ({ ...current, [itemKey]: value }));
  }, [setMap]);

  const getItem = useCallback((itemKey: string): T | undefined => {
    return map[itemKey];
  }, [map]);

  const removeItem = useCallback((itemKey: string) => {
    setMap(current => {
      const { [itemKey]: removed, ...rest } = current;
      return rest;
    });
  }, [setMap]);

  const clearMap = useCallback(() => {
    removeMap();
  }, [removeMap]);

  return {
    map,
    setItem,
    getItem,
    removeItem,
    clearMap,
  };
}

// Hook with expiry support
export function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T,
  expiryInMinutes: number = 60
): [T | null, (value: T) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage<{
    value: T;
    expiry: number;
  } | null>(key, null);

  const setValueWithExpiry = useCallback((newValue: T) => {
    const now = new Date();
    const expiry = now.getTime() + expiryInMinutes * 60 * 1000;
    
    setValue({
      value: newValue,
      expiry,
    });
  }, [setValue, expiryInMinutes]);

  const getValue = useCallback((): T | null => {
    if (!value) return null;
    
    const now = new Date().getTime();
    if (now > value.expiry) {
      // Value has expired
      removeValue();
      return null;
    }
    
    return value.value;
  }, [value, removeValue]);

  return [getValue(), setValueWithExpiry, removeValue];
}

// Utility function to parse JSON safely
function parseJSON<T>(value: string): T {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value);
  } catch {
    console.error('Parsing error on', { value });
    return value as unknown as T;
  }
}

// Custom event for same-tab storage updates
export function emitStorageEvent(key: string, value: any) {
  if (typeof window === 'undefined') return;
  
  window.dispatchEvent(new CustomEvent('local-storage', {
    detail: { key, value },
  }));
}