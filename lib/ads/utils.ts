// File 37: lib/ads/utils.ts
import { AdSize, AdTargeting, AdType } from './types';

/**
 * Generate a unique ID for an ad slot
 */
export function generateAdSlotId(containerId: string, adType: AdType): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `ad-${containerId}-${adType}-${timestamp}-${random}`;
}

/**
 * Validate ad size format
 */
export function isValidAdSize(size: AdSize | string): boolean {
  if (size === 'auto') return true;
  
  const sizePattern = /^\d+x\d+$/;
  if (!sizePattern.test(size)) return false;
  
  const [width, height] = size.split('x').map(Number);
  return width > 0 && height > 0 && width <= 2000 && height <= 2000;
}

/**
 * Parse ad size string to width and height
 */
export function parseAdSize(size: AdSize): { width: number; height: number } | null {
  if (size === 'auto') return { width: 0, height: 0 };
  
  if (!isValidAdSize(size)) return null;
  
  const [width, height] = size.split('x').map(Number);
  return { width, height };
}

/**
 * Get optimal ad size based on container dimensions
 */
export function getOptimalAdSize(
  containerWidth: number,
  containerHeight: number,
  availableSizes: AdSize[]
): AdSize {
  if (availableSizes.includes('auto')) return 'auto';
  
  let optimalSize: AdSize = '300x250'; // Default
  
  // Filter sizes that fit within container
  const fittingSizes = availableSizes.filter(size => {
    const dimensions = parseAdSize(size);
    if (!dimensions) return false;
    return dimensions.width <= containerWidth && dimensions.height <= containerHeight;
  });
  
  if (fittingSizes.length > 0) {
    // Choose the largest fitting size
    optimalSize = fittingSizes.reduce((largest, current) => {
      const largestDim = parseAdSize(largest);
      const currentDim = parseAdSize(current);
      
      if (!largestDim || !currentDim) return largest;
      
      const largestArea = largestDim.width * largestDim.height;
      const currentArea = currentDim.width * currentDim.height;
      
      return currentArea > largestArea ? current : largest;
    });
  } else {
    // Choose the smallest available size if none fit
    optimalSize = availableSizes.reduce((smallest, current) => {
      const smallestDim = parseAdSize(smallest);
      const currentDim = parseAdSize(current);
      
      if (!smallestDim || !currentDim) return smallest;
      
      const smallestArea = smallestDim.width * smallestDim.height;
      const currentArea = currentDim.width * currentDim.height;
      
      return currentArea < smallestArea ? current : smallest;
    });
  }
  
  return optimalSize;
}

/**
 * Format targeting parameters for ad scripts
 */
export function formatAdTargeting(
  targeting: AdTargeting,
  defaultTargeting: AdTargeting = {}
): AdTargeting {
  const formatted: AdTargeting = { ...defaultTargeting, ...targeting };
  
  // Convert arrays to comma-separated strings for certain ad providers
  Object.keys(formatted).forEach(key => {
    const value = formatted[key];
    
    if (Array.isArray(value)) {
      // Join arrays with commas for ad providers that require string values
      formatted[key] = value.join(',');
    }
    
    // Convert booleans to strings
    if (typeof value === 'boolean') {
      formatted[key] = value.toString();
    }
    
    // Remove undefined values
    if (value === undefined) {
      delete formatted[key];
    }
  });
  
  return formatted;
}

/**
 * Generate ad targeting based on page content
 */
export function generateContentTargeting(
  content: string,
  metadata: Record<string, any> = {}
): AdTargeting {
  const targeting: AdTargeting = {};
  
  // Extract keywords from content
  const words = content.toLowerCase().split(/\s+/);
  const wordFrequency: Record<string, number> = {};
  
  words.forEach(word => {
    word = word.replace(/[^\w]/g, '');
    if (word.length > 3) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  // Get top 5 keywords
  const keywords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
  
  if (keywords.length > 0) {
    targeting.keywords = keywords;
  }
  
  // Add metadata
  if (metadata.category) {
    targeting.category = metadata.category;
  }
  
  if (metadata.tags && Array.isArray(metadata.tags)) {
    targeting.tags = metadata.tags;
  }
  
  if (metadata.author) {
    targeting.author = metadata.author;
  }
  
  return targeting;
}

/**
 * Calculate Click-Through Rate (CTR)
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

/**
 * Calculate Cost Per Mille (CPM)
 */
export function calculateCPM(revenue: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (revenue / impressions) * 1000;
}

/**
 * Calculate fill rate
 */
export function calculateFillRate(filledImpressions: number, totalRequests: number): number {
  if (totalRequests === 0) return 0;
  return (filledImpressions / totalRequests) * 100;
}

/**
 * Check if ad should be displayed based on user preferences
 */
export function shouldShowAd(
  userPreferences: {
    disableAds?: boolean;
    adFrequency?: number;
    lastAdShown?: Date;
  } = {}
): boolean {
  // Check if user has disabled ads
  if (userPreferences.disableAds) return false;
  
  // Check ad frequency
  if (userPreferences.adFrequency && userPreferences.lastAdShown) {
    const timeSinceLastAd = Date.now() - new Date(userPreferences.lastAdShown).getTime();
    const minInterval = (60 / userPreferences.adFrequency) * 60 * 1000; // Convert to milliseconds
    
    if (timeSinceLastAd < minInterval) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get device type for targeting
 */
export function getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

/**
 * Generate cache key for ad requests
 */
export function generateCacheKey(
  slotId: string,
  targeting: AdTargeting
): string {
  const targetingString = Object.entries(targeting)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  return `ad:${slotId}:${targetingString}`;
}

/**
 * Sanitize ad content for security
 */
export function sanitizeAdContent(content: string): string {
  // Remove script tags and event handlers
  let sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/on\w+=\w+/gi, '');
  
  // Only allow safe HTML tags and attributes
  const allowedTags = ['div', 'span', 'a', 'img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'br', 'ul', 'ol', 'li'];
  const allowedAttributes = ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel'];
  
  // Basic HTML sanitization (in production, use a library like DOMPurify)
  // This is a simplified version for demonstration
  
  return sanitized;
}

/**
 * Debounce function for ad loading
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for ad refreshes
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate a unique session ID for ad tracking
 */
export function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Get user's local time for time-based targeting
 */
export function getUserLocalTime(): {
  hour: number;
  dayOfWeek: number;
  isWeekend: boolean;
} {
  const now = new Date();
  return {
    hour: now.getHours(),
    dayOfWeek: now.getDay(),
    isWeekend: now.getDay() === 0 || now.getDay() === 6
  };
}