'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { cookieManager } from '@/lib/cookies/manager';
import { Cookie, Settings, Check, X, AlertCircle } from 'lucide-react';

export default function CookieConsentBanner() {
  const { themeColors } = useTheme();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if consent already given
    const hasConsent = cookieManager.hasConsent();
    setShowBanner(!hasConsent);
    
    // Load current preferences
    const consent = cookieManager.getConsent();
    if (consent) {
      setPreferences({
        analytics: consent.preferences.analytics,
        marketing: consent.preferences.marketing,
        personalization: consent.preferences.personalization,
      });
    }
  }, []);

  const handleAcceptAll = () => {
    cookieManager.saveConsent({
      analytics: true,
      marketing: true,
      personalization: true,
    });
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptNecessary = () => {
    cookieManager.saveConsent({
      analytics: false,
      marketing: false,
      personalization: false,
    });
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    cookieManager.saveConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Main Banner */}
      <div 
        id="cookie-consent-banner"
        className="fixed bottom-0 left-0 right-0 z-[101] p-4"
        style={{
          backgroundColor: themeColors.background,
          borderTop: `1px solid ${themeColors.border}`,
          boxShadow: `0 -4px 12px ${themeColors.shadow}`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          {!showSettings ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${themeColors.primary}15` }}>
                    <Cookie className="h-5 w-5" style={{ color: themeColors.primary }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: themeColors.text.primary }}>
                      Cookie Preferences
                    </h3>
                    <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                      We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                      By clicking "Accept All", you consent to our use of cookies.
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: themeColors.text.secondary }}>
                      <AlertCircle className="h-3 w-3" />
                      <span>Essential cookies are always enabled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: themeColors.surface,
                    color: themeColors.text.primary,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Customize
                  </span>
                </button>
                
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: themeColors.surface,
                    color: themeColors.text.primary,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  Necessary Only
                </button>
                
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: themeColors.text.accent,
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Accept All
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Settings Panel */
            <div className="bg-surface border rounded-xl p-6" style={{ borderColor: themeColors.border }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: themeColors.text.primary }}>
                    Cookie Settings
                  </h3>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    Choose which cookies you want to allow
                  </p>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg hover:bg-background transition-colors"
                  style={{ color: themeColors.text.secondary }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Essential Cookies (Always On) */}
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: `${themeColors.success}10` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: `${themeColors.success}20` }}>
                      <Check className="h-4 w-4" style={{ color: themeColors.success }} />
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: themeColors.text.primary }}>Essential Cookies</h4>
                      <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                        Required for the website to function
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium"
                       style={{ 
                         backgroundColor: `${themeColors.success}20`,
                         color: themeColors.success
                       }}>
                    Always Active
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="mb-4 p-4 rounded-lg border" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: `${themeColors.primary}15` }}>
                      <div className="text-sm" style={{ color: themeColors.primary }}>📊</div>
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: themeColors.text.primary }}>Analytics Cookies</h4>
                      <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                        Help us understand how visitors interact
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => togglePreference('analytics')}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer ${preferences.analytics ? 'bg-primary' : 'bg-border'} 
                                   peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 
                                   after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`} />
                  </label>
                </div>
                <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                  These cookies collect information about how you use our website, which pages you visited, 
                  and which links you clicked on.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="mb-4 p-4 rounded-lg border" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: `${themeColors.secondary}15` }}>
                      <div className="text-sm" style={{ color: themeColors.secondary }}>🎯</div>
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: themeColors.text.primary }}>Marketing Cookies</h4>
                      <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                        Used to deliver relevant ads
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => togglePreference('marketing')}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer ${preferences.marketing ? 'bg-secondary' : 'bg-border'} 
                                   peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 
                                   after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`} />
                  </label>
                </div>
                <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                  These cookies track your online activity to help advertisers deliver more relevant ads.
                </p>
              </div>

              {/* Personalization Cookies */}
              <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: `${themeColors.warning}15` }}>
                      <div className="text-sm" style={{ color: themeColors.warning }}>⚙️</div>
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: themeColors.text.primary }}>Personalization Cookies</h4>
                      <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                        Remember your preferences
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.personalization}
                      onChange={() => togglePreference('personalization')}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer ${preferences.personalization ? 'bg-warning' : 'bg-border'} 
                                   peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 
                                   after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`} />
                  </label>
                </div>
                <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                  These cookies remember your theme preferences, font choices, and other settings.
                </p>
              </div>

              {/* Settings Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: themeColors.surface,
                    color: themeColors.text.primary,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: themeColors.text.accent,
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Save Preferences
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}