'use client';

import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup on unmount or when value/delay changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = []
): (...args: Parameters<T>) => void {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  dependencies: any[] = []
): (...args: Parameters<T>) => void {
  const lastRun = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= limit) {
      // Enough time has passed, execute immediately
      lastRun.current = now;
      callback(...args);
    } else if (!timerRef.current) {
      // Schedule execution for when enough time has passed
      timerRef.current = setTimeout(() => {
        lastRun.current = Date.now();
        callback(...args);
        timerRef.current = null;
      }, limit - timeSinceLastRun);
    }
  };
}

// Hook for debounced state
export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return [value, debouncedValue, setValue];
}

// Hook for debounced callback with leading and trailing options
export function useAdvancedDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): [T, () => void, () => void] {
  const {
    leading = false,
    trailing = true,
    maxWait,
  } = options;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTime = useRef<number | null>(null);
  const lastInvokeTime = useRef<number>(0);
  const pendingArgs = useRef<Parameters<T> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
    };
  }, []);

  const invokeCallback = useCallback((time: number) => {
    const args = pendingArgs.current;
    pendingArgs.current = null;
    lastInvokeTime.current = time;
    
    if (args) {
      callback(...args);
    }
  }, [callback]);

  const startTimer = useCallback((timerCallback: () => void, wait: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(timerCallback, wait);
  }, []);

  const debounced = useCallback((...args: Parameters<T>) => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    pendingArgs.current = args;
    lastCallTime.current = time;

    if (isInvoking) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (leading) {
        invokeCallback(time);
      }

      if (maxWait !== undefined) {
        if (maxTimerRef.current) {
          clearTimeout(maxTimerRef.current);
        }
        maxTimerRef.current = setTimeout(() => {
          const time = Date.now();
          invokeCallback(time);
          timerRef.current = null;
        }, maxWait);
      }
    }

    if (!timerRef.current && trailing) {
      startTimer(() => invokeCallback(Date.now()), delay);
    }
  }, [delay, leading, trailing, maxWait, invokeCallback, startTimer]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    pendingArgs.current = null;
    lastCallTime.current = null;
    lastInvokeTime.current = 0;
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current || maxTimerRef.current) {
      const time = Date.now();
      invokeCallback(time);
      cancel();
    }
  }, [invokeCallback, cancel]);

  const shouldInvoke = useCallback((time: number): boolean => {
    if (lastCallTime.current === null) return true;

    const timeSinceLastCall = time - lastCallTime.current;
    const timeSinceLastInvoke = time - lastInvokeTime.current;

    // Either time since last call is greater than delay,
    // or time since last invoke is greater than maxWait
    return (
      timeSinceLastCall >= delay ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }, [delay, maxWait]);

  return [debounced as T, cancel, flush];
}