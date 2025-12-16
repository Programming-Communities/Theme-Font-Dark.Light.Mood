// File 42: lib/utils/format.ts
/**
 * Formatting utility functions for the English Communities PK platform
 */

/**
 * Format a date string to a human-readable format
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format date as relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a month
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a year
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    
    // More than a year
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a number with commas (e.g., 1000 -> 1,000)
 */
export function formatNumber(
  num: number,
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    return new Intl.NumberFormat('en-US', options).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
}

/**
 * Format a number as a compact string (e.g., 1000 -> 1K)
 */
export function formatCompactNumber(
  num: number,
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      ...options
    }).format(num);
  } catch (error) {
    console.error('Error formatting compact number:', error);
    
    // Fallback formatting
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return num.toString();
  }
}

/**
 * Format a file size in bytes to a human-readable format
 */
export function formatFileSize(
  bytes: number,
  decimals: number = 2
): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format a duration in milliseconds to a human-readable format
 */
export function formatDuration(
  milliseconds: number,
  showMilliseconds: boolean = false
): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  const remainingMilliseconds = milliseconds % 1000;
  
  const parts: string[] = [];
  
  if (days > 0) parts.push(`${days}d`);
  if (remainingHours > 0) parts.push(`${remainingHours}h`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) {
    if (showMilliseconds && remainingMilliseconds > 0) {
      parts.push(`${remainingSeconds}.${Math.floor(remainingMilliseconds / 100)}s`);
    } else {
      parts.push(`${remainingSeconds}s`);
    }
  }
  
  return parts.join(' ');
}

/**
 * Format a currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format a percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a phone number
 */
export function formatPhoneNumber(
  phoneNumber: string,
  countryCode: string = 'US'
): string {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // US/Canada formatting
  if (countryCode === 'US' || countryCode === 'CA') {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  }
  
  // Default: return cleaned if no specific formatting
  return cleaned;
}

/**
 * Format a social security number (SSN)
 */
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');
  
  if (cleaned.length === 9) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 5)}-${cleaned.substring(5)}`;
  }
  
  return ssn;
}

/**
 * Format a credit card number
 */
export function formatCreditCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Visa, MasterCard, Discover: 16 digits
  if (cleaned.length === 16) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  }
  
  // American Express: 15 digits
  if (cleaned.length === 15) {
    return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  }
  
  return cardNumber;
}

/**
 * Format a URL for display (truncate if too long)
 */
export function formatURL(
  url: string,
  maxLength: number = 50
): string {
  try {
    const urlObj = new URL(url);
    let display = urlObj.hostname + urlObj.pathname;
    
    if (display.length > maxLength) {
      display = display.substring(0, maxLength - 3) + '...';
    }
    
    return display;
  } catch {
    // If URL parsing fails, just truncate the string
    if (url.length > maxLength) {
      return url.substring(0, maxLength - 3) + '...';
    }
    return url;
  }
}

/**
 * Format an email address for display (hide part of it)
 */
export function formatEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  
  if (!localPart || !domain) {
    return email;
  }
  
  if (localPart.length <= 2) {
    return `${localPart}@${domain}`;
  }
  
  const hiddenLocalPart = localPart.charAt(0) + '***' + localPart.charAt(localPart.length - 1);
  return `${hiddenLocalPart}@${domain}`;
}

/**
 * Format a string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Format a string to camel case
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '')
    .replace(/[^\w]/g, '');
}

/**
 * Format a string to kebab case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Format a string to snake case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Format a string to pascal case
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/[^\w]/g, '');
}

/**
 * Truncate text with ellipsis, preserving word boundaries
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  // Try to truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) { // Only use space if it's not too early
    return text.substring(0, lastSpace) + ellipsis;
  }
  
  return truncated + ellipsis;
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  if (!name) return '';
  
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials;
}

/**
 * Format a list of items as a human-readable string
 */
export function formatList(
  items: string[],
  conjunction: string = 'and'
): string {
  if (!items || items.length === 0) {
    return '';
  }
  
  if (items.length === 1) {
    return items[0];
  }
  
  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
}

/**
 * Format a range of numbers or dates
 */
export function formatRange(
  start: number | Date | string,
  end: number | Date | string,
  separator: string = '–'
): string {
  const formatStart = typeof start === 'number' 
    ? formatNumber(start as number)
    : formatDate(start as Date | string);
  
  const formatEnd = typeof end === 'number'
    ? formatNumber(end as number)
    : formatDate(end as Date | string);
  
  return `${formatStart} ${separator} ${formatEnd}`;
}

/**
 * Format a temperature value
 */
export function formatTemperature(
  celsius: number,
  unit: 'C' | 'F' = 'C',
  decimals: number = 1
): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9/5) + 32;
    return `${fahrenheit.toFixed(decimals)}°F`;
  }
  
  return `${celsius.toFixed(decimals)}°C`;
}

/**
 * Format a distance value
 */
export function formatDistance(
  meters: number,
  unit: 'metric' | 'imperial' = 'metric',
  decimals: number = 2
): string {
  if (unit === 'imperial') {
    const miles = meters * 0.000621371;
    if (miles < 0.1) {
      const feet = meters * 3.28084;
      return `${feet.toFixed(decimals)} ft`;
    }
    return `${miles.toFixed(decimals)} mi`;
  }
  
  if (meters < 1) {
    const centimeters = meters * 100;
    return `${centimeters.toFixed(decimals)} cm`;
  }
  
  if (meters < 1000) {
    return `${meters.toFixed(decimals)} m`;
  }
  
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(decimals)} km`;
}

