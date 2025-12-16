'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  }
): [T, () => void, () => void] {
  const {
    leading = false,
    trailing = true,
    maxWait,
  } = options || {};

  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTimeRef = useRef<number>(0);
  const lastInvokeTimeRef = useRef<number>(0);
  const pendingArgsRef = useRef<any[]>();

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
      }
    };
  }, []);

  const invokeCallback = useCallback((time: number) => {
    const args = pendingArgsRef.current;
    pendingArgsRef.current = undefined;
    lastInvokeTimeRef.current = time;
    callbackRef.current(...(args || []));
  }, []);

  const startTimer = useCallback((timerCallback: () => void, waitTime: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(timerCallback, waitTime);
  }, []);

  const shouldInvoke = useCallback((time: number) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

    // Either this is the first call, or time since last call is greater than delay,
    // or time since last invoke is greater than maxWait
    return (
      lastCallTimeRef.current === 0 ||
      timeSinceLastCall >= delay ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }, [delay, maxWait]);

  const trailingEdge = useCallback((time: number) => {
    timeoutRef.current = undefined;

    // Only invoke if we have pending args (meaning the function was called at least once)
    if (trailing && pendingArgsRef.current) {
      invokeCallback(time);
    }
  }, [trailing, invokeCallback]);

  const timerExpired = useCallback(() => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge(time);
    } else {
      // Restart the timer
      const timeSinceLastCall = time - lastCallTimeRef.current;
      const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
      const timeWaiting = delay - timeSinceLastCall;
      const remainingWait = maxWait !== undefined
        ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;

      startTimer(timerExpired, remainingWait);
    }
  }, [delay, maxWait, shouldInvoke, trailingEdge, startTimer]);

  const debounced = useCallback((...args: Parameters<T>) => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    pendingArgsRef.current = args;
    lastCallTimeRef.current = time;

    if (isInvoking) {
      if (timeoutRef.current === undefined) {
        // Leading edge
        if (leading) {
          invokeCallback(time);
        }

        // Start timer for trailing edge
        startTimer(timerExpired, delay);

        // Start maxWait timer if specified
        if (maxWait !== undefined) {
          if (maxWaitTimeoutRef.current) {
            clearTimeout(maxWaitTimeoutRef.current);
          }
          maxWaitTimeoutRef.current = setTimeout(() => {
            const currentTime = Date.now();
            if (shouldInvoke(currentTime)) {
              invokeCallback(currentTime);
            }
          }, maxWait);
        }
      }
    } else if (timeoutRef.current === undefined) {
      // Start timer for next call
      startTimer(timerExpired, delay);
    }
  }, [delay, maxWait, leading, shouldInvoke, invokeCallback, startTimer, timerExpired]) as T;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = undefined;
    }
    pendingArgsRef.current = undefined;
    lastCallTimeRef.current = 0;
    lastInvokeTimeRef.current = 0;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (pendingArgsRef.current) {
      const time = Date.now();
      invokeCallback(time);
    }
  }, [invokeCallback]);

  return [debounced, cancel, flush];
}

export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: any[],
  delay: number
): void {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}

export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, (value: T | ((prev: T) => T)) => void, T] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  const setValueImmediate = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(newValue);
    setDebouncedValue(prev => 
      typeof newValue === 'function' 
        ? (newValue as Function)(prev)
        : newValue
    );
  }, []);

  return [value, setValueImmediate, debouncedValue];
}

export interface DebouncedInputOptions {
  delay?: number;
  minLength?: number;
  onChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
}

export function useDebouncedInput(initialValue: string = '', options: DebouncedInputOptions = {}) {
  const {
    delay = 300,
    minLength = 0,
    onChange,
    onDebouncedChange,
  } = options;

  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    if (value.length < minLength) {
      setDebouncedValue(value);
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
      onDebouncedChange?.(value);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [value, delay, minLength, onDebouncedChange]);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const clear = useCallback(() => {
    setValue('');
    setDebouncedValue('');
    onChange?.('');
    onDebouncedChange?.('');
  }, [onChange, onDebouncedChange]);

  return {
    value,
    debouncedValue,
    isDebouncing,
    handleChange,
    clear,
    setValue,
    setDebouncedValue,
  };
}

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
  options: ThrottleOptions = {}
): T {
  const { leading = true, trailing = true } = options;
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTimeRef = useRef<number>(0);
  const pendingArgsRef = useRef<any[]>();

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttled = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;

    pendingArgsRef.current = args;

    if (timeSinceLastCall >= wait) {
      // Enough time has passed, call immediately
      if (leading) {
        callbackRef.current(...args);
      }
      lastCallTimeRef.current = now;

      // Clear any pending trailing call
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    } else if (trailing && !timeoutRef.current) {
      // Schedule a trailing call
      const remainingWait = wait - timeSinceLastCall;
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...(pendingArgsRef.current || []));
        lastCallTimeRef.current = Date.now();
        timeoutRef.current = undefined;
      }, remainingWait);
    }
  }, [wait, leading, trailing]) as T;

  return throttled;
}

export function useThrottledValue<T>(value: T, wait: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdateTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

    if (timeSinceLastUpdate >= wait) {
      // Update immediately if enough time has passed
      setThrottledValue(value);
      lastUpdateTimeRef.current = now;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    } else if (!timeoutRef.current) {
      // Schedule update
      const remainingWait = wait - timeSinceLastUpdate;
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastUpdateTimeRef.current = Date.now();
        timeoutRef.current = undefined;
      }, remainingWait);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, wait]);

  return throttledValue;
}