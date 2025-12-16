'use client';

import { useState, useEffect, useCallback } from 'react';

export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'preferences';
export type CookieConsent = {
  accepted: boolean;
  categories: Record<CookieCategory, boolean>;
  date: string;
  version: string;
};

const COOKIE_VERSION = '1.0';
const COOKIE_NAME = 'communities_pk_consent';
const ESSENTIAL_COOKIES = ['auth_token', 'theme_preferences', 'font_preferences'];

const defaultConsent: CookieConsent = {
  accepted: false,
  categories: {
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  },
  date: new Date().toISOString(),
  version: COOKIE_VERSION,
};

export function useCookies() {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Load consent on mount
  useEffect(() => {
    const savedConsent = getCookieConsent();
    if (savedConsent) {
      setConsent(savedConsent);
      if (!savedConsent.accepted) {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
    setIsInitialized(true);
  }, []);

  const getCookieConsent = useCallback((): CookieConsent | null => {
    if (typeof window === 'undefined') return null;

    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1];

    if (!cookieValue) return null;

    try {
      const parsed = JSON.parse(decodeURIComponent(cookieValue));
      
      // Migrate old versions if needed
      if (parsed.version !== COOKIE_VERSION) {
        return migrateConsent(parsed);
      }

      return parsed;
    } catch {
      return null;
    }
  }, []);

  const setCookieConsent = useCallback((newConsent: Partial<CookieConsent>) => {
    if (typeof window === 'undefined') return;

    const currentConsent = getCookieConsent() || defaultConsent;
    const updatedConsent: CookieConsent = {
      ...currentConsent,
      ...newConsent,
      date: new Date().toISOString(),
      version: COOKIE_VERSION,
      categories: {
        ...currentConsent.categories,
        ...(newConsent.categories || {}),
        essential: true, // Always keep essential enabled
      },
    };

    // Set cookie with 1 year expiry
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    const cookieValue = encodeURIComponent(JSON.stringify(updatedConsent));
    document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure`;

    setConsent(updatedConsent);
    
    // Update analytics based on consent
    updateAnalyticsTracking(updatedConsent);
  }, [getCookieConsent]);

  const acceptAll = useCallback(() => {
    setCookieConsent({
      accepted: true,
      categories: {
        essential: true,
        analytics: true,
        marketing: true,
        preferences: true,
      },
    });
    setShowBanner(false);
    
    // Track acceptance
    trackCookieEvent('accept_all');
  }, [setCookieConsent]);

  const acceptEssential = useCallback(() => {
    setCookieConsent({
      accepted: true,
      categories: {
        essential: true,
        analytics: false,
        marketing: false,
        preferences: false,
      },
    });
    setShowBanner(false);
    
    // Track acceptance
    trackCookieEvent('accept_essential');
  }, [setCookieConsent]);

  const savePreferences = useCallback((categories: Record<CookieCategory, boolean>) => {
    setCookieConsent({
      accepted: true,
      categories: {
        ...categories,
        essential: true,
      },
    });
    setShowBanner(false);
    
    // Track preferences save
    trackCookieEvent('save_preferences', categories);
  }, [setCookieConsent]);

  const updateCategory = useCallback((category: CookieCategory, enabled: boolean) => {
    setCookieConsent({
      categories: {
        ...consent.categories,
        [category]: enabled,
      },
    });
  }, [consent, setCookieConsent]);

  const isCategoryEnabled = useCallback((category: CookieCategory): boolean => {
    return consent.categories[category];
  }, [consent]);

  const showCookieSettings = useCallback(() => {
    setShowBanner(true);
  }, []);

  // Clean up expired cookies
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name] = cookie.trim().split('=');
      
      // Skip essential cookies
      if (ESSENTIAL_COOKIES.includes(name)) return;
      
      // Check if this cookie category is disabled
      const category = getCookieCategory(name);
      if (category && !consent.categories[category]) {
        // Remove cookie
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  }, [consent]);

  return {
    consent,
    isInitialized,
    showBanner,
    acceptAll,
    acceptEssential,
    savePreferences,
    updateCategory,
    isCategoryEnabled,
    showCookieSettings,
    setShowBanner,
  };
}

function migrateConsent(oldConsent: any): CookieConsent {
  // Handle migration from old consent format
  return {
    ...defaultConsent,
    ...oldConsent,
    version: COOKIE_VERSION,
  };
}

function getCookieCategory(cookieName: string): CookieCategory | null {
  const analyticsCookies = ['_ga', '_gid', '_gat', '_gac_'];
  const marketingCookies = ['_fbp', 'fr', 'tr'];
  const preferenceCookies = ['theme', 'font', 'language'];

  if (analyticsCookies.some(prefix => cookieName.startsWith(prefix))) {
    return 'analytics';
  }
  if (marketingCookies.includes(cookieName)) {
    return 'marketing';
  }
  if (preferenceCookies.includes(cookieName)) {
    return 'preferences';
  }
  
  return null;
}

function updateAnalyticsTracking(consent: CookieConsent) {
  // Update Google Analytics
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: consent.categories.analytics ? 'granted' : 'denied',
      ad_storage: consent.categories.marketing ? 'granted' : 'denied',
      personalization_storage: consent.categories.preferences ? 'granted' : 'denied',
    });
  }

  // Update Facebook Pixel
  if (window.fbq) {
    window.fbq('consent', consent.categories.marketing ? 'grant' : 'revoke');
  }
}

function trackCookieEvent(action: string, data?: any) {
  if (window.gtag) {
    window.gtag('event', 'cookie_consent', {
      event_category: 'engagement',
      event_label: action,
      ...data,
    });
  }
}