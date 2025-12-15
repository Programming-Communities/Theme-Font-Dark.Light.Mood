'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

const IconClose = () => <span>✕</span>;

const FontSelector = () => {
  const { fontFamily, setFontFamily, availableFonts } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Font Selector Button - Positioned between DarkModeToggle and ThemeSettingsButton */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
        title="Change Font"
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          border: '2px solid var(--border)'
        }}
      >
        <Type className="h-5 w-5" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
             style={{
               backgroundColor: 'var(--surface)',
               color: 'var(--text-primary)',
               border: '1px solid var(--border)'
             }}>
          Change Font Family
        </div>
      </button>

      {/* Font Modal */}
      {isOpen && (
        <div className="theme-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="theme-modal font-modal" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h3>Select Font Family</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <IconClose />
              </button>
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
        </div>
      )}
    </>
  );
};

export default FontSelector;