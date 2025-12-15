'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme/contexts/ThemeContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
