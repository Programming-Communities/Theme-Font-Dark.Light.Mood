'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface AdPlaceholderProps {
  size?: string;
  label?: string;
  showInfo?: boolean;
}

export default function AdPlaceholder({ 
  size = '300x250', 
  label = 'Advertisement',
  showInfo = true 
}: AdPlaceholderProps) {
  const { themeColors } = useTheme();
  
  const getDimensions = () => {
    const [width, height] = size.split('x').map(Number);
    return { width: Math.min(width, 400), height: Math.min(height, 400) };
  };
  
  const dimensions = getDimensions();
  const isVertical = dimensions.height > dimensions.width;
  const isHorizontal = dimensions.width > dimensions.height;
  const isSquare = dimensions.width === dimensions.height;
  
  return (
    <div 
      className="relative flex items-center justify-center overflow-hidden rounded border"
      style={{
        width: '100%',
        maxWidth: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        borderColor: themeColors.border,
        backgroundColor: `${themeColors.primary}05`,
      }}
    >
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `linear-gradient(45deg, ${themeColors.primary}25 25%, transparent 25%),
                                 linear-gradient(-45deg, ${themeColors.primary}25 25%, transparent 25%),
                                 linear-gradient(45deg, transparent 75%, ${themeColors.primary}25 75%),
                                 linear-gradient(-45deg, transparent 75%, ${themeColors.primary}25 75%)`,
               backgroundSize: '20px 20px',
               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
             }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center p-4">
        {/* Icon based on ad size/orientation */}
        <div className="text-3xl mb-2 opacity-40" style={{ color: themeColors.primary }}>
          {isVertical ? '📱' : isHorizontal ? '🖥️' : isSquare ? '📐' : '📢'}
        </div>
        
        {/* Label */}
        <div className="mb-1">
          <div className="text-sm font-medium" style={{ color: themeColors.primary }}>
            {label}
          </div>
          <div className="text-xs" style={{ color: themeColors.text.secondary }}>
            {size} • {isVertical ? 'Vertical' : isHorizontal ? 'Horizontal' : 'Square'}
          </div>
        </div>
        
        {/* Size Indicator */}
        <div className="mt-3">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
               style={{
                 backgroundColor: `${themeColors.primary}15`,
                 color: themeColors.primary,
                 border: `1px solid ${themeColors.primary}30`
               }}>
            <span>{dimensions.width}×{dimensions.height}</span>
          </div>
        </div>
      </div>
      
      {/* Corner Info */}
      {showInfo && (
        <>
          <div className="absolute top-2 left-2">
            <div className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                 style={{
                   backgroundColor: `${themeColors.primary}20`,
                   color: themeColors.primary
                 }}>
              AD
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2">
            <div className="text-[10px] opacity-40" style={{ color: themeColors.text.secondary }}>
              Placeholder
            </div>
          </div>
        </>
      )}
      
      {/* Loading Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2"
             style={{
               borderColor: themeColors.border,
               borderTopColor: themeColors.primary
             }} />
      </div>
    </div>
  );
}
