import Cookies from 'js-cookie';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export interface CookieConsent {
  accepted: boolean;
  timestamp: string;
  version: string;
  preferences: CookiePreferences;
}

export class CookieManager {
  private cookieName = 'ec_cookie_consent';
  private version = '1.0';
  private defaultPreferences: CookiePreferences = {
    essential: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false,
  };

  // Initialize cookie consent
  init(): void {
    if (typeof window === 'undefined') return;

    const consent = this.getConsent();
    
    if (!consent) {
      // Show banner if no consent
      this.showConsentBanner();
    } else {
      // Apply preferences
      this.applyPreferences(consent.preferences);
    }
  }

  // Get current consent
  getConsent(): CookieConsent | null {
    try {
      const cookie = Cookies.get(this.cookieName);
      if (!cookie) return null;
      return JSON.parse(cookie) as CookieConsent;
    } catch (error) {
      console.error('Error parsing cookie consent:', error);
      return null;
    }
  }

  // Save consent
  saveConsent(preferences: Partial<CookiePreferences> = {}): void {
    const currentConsent = this.getConsent();
    const currentPrefs = currentConsent?.preferences || this.defaultPreferences;

    const newConsent: CookieConsent = {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: this.version,
      preferences: {
        ...currentPrefs,
        ...preferences,
        essential: true, // Always true
      },
    };

    Cookies.set(this.cookieName, JSON.stringify(newConsent), {
      expires: 365, // 1 year
      path: '/',
      sameSite: 'strict' as const,
      secure: process.env.NODE_ENV === 'production',
    });

    // Apply preferences
    this.applyPreferences(newConsent.preferences);
    
    // Hide banner
    this.hideConsentBanner();
    
    // Track consent
    this.trackConsent(newConsent);
  }

  // Update preferences
  updatePreferences(preferences: Partial<CookiePreferences>): void {
    const currentConsent = this.getConsent();
    
    if (!currentConsent) {
      this.saveConsent(preferences);
      return;
    }

    const updatedConsent: CookieConsent = {
      ...currentConsent,
      timestamp: new Date().toISOString(),
      preferences: {
        ...currentConsent.preferences,
        ...preferences,
        essential: true, // Always true
      },
    };

    Cookies.set(this.cookieName, JSON.stringify(updatedConsent), {
      expires: 365,
      path: '/',
      sameSite: 'strict' as const,
      secure: process.env.NODE_ENV === 'production',
    });

    this.applyPreferences(updatedConsent.preferences);
  }

  // Revoke consent
  revokeConsent(): void {
    Cookies.remove(this.cookieName, { path: '/' });
    
    // Remove all non-essential cookies
    this.removeNonEssentialCookies();
    
    // Show banner again
    this.showConsentBanner();
  }

  // Check if consent is given
  hasConsent(): boolean {
    return !!this.getConsent()?.accepted;
  }

  // Check specific preference
  hasPreference(type: keyof CookiePreferences): boolean {
    const consent = this.getConsent();
    return consent?.preferences?.[type] || false;
  }

  // Apply preferences
  private applyPreferences(preferences: CookiePreferences): void {
    // Analytics
    if (preferences.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Marketing
    if (preferences.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }

    // Personalization
    if (preferences.personalization) {
      this.enablePersonalization();
    } else {
      this.disablePersonalization();
    }
  }

  // Cookie banner management
  private showConsentBanner(): void {
    if (typeof window === 'undefined') return;

    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('hidden');
      banner.classList.add('block');
    }
  }

  private hideConsentBanner(): void {
    if (typeof window === 'undefined') return;

    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('block');
      banner.classList.add('hidden');
    }
  }

  // Analytics cookies
  private enableAnalytics(): void {
    // Initialize analytics
    import('@/lib/analytics/analytics').then(({ analyticsManager }) => {
      analyticsManager.init();
    });
  }

  private disableAnalytics(): void {
    // Remove analytics cookies
    const analyticsCookies = ['_ga', '_gid', '_gat'];
    analyticsCookies.forEach(cookie => {
      Cookies.remove(cookie);
      Cookies.remove(cookie, { path: '/' });
    });
  }

  // Marketing cookies
  private enableMarketing(): void {
    // Initialize marketing scripts
    // This is where you'd add Facebook Pixel, etc.
  }

  private disableMarketing(): void {
    // Remove marketing cookies
    const marketingCookies = ['_fbp', 'fr'];
    marketingCookies.forEach(cookie => {
      Cookies.remove(cookie);
      Cookies.remove(cookie, { path: '/' });
    });
  }

  // Personalization cookies
  private enablePersonalization(): void {
    // Enable personalization features
    console.log('Personalization enabled');
  }

  private disablePersonalization(): void {
    // Remove personalization cookies
    const personalizationCookies = ['theme', 'fontFamily', 'darkMode'];
    personalizationCookies.forEach(cookie => {
      Cookies.remove(cookie);
      Cookies.remove(cookie, { path: '/' });
    });
  }

  // Remove all non-essential cookies
  private removeNonEssentialCookies(): void {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(cookieName => {
      if (!this.isEssentialCookie(cookieName)) {
        Cookies.remove(cookieName);
        Cookies.remove(cookieName, { path: '/' });
      }
    });
  }

  // Check if cookie is essential
  private isEssentialCookie(name: string): boolean {
    const essentialCookies = [
      this.cookieName,
      'wordpress_test_cookie',
      'PHPSESSID',
    ];
    
    return essentialCookies.some(essential => name.includes(essential));
  }

  // Track consent (analytics)
  private trackConsent(consent: CookieConsent): void {
    if (typeof window !== 'undefined' && (window as any).gtag && this.hasPreference('analytics')) {
      (window as any).gtag('event', 'cookie_consent', {
        consent_version: consent.version,
        preferences: consent.preferences,
        timestamp: consent.timestamp,
      });
    }
  }

  // Get all cookies (for display)
  getAllCookies(): Array<{ name: string; value: string; category: string }> {
    if (typeof window === 'undefined') return [];

    const cookies = Cookies.get();
    return Object.entries(cookies).map(([name, value]) => ({
      name,
      value: this.maskCookieValue(name, value as string),
      category: this.getCookieCategory(name),
    }));
  }

  // Mask sensitive cookie values
  private maskCookieValue(name: string, value: string): string {
    const sensitiveCookies = ['token', 'auth', 'session', 'password'];
    
    if (sensitiveCookies.some(sensitive => name.toLowerCase().includes(sensitive))) {
      return '••••••••';
    }
    
    return value.length > 20 ? `${value.substring(0, 20)}...` : value;
  }

  // Get cookie category
  private getCookieCategory(name: string): string {
    if (this.isEssentialCookie(name)) return 'essential';
    
    const analyticsCookies = ['_ga', '_gid', '_gat'];
    if (analyticsCookies.some(cookie => name.includes(cookie))) return 'analytics';
    
    const marketingCookies = ['_fbp', 'fr'];
    if (marketingCookies.some(cookie => name.includes(cookie))) return 'marketing';
    
    const personalizationCookies = ['theme', 'font', 'mode'];
    if (personalizationCookies.some(cookie => name.includes(cookie))) return 'personalization';
    
    return 'unknown';
  }
}

// Singleton instance
export const cookieManager = new CookieManager();