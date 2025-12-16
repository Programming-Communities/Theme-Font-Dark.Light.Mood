/**
 * GridContainer Component
 * Responsive grid layout container with customizable columns and spacing
 */

import React, { ReactNode } from 'react';

interface GridContainerProps {
  children: ReactNode;
  className?: string;
  columns?: {
    xs?: number;    // Mobile (< 640px)
    sm?: number;    // Tablet (≥ 640px)
    md?: number;    // Desktop (≥ 768px)
    lg?: number;    // Large desktop (≥ 1024px)
    xl?: number;    // Extra large (≥ 1280px)
    xxl?: number;   // 2XL (≥ 1536px)
  };
  gap?: {
    x?: string;     // Horizontal gap
    y?: string;     // Vertical gap
  };
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  breakpoint?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  fullWidth?: boolean;
}

const GridContainer: React.FC<GridContainerProps> = ({
  children,
  className = '',
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 },
  gap = { x: '1rem', y: '1rem' },
  align = 'stretch',
  justify = 'start',
  breakpoint = 'md',
  fullWidth = false,
}) => {
  // Generate grid column classes based on breakpoints
  const getGridColumns = () => {
    const colClasses = [];
    
    if (columns.xs) colClasses.push(`grid-cols-${columns.xs}`);
    if (columns.sm) colClasses.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) colClasses.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) colClasses.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) colClasses.push(`xl:grid-cols-${columns.xl}`);
    if (columns.xxl) colClasses.push(`2xl:grid-cols-${columns.xxl}`);
    
    return colClasses.join(' ');
  };

  // Generate gap classes
  const getGapClasses = () => {
    const gapClasses = [];
    
    if (gap.x === gap.y) {
      if (gap.x) gapClasses.push(`gap-${gap.x.replace('rem', '')}`);
    } else {
      if (gap.x) gapClasses.push(`gap-x-${gap.x.replace('rem', '')}`);
      if (gap.y) gapClasses.push(`gap-y-${gap.y.replace('rem', '')}`);
    }
    
    return gapClasses.join(' ');
  };

  // Alignment classes
  const alignmentClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  // Justification classes
  const justificationClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  // Breakpoint classes
  const breakpointClasses = {
    none: 'grid',
    sm: 'sm:grid',
    md: 'md:grid',
    lg: 'lg:grid',
    xl: 'xl:grid',
    xxl: '2xl:grid',
  };

  return (
    <div
      className={`
        ${breakpointClasses[breakpoint]}
        ${getGridColumns()}
        ${getGapClasses()}
        ${alignmentClasses[align]}
        ${justificationClasses[justify]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        display: breakpoint === 'none' ? 'grid' : 'block',
      }}
    >
      {children}
    </div>
  );
};

// Common Grid Presets
export const MasonryGrid: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <GridContainer
    className={className}
    columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
    gap={{ x: '1rem', y: '1rem' }}
    breakpoint="sm"
  >
    {children}
  </GridContainer>
);

export const CardGrid: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <GridContainer
    className={className}
    columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
    gap={{ x: '1.5rem', y: '1.5rem' }}
    breakpoint="sm"
  >
    {children}
  </GridContainer>
);

export const BlogGrid: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <GridContainer
    className={className}
    columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
    gap={{ x: '2rem', y: '2rem' }}
    breakpoint="md"
  >
    {children}
  </GridContainer>
);

export const GalleryGrid: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <GridContainer
    className={className}
    columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6, xxl: 7 }}
    gap={{ x: '0.5rem', y: '0.5rem' }}
    breakpoint="sm"
  >
    {children}
  </GridContainer>
);

export const StatsGrid: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <GridContainer
    className={className}
    columns={{ xs: 2, sm: 3, md: 4, lg: 4, xl: 6, xxl: 6 }}
    gap={{ x: '1rem', y: '1rem' }}
    breakpoint="sm"
  >
    {children}
  </GridContainer>
);

export default GridContainer;
export { MasonryGrid, CardGrid, BlogGrid, GalleryGrid, StatsGrid };