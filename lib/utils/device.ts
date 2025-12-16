// File 41: lib/utils/device.ts
/**
 * Device detection and utility functions
 */

export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type OS = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
export type Browser = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'unknown';

export interface DeviceInfo {
  type: DeviceType;
  os: OS;
  browser: Browser;
  isTouch: boolean;
  isRetina: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  isPortrait: boolean;
  isLandscape: boolean;
  userAgent: string;
}

export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

/**
 * Default breakpoints for responsive design
 */
export const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024
};

/**
 * Detect device information from user agent
 */
export function detectDevice(userAgent?: string): DeviceInfo {
  const ua = userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : '');
  
  // Screen dimensions
  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 0;
  const screenHeight = typeof window !== 'undefined' ? window.screen.height : 0;
  
  // Pixel ratio
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  
  // Device type based on screen width
  let type: DeviceType = 'desktop';
  if (screenWidth < DEFAULT_BREAKPOINTS.mobile) {
    type = 'mobile';
  } else if (screenWidth < DEFAULT_BREAKPOINTS.tablet) {
    type = 'tablet';
  }
  
  // Override with user agent detection for more accuracy
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua);
  const isTablet = /Tablet|iPad|PlayBook|Silk/.test(ua) && !/Mobile/.test(ua);
  
  if (isMobile) type = 'mobile';
  if (isTablet) type = 'tablet';
  
  // OS detection
  let os: OS = 'unknown';
  if (/iPhone|iPad|iPod/.test(ua)) {
    os = 'ios';
  } else if (/Android/.test(ua)) {
    os = 'android';
  } else if (/Windows/.test(ua)) {
    os = 'windows';
  } else if (/Macintosh|Mac OS X/.test(ua)) {
    os = 'macos';
  } else if (/Linux/.test(ua)) {
    os = 'linux';
  }
  
  // Browser detection
  let browser: Browser = 'unknown';
  if (/Chrome/.test(ua) && !/Edge|Edg|OPR/.test(ua)) {
    browser = 'chrome';
  } else if (/Firefox/.test(ua)) {
    browser = 'firefox';
  } else if (/Safari/.test(ua) && !/Chrome|Chromium|Edge|Edg/.test(ua)) {
    browser = 'safari';
  } else if (/Edge|Edg/.test(ua)) {
    browser = 'edge';
  } else if (/OPR/.test(ua)) {
    browser = 'opera';
  } else if (/Trident|MSIE/.test(ua)) {
    browser = 'ie';
  }
  
  // Touch detection
  const isTouch = typeof window !== 'undefined' && (
    'ontouchstart' in window ||
    (window as any).DocumentTouch && document instanceof (window as any).DocumentTouch ||
    navigator.maxTouchPoints > 0
  );
  
  // Retina detection
  const isRetina = pixelRatio > 1;
  
  // Orientation
  const isPortrait = screenHeight > screenWidth;
  const isLandscape = !isPortrait;
  
  return {
    type,
    os,
    browser,
    isTouch,
    isRetina,
    screenWidth,
    screenHeight,
    pixelRatio,
    isPortrait,
    isLandscape,
    userAgent: ua
  };
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  const device = detectDevice();
  return device.type === 'mobile';
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  
  const device = detectDevice();
  return device.type === 'tablet';
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return true;
  
  const device = detectDevice();
  return device.type === 'desktop';
}

/**
 * Check if device has touch capability
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const device = detectDevice();
  return device.isTouch;
}

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < breakpoints.mobile) return 'mobile';
  if (width < breakpoints.tablet) return 'tablet';
  return 'desktop';
}

/**
 * Check if current viewport matches a specific breakpoint
 */
export function matchesBreakpoint(
  breakpoint: 'mobile' | 'tablet' | 'desktop',
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): boolean {
  if (typeof window === 'undefined') return breakpoint === 'desktop';
  
  const current = getCurrentBreakpoint(breakpoints);
  
  switch (breakpoint) {
    case 'mobile':
      return current === 'mobile';
    case 'tablet':
      return current === 'tablet';
    case 'desktop':
      return current === 'desktop';
  }
}

/**
 * Get device-specific CSS class names
 */
export function getDeviceClasses(): string {
  if (typeof window === 'undefined') return 'desktop';
  
  const device = detectDevice();
  const classes: string[] = [];
  
  classes.push(`device-${device.type}`);
  classes.push(`os-${device.os}`);
  classes.push(`browser-${device.browser}`);
  
  if (device.isTouch) classes.push('touch-device');
  if (device.isRetina) classes.push('retina');
  if (device.isPortrait) classes.push('portrait');
  if (device.isLandscape) classes.push('landscape');
  
  return classes.join(' ');
}

