'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

const IconClose = () => <span>✕</span>;

const ThemeSelector = () => {
  const { theme, setTheme, availableThemes, availableFonts, fontFamily, setFontFamily } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'themes' | 'fonts'>('themes');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        title="Change Theme & Font"
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)'
        }}
      >
        <Palette className="h-5 w-5" />
      </button>

      {/* Theme Modal */}
      {isOpen && (
        <div className="theme-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="theme-modal font-modal" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h3>Theme Settings</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <IconClose />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setSelectedTab('themes')}
                className={`flex-1 py-3 font-medium text-sm ${selectedTab === 'themes' ? 'border-b-2' : 'opacity-70'}`}
                style={{ 
                  color: selectedTab === 'themes' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderColor: selectedTab === 'themes' ? 'var(--primary)' : 'transparent'
                }}
              >
                Themes
              </button>
              <button
                onClick={() => setSelectedTab('fonts')}
                className={`flex-1 py-3 font-medium text-sm ${selectedTab === 'fonts' ? 'border-b-2' : 'opacity-70'}`}
                style={{ 
                  color: selectedTab === 'fonts' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderColor: selectedTab === 'fonts' ? 'var(--primary)' : 'transparent'
                }}
              >
                Fonts
              </button>
            </div>

            {/* Themes Tab Content */}
            {selectedTab === 'themes' && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Select a color theme for your interface
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableThemes.map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        setTheme(themeOption.value);
                        setIsOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        theme === themeOption.value 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary'
                      }`}
                      style={{
                        backgroundColor: theme === themeOption.value ? 'var(--surface)' : 'var(--background)',
                        borderColor: theme === themeOption.value ? 'var(--primary)' : 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full mb-2 border"
                        style={{ 
                          borderColor: 'var(--border)',
                          background: `linear-gradient(135deg, ${themeOption.value.includes('blue') ? '#2563EB' : 
                            themeOption.value.includes('green') ? '#059669' : 
                            themeOption.value.includes('purple') ? '#7C3AED' : 
                            themeOption.value.includes('gold') ? '#D97706' : 
                            themeOption.value.includes('gray') ? '#4B5563' : '#06B6D4'}, ${
                            themeOption.value.includes('blue') ? '#1E40AF' : 
                            themeOption.value.includes('green') ? '#047857' : 
                            themeOption.value.includes('purple') ? '#6D28D9' : 
                            themeOption.value.includes('gold') ? '#B45309' : 
                            themeOption.value.includes('gray') ? '#374151' : '#0891B2'
                          })` 
                        }}
                      />
                      <span className="text-xs font-medium mt-1">
                        {themeOption.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fonts Tab Content */}
            {selectedTab === 'fonts' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Choose a font family for better readability
                  </p>
                </div>
                
                <div className="font-options">
                  {availableFonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => {
                        setFontFamily(font.value);
                        setIsOpen(false);
                      }}
                      className={`font-option ${fontFamily === font.value ? 'active' : ''}`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                      <div className="font-preview" style={{ fontFamily: font.value }}>
                        The quick brown fox jumps over the lazy dog
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeSelector;
