'use client';

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

const DEVICE_BREAKPOINTS = {
  mobile: BREAKPOINTS.sm,
  tablet: BREAKPOINTS.lg,
  desktop: BREAKPOINTS.lg + 1,
};

export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getCurrentDeviceInfo());

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getCurrentDeviceInfo());
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}

function getCurrentDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return getDefaultDeviceInfo();
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Determine device type
  let type: DeviceType = 'desktop';
  if (width < DEVICE_BREAKPOINTS.mobile) {
    type = 'mobile';
  } else if (width < DEVICE_BREAKPOINTS.tablet) {
    type = 'tablet';
  }

  // Determine orientation
  const orientation: Orientation = width > height ? 'landscape' : 'portrait';

  // Determine breakpoint
  let breakpoint: DeviceInfo['breakpoint'] = 'xs';
  if (width >= BREAKPOINTS['2xl']) breakpoint = '2xl';
  else if (width >= BREAKPOINTS.xl) breakpoint = 'xl';
  else if (width >= BREAKPOINTS.lg) breakpoint = 'lg';
  else if (width >= BREAKPOINTS.md) breakpoint = 'md';
  else if (width >= BREAKPOINTS.sm) breakpoint = 'sm';

  return {
    type,
    orientation,
    isMobile: type === 'mobile',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    screenWidth: width,
    screenHeight: height,
    breakpoint,
  };
}

function getDefaultDeviceInfo(): DeviceInfo {
  return {
    type: 'desktop',
    orientation: 'landscape',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isPortrait: false,
    isLandscape: true,
    screenWidth: 1920,
    screenHeight: 1080,
    breakpoint: '2xl',
  };
}

// Utility functions
export function useIsMobile() {
  const device = useDevice();
  return device.isMobile;
}

export function useIsTablet() {
  const device = useDevice();
  return device.isTablet;
}

export function useIsDesktop() {
  const device = useDevice();
  return device.isDesktop;
}

export function useBreakpoint() {
  const device = useDevice();
  return device.breakpoint;
}

export function useIsAboveBreakpoint(breakpoint: keyof typeof BREAKPOINTS) {
  const device = useDevice();
  const breakpointValue = BREAKPOINTS[breakpoint];
  return device.screenWidth >= breakpointValue;
}

export function useIsBelowBreakpoint(breakpoint: keyof typeof BREAKPOINTS) {
  const device = useDevice();
  const breakpointValue = BREAKPOINTS[breakpoint];
  return device.screenWidth < breakpointValue;
}

export function useResponsiveValue<T>(
  values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    default: T;
  }
): T {
  const device = useDevice();
  
  if (device.isMobile && values.mobile !== undefined) {
    return values.mobile;
  }
  
  if (device.isTablet && values.tablet !== undefined) {
    return values.tablet;
  }
  
  if (device.isDesktop && values.desktop !== undefined) {
    return values.desktop;
  }
  
  return values.default;
}

// Hook for conditional rendering based on device
export function useDeviceCondition(
  condition: 'mobile-only' | 'tablet-only' | 'desktop-only' | 'mobile-and-tablet' | 'tablet-and-desktop'
): boolean {
  const device = useDevice();
  
  switch (condition) {
    case 'mobile-only':
      return device.isMobile;
    case 'tablet-only':
      return device.isTablet;
    case 'desktop-only':
      return device.isDesktop;
    case 'mobile-and-tablet':
      return device.isMobile || device.isTablet;
    case 'tablet-and-desktop':
      return device.isTablet || device.isDesktop;
    default:
      return false;
  }
}