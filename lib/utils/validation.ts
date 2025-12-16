// File 43: lib/utils/validation.ts
/**
 * Validation utility functions for the English Communities PK platform
 */

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate phone number format (basic international validation)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Basic validation: at least 10 digits, optionally starting with +
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  score: number;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
} {
  if (!password) {
    return {
      isValid: false,
      score: 0,
      requirements: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      }
    };
  }
  
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  
  const metCount = Object.values(requirements).filter(Boolean).length;
  const score = Math.floor((metCount / 5) * 100);
  
  return {
    isValid: metCount >= 3 && requirements.length, // At least 3 requirements including length
    score,
    requirements
  };
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  if (!username) return false;
  
  // 3-20 characters, letters, numbers, underscores, hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate date string
 */
export function isValidDate(date: string | Date): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
}

/**
 * Validate credit card number using Luhn algorithm
 */
export function isValidCreditCardNumber(cardNumber: string): boolean {
  if (!cardNumber) return false;
  
  // Remove all non-numeric characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Check if it's a valid length
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop from right to left
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

/**
 * Validate credit card expiry date
 */
export function isValidCreditCardExpiry(expiry: string): boolean {
  if (!expiry) return false;
  
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  
  // Validate month
  if (month < 1 || month > 12) {
    return false;
  }
  
  // Validate year (assumes 2-digit year, 2000-2099)
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (year < currentYear) {
    return false;
  }
  
  if (year === currentYear && month < currentMonth) {
    return false;
  }
  
  return true;
}

/**
 * Validate credit card CVC/CVV
 */
export function isValidCreditCardCVC(cvc: string, cardType?: string): boolean {
  if (!cvc) return false;
  
  // Remove all non-numeric characters
  const cleaned = cvc.replace(/\D/g, '');
  
  // American Express has 4-digit CVC, others have 3-digit
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  return cleaned.length === expectedLength && /^\d+$/.test(cleaned);
}

/**
 * Validate IBAN (International Bank Account Number)
 */
export function isValidIBAN(iban: string): boolean {
  if (!iban) return false;
  
  // Remove whitespace and convert to uppercase
  const cleaned = iban.replace(/\s+/g, '').toUpperCase();
  
  // Check country code and length
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(cleaned)) {
    return false;
  }
  
  // Move first 4 characters to end
  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
  
  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numeric = '';
  for (const char of rearranged) {
    if (/[A-Z]/.test(char)) {
      numeric += (char.charCodeAt(0) - 55).toString();
    } else {
      numeric += char;
    }
  }
  
  // Calculate modulo 97
  let remainder = '';
  for (const digit of numeric) {
    remainder = (parseInt(remainder + digit, 10) % 97).toString();
  }
  
  return remainder === '1';
}

/**
 * Validate SWIFT/BIC code
 */
export function isValidSWIFT(swift: string): boolean {
  if (!swift) return false;
  
  // Remove whitespace and convert to uppercase
  const cleaned = swift.replace(/\s+/g, '').toUpperCase();
  
  // SWIFT/BIC format: 8 or 11 characters, letters and numbers
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return swiftRegex.test(cleaned);
}

/**
 * Validate social security number (SSN) format
 */
export function isValidSSN(ssn: string): boolean {
  if (!ssn) return false;
  
  // Remove all non-numeric characters
  const cleaned = ssn.replace(/\D/g, '');
  
  // Check if it's exactly 9 digits
  if (cleaned.length !== 9) {
    return false;
  }
  
  // Check for invalid SSNs (all zeros, etc.)
  const invalidSSNs = [
    '000000000', '111111111', '222222222', '333333333',
    '444444444', '555555555', '666666666', '777777777',
    '888888888', '999999999', '123456789'
  ];
  
  if (invalidSSNs.includes(cleaned)) {
    return false;
  }
  
  // Check area number (first 3 digits)
  const area = parseInt(cleaned.substring(0, 3), 10);
  if (area === 0 || area === 666 || area > 899) {
    return false;
  }
  
  return true;
}

/**
 * Validate VAT number (European Union)
 */