/**
 * Format a weight value
 */
export function formatWeight(
  grams: number,
  unit: 'metric' | 'imperial' = 'metric',
  decimals: number = 2
): string {
  if (unit === 'imperial') {
    const pounds = grams * 0.00220462;
    if (pounds < 1) {
      const ounces = grams * 0.035274;
      return `${ounces.toFixed(decimals)} oz`;
    }
    return `${pounds.toFixed(decimals)} lb`;
  }
  
  if (grams < 1) {
    const milligrams = grams * 1000;
    return `${milligrams.toFixed(decimals)} mg`;
  }
  
  if (grams < 1000) {
    return `${grams.toFixed(decimals)} g`;
  }
  
  const kilograms = grams / 1000;
  return `${kilograms.toFixed(decimals)} kg`;
}

/**
 * Format a speed value
 */
export function formatSpeed(
  metersPerSecond: number,
  unit: 'metric' | 'imperial' = 'metric',
  decimals: number = 1
): string {
  if (unit === 'imperial') {
    const mph = metersPerSecond * 2.23694;
    return `${mph.toFixed(decimals)} mph`;
  }
  
  const kmh = metersPerSecond * 3.6;
  return `${kmh.toFixed(decimals)} km/h`;
}

/**
 * Format a time value in 12-hour or 24-hour format
 */
export function formatTime(
  date: Date | string,
  format: '12h' | '24h' = '12h',
  showSeconds: boolean = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === '24h') {
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    if (showSeconds) {
      const seconds = dateObj.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
    
    return `${hours}:${minutes}`;
  }
  
  // 12-hour format
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  if (showSeconds) {
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }
  
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Generate a random string with specified length
 */
export function generateRandomString(
  length: number = 10,
  characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

/**
 * Mask sensitive information (like passwords, credit cards)
 */
export function maskSensitiveInfo(
  text: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string {
  if (!text || text.length <= visibleChars) {
    return text;
  }
  
  const lastVisible = text.slice(-visibleChars);
  const maskedLength = text.length - visibleChars;
  const masked = maskChar.repeat(maskedLength);
  
  return masked + lastVisible;
}

/**
 * Normalize line endings to LF
 */
export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Remove diacritics from text
 */
export function removeDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Generate a slug from text
 */
export function generateSlug(text: string): string {
  return removeDiacritics(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}