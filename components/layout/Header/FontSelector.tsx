/**
 * FontSelector Component
 * Allows users to select from multiple font families
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useFont } from '@/hooks/useFont';

interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
  description: string;
  popularity: number;
}

const FontSelector: React.FC = () => {
  const { fontFamily, setFontFamily } = useFont();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Available fonts with metadata
  const fontOptions: FontOption[] = [
    {
      id: 'system-ui',
      name: 'System UI',
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      category: 'sans-serif',
      description: 'Default system font for your device',
      popularity: 100,
    },
    {
      id: 'inter',
      name: 'Inter',
      family: '"Inter", sans-serif',
      category: 'sans-serif',
      description: 'Modern, highly readable sans-serif font',
      popularity: 95,
    },
    {
      id: 'roboto',
      name: 'Roboto',
      family: '"Roboto", sans-serif',
      category: 'sans-serif',
      description: 'Clean, versatile font for all interfaces',
      popularity: 90,
    },
    {
      id: 'open-sans',
      name: 'Open Sans',
      family: '"Open Sans", sans-serif',
      category: 'sans-serif',
      description: 'Humanist sans-serif with excellent readability',
      popularity: 85,
    },
    {
      id: 'poppins',
      name: 'Poppins',
      family: '"Poppins", sans-serif',
      category: 'sans-serif',
      description: 'Geometric sans-serif with modern feel',
      popularity: 80,
    },
    {
      id: 'montserrat',
      name: 'Montserrat',
      family: '"Montserrat", sans-serif',
      category: 'sans-serif',
      description: 'Elegant sans-serif inspired by urban typography',
      popularity: 75,
    },
    {
      id: 'merriweather',
      name: 'Merriweather',
      family: '"Merriweather", serif',
      category: 'serif',
      description: 'Serif font designed for reading pleasure',
      popularity: 70,
    },
    {
      id: 'playfair-display',
      name: 'Playfair Display',
      family: '"Playfair Display", serif',
      category: 'serif',
      description: 'Elegant serif with high contrast',
      popularity: 65,
    },
    {
      id: 'lora',
      name: 'Lora',
      family: '"Lora", serif',
      category: 'serif',
      description: 'Well-balanced contemporary serif',
      popularity: 60,
    },
    {
      id: 'source-sans-pro',
      name: 'Source Sans Pro',
      family: '"Source Sans Pro", sans-serif',
      category: 'sans-serif',
      description: 'Adobe\'s first open source sans-serif',
      popularity: 55,
    },
    {
      id: 'nunito',
      name: 'Nunito',
      family: '"Nunito", sans-serif',
      category: 'sans-serif',
      description: 'Rounded sans-serif with friendly appearance',
      popularity: 50,
    },
    {
      id: 'roboto-mono',
      name: 'Roboto Mono',
      family: '"Roboto Mono", monospace',
      category: 'monospace',
      description: 'Monospace variant of Roboto for code',
      popularity: 45,
    },
    {
      id: 'source-code-pro',
      name: 'Source Code Pro',
      family: '"Source Code Pro", monospace',
      category: 'monospace',
      description: 'Monospace font for coding environments',
      popularity: 40,
    },
    {
      id: 'comic-neue',
      name: 'Comic Neue',
      family: '"Comic Neue", cursive',
      category: 'handwriting',
      description: 'Casual handwriting style font',
      popularity: 35,
    },
    {
      id: 'dancing-script',
      name: 'Dancing Script',
      family: '"Dancing Script", cursive',
      category: 'handwriting',
      description: 'Elegant cursive script font',
      popularity: 30,
    },
  ];

  // Filter fonts based on search
  const filteredFonts = fontOptions.filter(font =>
    font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    font.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    font.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group fonts by category
  const fontsByCategory = filteredFonts.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, FontOption[]>);

  const handleFontSelect = (fontId: string) => {
    const selectedFont = fontOptions.find(f => f.id === fontId);
    if (selectedFont) {
      setFontFamily(selectedFont.family);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  if (!mounted) {
    return (
      <div className="font-selector">
        <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const currentFont = fontOptions.find(f => f.id === fontFamily.split('-')[0]) || fontOptions[0];

  return (
    <div className="font-selector">
      <div className="relative">
        {/* Current Font Display */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full sm:w-48 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02]"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          aria-label="Select font family"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: 'var(--primary-light)', 
                color: 'var(--primary)' 
              }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="text-left">
              <div className="font-medium text-sm" style={{ fontFamily: currentFont.family }}>
                {currentFont.name}
              </div>
              <div className="text-xs opacity-70 truncate" style={{ color: 'var(--text-secondary)' }}>
                {currentFont.category}
              </div>
            </div>
          </div>

          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Font Selection Dropdown */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 p-4 rounded-lg shadow-xl z-50"
               style={{ 
                 backgroundColor: 'var(--bg-primary)',
                 border: '1px solid var(--border)',
                 maxHeight: '80vh',
                 overflowY: 'auto',
               }}>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Font List by Categories */}
            <div className="space-y-4">
              {Object.entries(fontsByCategory).map(([category, fonts]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ 
                    color: 'var(--text-secondary)',
                    opacity: 0.7,
                  }}>
                    {category}
                  </h4>
                  
                  <div className="space-y-2">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => handleFontSelect(font.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          currentFont.id === font.id ? 'ring-2 ring-opacity-50' : 'hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor: currentFont.id === font.id 
                            ? 'var(--primary-light)'
                            : 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div 
                              className="font-semibold text-lg mb-1" 
                              style={{ fontFamily: font.family }}
                            >
                              {font.name}
                              {font.id === 'system-ui' && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ 
                                  backgroundColor: 'var(--primary-light)', 
                                  color: 'var(--primary)',
                                  fontFamily: 'inherit',
                                }}>
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm opacity-70" style={{ color: 'var(--text-secondary)' }}>
                              {font.description}
                            </div>
                          </div>
                          
                          {/* Popularity Indicator */}
                          <div className="flex-shrink-0 ml-4">
                            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                              {font.popularity}%
                            </div>
                            <div className="w-12 h-1 rounded-full overflow-hidden mt-1" style={{ 
                              backgroundColor: 'var(--bg-tertiary)',
                            }}>
                              <div 
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${font.popularity}%`,
                                  backgroundColor: 'var(--primary)',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Section */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Preview
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontFamily: currentFont.family,
                  color: 'var(--text-primary)',
                }}
              >
                <p className="text-lg font-semibold mb-2">
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-sm">
                  This is how your text will look with {currentFont.name} font. All 26 letters in a single sentence.
                </p>
                <div className="mt-3 text-xs opacity-70">
                  <div className="flex space-x-4">
                    <span>Regular</span>
                    <span className="italic">Italic</span>
                    <span className="font-bold">Bold</span>
                    <span className="font-bold italic">Bold Italic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx>{`
        .font-selector :global(.absolute) {
          animation: slideDown 0.2s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Custom scrollbar for dropdown */
        .font-selector :global(.max-h-\[80vh\])::-webkit-scrollbar {
          width: 8px;
        }
        
        .font-selector :global(.max-h-\[80vh\])::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 4px;
        }
        
        .font-selector :global(.max-h-\[80vh\])::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
        
        .font-selector :global(.max-h-\[80vh\])::-webkit-scrollbar-thumb:hover) {
          background: var(--primary-light);
        }
      `}</style>
    </div>
  );
};

export default FontSelector;