export function isValidVAT(vat: string, countryCode?: string): boolean {
  if (!vat) return false;
  
  // Remove whitespace and convert to uppercase
  const cleaned = vat.replace(/\s+/g, '').toUpperCase();
  
  // If country code is provided, check it matches
  if (countryCode && !cleaned.startsWith(countryCode.toUpperCase())) {
    return false;
  }
  
  // Basic format validation (country code + up to 12 characters)
  const vatRegex = /^[A-Z]{2}[A-Z0-9]{2,12}$/;
  if (!vatRegex.test(cleaned)) {
    return false;
  }
  
  // Country-specific validation would go here
  // This is a simplified version
  
  return true;
}

/**
 * Validate ISBN (International Standard Book Number)
 */
export function isValidISBN(isbn: string): boolean {
  if (!isbn) return false;
  
  // Remove hyphens and spaces
  const cleaned = isbn.replace(/[-\s]/g, '');
  
  // Check if it's ISBN-10 or ISBN-13
  if (cleaned.length === 10) {
    return isValidISBN10(cleaned);
  } else if (cleaned.length === 13) {
    return isValidISBN13(cleaned);
  }
  
  return false;
}

function isValidISBN10(isbn: string): boolean {
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(isbn.charAt(i), 10);
    if (isNaN(digit)) return false;
    sum += digit * (10 - i);
  }
  
  const lastChar = isbn.charAt(9).toUpperCase();
  let checkDigit;
  
  if (lastChar === 'X') {
    checkDigit = 10;
  } else {
    checkDigit = parseInt(lastChar, 10);
    if (isNaN(checkDigit)) return false;
  }
  
  sum += checkDigit;
  
  return sum % 11 === 0;
}

function isValidISBN13(isbn: string): boolean {
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn.charAt(i), 10);
    if (isNaN(digit)) return false;
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }
  
  const checkDigit = parseInt(isbn.charAt(12), 10);
  if (isNaN(checkDigit)) return false;
  
  return (10 - (sum % 10)) % 10 === checkDigit;
}

/**
 * Validate UUID (Universal Unique Identifier)
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid) return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate hex color code
 */
export function isValidHexColor(color: string): boolean {
  if (!color) return false;
  
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(color);
}

/**
 * Validate RGB/RGBA color
 */
export function isValidRGBColor(color: string): boolean {
  if (!color) return false;
  
  const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i;
  const rgbaRegex = /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  
  return rgbRegex.test(color) || rgbaRegex.test(color);
}

/**
 * Validate HSL/HSLA color
 */
export function isValidHSLColor(color: string): boolean {
  if (!color) return false;
  
  const hslRegex = /^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/i;
  const hslaRegex = /^hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  
  return hslRegex.test(color) || hslaRegex.test(color);
}

/**
 * Validate IP address (IPv4 or IPv6)
 */