/**
 * Get optimal image size based on device
 */
export function getOptimalImageSize(
  baseSize: number,
  deviceType?: DeviceType
): number {
  if (!deviceType) {
    deviceType = detectDevice().type;
  }
  
  switch (deviceType) {
    case 'mobile':
      return Math.min(baseSize, 800);
    case 'tablet':
      return Math.min(baseSize, 1200);
    case 'desktop':
      return Math.min(baseSize, 1920);
    default:
      return baseSize;
  }
}

/**
 * Check if prefers reduced motion is enabled
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if dark mode is preferred
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Check if high contrast mode is preferred
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get network connection information
 */
export function getConnectionInfo(): {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  saveData: boolean;
} | null {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return null;
  }
  
  const conn = (navigator as any).connection;
  if (!conn) return null;
  
  return {
    effectiveType: conn.effectiveType,
    downlink: conn.downlink,
    rtt: conn.rtt,
    saveData: conn.saveData
  };
}

/**
 * Check if device is online
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  
  return navigator.onLine;
}

/**
 * Get battery information (if available)
 */
export async function getBatteryInfo(): Promise<{
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
} | null> {
  if (typeof window === 'undefined' || !('getBattery' in navigator)) {
    return null;
  }
  
  try {
    const battery = await (navigator as any).getBattery();
    return {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime
    };
  } catch {
    return null;
  }
}

/**
 * Get device memory (if available)
 */
export function getDeviceMemory(): number | null {
  if (typeof window === 'undefined' || !('deviceMemory' in navigator)) {
    return null;
  }
  
  return (navigator as any).deviceMemory;
}

/**
 * Get hardware concurrency (CPU cores)
 */
export function getHardwareConcurrency(): number | null {
  if (typeof window === 'undefined' || !navigator.hardwareConcurrency) {
    return null;
  }
  
  return navigator.hardwareConcurrency;
}

/**
 * Check if WebGL is supported
 */
export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

/**
 * Check if WebP format is supported
 */
export async function isWebPSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}

/**
 * Check if AVIF format is supported
 */
export async function isAVIFSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * Get device orientation
 */
export function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'portrait';
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * Listen for orientation changes
 */
export function onOrientationChange(
  callback: (orientation: 'portrait' | 'landscape') => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = () => {
    callback(getOrientation());
  };
  
  window.addEventListener('resize', handler);
  window.addEventListener('orientationchange', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
    window.removeEventListener('orientationchange', handler);
  };
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Check if device supports vibration
 */
export function supportsVibration(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'vibrate' in navigator;
}

/**
 * Check if device supports notifications
 */
export function supportsNotifications(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'Notification' in window && Notification.permission !== 'denied';
}

/**
 * Get device language
 */
export function getDeviceLanguage(): string {
  if (typeof window === 'undefined') return 'en-US';
  
  return navigator.language || (navigator as any).userLanguage || 'en-US';
}

/**
 * Check if device is low-end based on multiple factors
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const device = detectDevice();
  const memory = getDeviceMemory();
  const cores = getHardwareConcurrency();
  
  let score = 0;
  
  // Mobile devices are more likely to be low-end
  if (device.type === 'mobile') score += 1;
  
  // Low memory
  if (memory !== null && memory <= 2) score += 1;
  
  // Few CPU cores
  if (cores !== null && cores <= 2) score += 1;
  
  // Slow network
  const conn = getConnectionInfo();
  if (conn && (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g')) score += 1;
  
  // Old browser
  if (device.browser === 'ie') score += 1;
  
  return score >= 2;
}

/**
 * Get device capabilities summary
 */
export function getDeviceCapabilities(): {
  webgl: boolean;
  webp: boolean;
  avif: boolean;
  vibration: boolean;
  notifications: boolean;
  touch: boolean;
  retina: boolean;
  lowEnd: boolean;
} {
  return {
    webgl: isWebGLSupported(),
    webp: false, // Will be set async
    avif: false, // Will be set async
    vibration: supportsVibration(),
    notifications: supportsNotifications(),
    touch: isTouchDevice(),
    retina: detectDevice().isRetina,
    lowEnd: isLowEndDevice()
  };
}

// Initialize WebP and AVIF support checks
if (typeof window !== 'undefined') {
  isWebPSupported().then(supported => {
    getDeviceCapabilities().webp = supported;
  });
  
  isAVIFSupported().then(supported => {
    getDeviceCapabilities().avif = supported;
  });
}