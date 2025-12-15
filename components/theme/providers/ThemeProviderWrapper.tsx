'use client';

import React from 'react';
import { ThemeProvider } from '@/components/theme/contexts/ThemeContext';

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