export function isValidIPAddress(ip: string): boolean {
  if (!ip) return false;
  
  // IPv4 validation
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(ip)) {
    return true;
  }
  
  // IPv6 validation (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ipv6Regex.test(ip)) {
    return true;
  }
  
  // IPv6 compressed format
  const ipv6CompressedRegex = /^(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?::(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?$/;
  if (ipv6CompressedRegex.test(ip)) {
    return true;
  }
  
  return false;
}

/**
 * Validate domain name
 */
export function isValidDomain(domain: string): boolean {
  if (!domain) return false;
  
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
  return domainRegex.test(domain);
}

/**
 * Validate file extension
 */
export function isValidFileExtension(
  filename: string,
  allowedExtensions: string[]
): boolean {
  if (!filename) return false;
  
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return false;
  
  return allowedExtensions.includes(`.${extension}`);
}

/**
 * Validate file size
 */
export function isValidFileSize(
  fileSize: number,
  maxSizeInBytes: number
): boolean {
  return fileSize <= maxSizeInBytes;
}

/**
 * Validate image dimensions
 */
export function isValidImageDimensions(
  width: number,
  height: number,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number
): boolean {
  if (minWidth !== undefined && width < minWidth) return false;
  if (maxWidth !== undefined && width > maxWidth) return false;
  if (minHeight !== undefined && height < minHeight) return false;
  if (maxHeight !== undefined && height > maxHeight) return false;
  
  return true;
}

/**
 * Validate JSON string
 */
export function isValidJSON(json: string): boolean {
  if (!json) return false;
  
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate numeric range
 */
export function isValidRange(
  value: number,
  min?: number,
  max?: number
): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

/**
 * Validate required field
 */
export function isRequired(value: any): boolean {
  if (value === undefined || value === null) {
    return false;
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  
  return true;
}

/**
 * Validate string length
 */
export function isValidLength(
  value: string,
  min?: number,
  max?: number
): boolean {
  if (!value) return false;
  
  const length = value.length;
  
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  
  return true;
}

/**
 * Validate array length
 */
export function isValidArrayLength(
  array: any[],
  min?: number,
  max?: number
): boolean {
  if (!array) return false;
  
  const length = array.length;
  
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  
  return true;
}

/**
 * Validate object property count
 */
export function isValidPropertyCount(
  obj: Record<string, any>,
  min?: number,
  max?: number
): boolean {
  if (!obj) return false;
  
  const count = Object.keys(obj).length;
  
  if (min !== undefined && count < min) return false;
  if (max !== undefined && count > max) return false;
  
  return true;
}

/**
 * Validate against regex pattern
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  if (!value) return false;
  return pattern.test(value);
}

/**
 * Validate if value is numeric
 */
export function isNumeric(value: any): boolean {
  if (value === null || value === undefined) return false;
  
  // Check if it's a number
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  
  // Check if it's a numeric string
  if (typeof value === 'string') {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }
  
  return false;
}

/**
 * Validate if value is integer
 */
export function isInteger(value: any): boolean {
  if (!isNumeric(value)) return false;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isInteger(num);
}

/**
 * Validate if value is positive number
 */
export function isPositive(value: any): boolean {
  if (!isNumeric(value)) return false;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num > 0;
}

/**
 * Validate if value is negative number
 */
export function isNegative(value: any): boolean {
  if (!isNumeric(value)) return false;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num < 0;
}

/**
 * Validate if value is within array of allowed values
 */
export function isOneOf(value: any, allowedValues: any[]): boolean {
  return allowedValues.includes(value);
}

/**
 * Validate if value is not in array of disallowed values
 */
export function isNotOneOf(value: any, disallowedValues: any[]): boolean {
  return !disallowedValues.includes(value);
}

/**
 * Validate if two values match
 */
export function valuesMatch(value1: any, value2: any): boolean {
  return value1 === value2;
}

/**
 * Validate if value is truthy
 */
export function isTruthy(value: any): boolean {
  return !!value;
}

/**
 * Validate if value is falsy
 */
export function isFalsy(value: any): boolean {
  return !value;
}

/**
 * Validate if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * Validate if value is not empty
 */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}

/**
 * Validate all conditions in a validation object
 */
export function validateAll(
  value: any,
  validations: Record<string, any>
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  for (const [validationName, validationConfig] of Object.entries(validations)) {
    let isValid = true;
    
    switch (validationName) {
      case 'required':
        isValid = isRequired(value);
        break;
      
      case 'email':
        isValid = isValidEmail(value);
        break;
      
      case 'url':
        isValid = isValidUrl(value);
        break;
      
      case 'minLength':
        isValid = isValidLength(value, validationConfig);
        break;
      
      case 'maxLength':
        isValid = isValidLength(value, undefined, validationConfig);
        break;
      
      case 'pattern':
        isValid = matchesPattern(value, validationConfig);
        break;
      
      case 'min':
        isValid = isValidRange(value, validationConfig);
        break;
      
      case 'max':
        isValid = isValidRange(value, undefined, validationConfig);
        break;
      
      case 'oneOf':
        isValid = isOneOf(value, validationConfig);
        break;
      
      // Add more validation types as needed
    }
    
    if (!isValid) {
      errors.push(validationName);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}