/**
 * FluidContainer Component
 * Full-width container with responsive max-width constraints
 */

import React, { ReactNode } from 'react';

interface FluidContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'fluid';
  padding?: {
    x?: string;     // Horizontal padding
    y?: string;     // Vertical padding
  };
  margin?: {
    x?: 'auto' | string; // Horizontal margin
    y?: string;          // Vertical margin
  };
  background?: string;
  breakpoint?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  centerContent?: boolean;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
}

const FluidContainer: React.FC<FluidContainerProps> = ({
  children,
  className = '',
  size = 'lg',
  padding = { x: '1rem', y: '1rem' },
  margin = { x: 'auto', y: '0' },
  background = 'transparent',
  breakpoint = 'none',
  centerContent = false,
  overflow = 'visible',
}) => {
  // Max width sizes
  const maxWidths = {
    xs: 'max-w-screen-xs',      // 320px
    sm: 'max-w-screen-sm',      // 640px
    md: 'max-w-screen-md',      // 768px
    lg: 'max-w-screen-lg',      // 1024px
    xl: 'max-w-screen-xl',      // 1280px
    full: 'max-w-full',         // 100%
    fluid: '',                  // No max-width
  };

  // Breakpoint classes
  const breakpointClasses = {
    none: '',
    sm: 'sm:mx-auto',
    md: 'md:mx-auto',
    lg: 'lg:mx-auto',
    xl: 'xl:mx-auto',
    xxl: '2xl:mx-auto',
  };

  // Generate padding classes
  const getPaddingClasses = () => {
    const paddingClasses = [];
    
    if (padding.x === padding.y) {
      if (padding.x) paddingClasses.push(`p-${padding.x.replace('rem', '')}`);
    } else {
      if (padding.x) {
        const pxValue = padding.x.replace('rem', '');
        paddingClasses.push(`px-${pxValue}`);
      }
      if (padding.y) {
        const pyValue = padding.y.replace('rem', '');
        paddingClasses.push(`py-${pyValue}`);
      }
    }
    
    return paddingClasses.join(' ');
  };

  // Generate margin classes
  const getMarginClasses = () => {
    const marginClasses = [];
    
    if (margin.x === 'auto') {
      marginClasses.push('mx-auto');
    } else if (margin.x) {
      const mxValue = margin.x.replace('rem', '');
      marginClasses.push(`mx-${mxValue}`);
    }
    
    if (margin.y) {
      const myValue = margin.y.replace('rem', '');
      marginClasses.push(`my-${myValue}`);
    }
    
    return marginClasses.join(' ');
  };

  return (
    <div
      className={`
        w-full
        ${maxWidths[size]}
        ${getPaddingClasses()}
        ${getMarginClasses()}
        ${breakpoint !== 'none' ? breakpointClasses[breakpoint] : ''}
        ${centerContent ? 'flex flex-col items-center' : ''}
        ${overflow !== 'visible' ? `overflow-${overflow}` : ''}
        ${className}
      `}
      style={{
        backgroundColor: background !== 'transparent' ? `var(--${background})` : 'transparent',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

// Common Container Presets
export const PageContainer: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <FluidContainer
    className={className}
    size="xl"
    padding={{ x: '1rem', y: '2rem' }}
    breakpoint="lg"
  >
    {children}
  </FluidContainer>
);

export const SectionContainer: React.FC<{ 
  children: ReactNode; 
  className?: string;
  background?: string;
}> = ({
  children,
  className = '',
  background = 'transparent',
}) => (
  <FluidContainer
    className={className}
    size="lg"
    padding={{ x: '1rem', y: '3rem' }}
    margin={{ x: 'auto', y: '0' }}
    background={background}
    breakpoint="md"
  >
    {children}
  </FluidContainer>
);

export const HeroContainer: React.FC<{ 
  children: ReactNode; 
  className?: string;
  fullHeight?: boolean;
}> = ({
  children,
  className = '',
  fullHeight = false,
}) => (
  <FluidContainer
    className={className}
    size="full"
    padding={{ x: '1rem', y: fullHeight ? '0' : '4rem' }}
    margin={{ x: 'auto', y: '0' }}
    centerContent
    breakpoint="none"
    style={{
      minHeight: fullHeight ? '100vh' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    {children}
  </FluidContainer>
);

export const NarrowContainer: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <FluidContainer
    className={className}
    size="md"
    padding={{ x: '1rem', y: '1.5rem' }}
    breakpoint="lg"
    centerContent
  >
    {children}
  </FluidContainer>
);

export const WideContainer: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <FluidContainer
    className={className}
    size="fluid"
    padding={{ x: '2rem', y: '2rem' }}
    margin={{ x: 'auto', y: '0' }}
    breakpoint="none"
  >
    {children}
  </FluidContainer>
);

// Container with side margins for large screens
export const PaddedContainer: React.FC<{ 
  children: ReactNode; 
  className?: string;
  sidePadding?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({
  children,
  className = '',
  sidePadding = 'lg',
}) => {
  const paddingMap = {
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem',
  };

  return (
    <FluidContainer
      className={className}
      size="full"
      padding={{ x: '1rem', y: '2rem' }}
      margin={{ x: 'auto', y: '0' }}
      breakpoint="none"
      style={{
        paddingLeft: paddingMap[sidePadding],
        paddingRight: paddingMap[sidePadding],
      }}
    >
      {children}
    </FluidContainer>
  );
};

export default FluidContainer;
export { 
  PageContainer, 
  SectionContainer, 
  HeroContainer, 
  NarrowContainer, 
  WideContainer, 
  PaddedContainer 
};