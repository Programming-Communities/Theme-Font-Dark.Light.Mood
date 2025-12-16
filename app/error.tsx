// File 64: app/error.tsx
/**
 * Global Error Boundary Component - Handles errors in the app
 */

'use client';

import { useEffect } from 'react';
import { FluidContainer } from '@/components/layout/FluidContainer';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
    
    // Track error in analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true,
      });
    }
  }, [error]);

  const getErrorMessage = () => {
    if (error.message.includes('404')) {
      return {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist or has been moved.',
        icon: '🔍',
        suggestions: [
          'Check the URL for typos',
          'Go back to the previous page',
          'Visit our homepage',
          'Use the search feature'
        ]
      };
    }
    
    if (error.message.includes('500') || error.message.includes('Server')) {
      return {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        icon: '🚧',
        suggestions: [
          'Refresh the page',
          'Try again in a few minutes',
          'Clear your browser cache',
          'Check your internet connection'
        ]
      };
    }
    
    if (error.message.includes('Network')) {
      return {
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        icon: '📡',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Disable VPN if using',
          'Try using a different network'
        ]
      };
    }
    
    if (error.message.includes('Auth') || error.message.includes('401')) {
      return {
        title: 'Authentication Required',
        description: 'You need to be logged in to access this page.',
        icon: '🔒',
        suggestions: [
          'Sign in to your account',
          'Create a new account',
          'Reset your password',
          'Contact support if issue persists'
        ]
      };
    }
    
    // Default error
    return {
      title: 'Something Went Wrong',
      description: 'An unexpected error occurred. Please try again.',
      icon: '⚠️',
      suggestions: [
        'Refresh the page',
        'Clear browser cache',
        'Try a different browser',
        'Report this issue to support'
      ]
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <FluidContainer>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/')}
                className="text-xl font-bold text-primary"
              >
                English Communities PK
              </button>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Home
                </Button>
                <Button
                  onClick={() => router.push('/contact')}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Error Content */}
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Error Icon */}
              <div className="text-8xl mb-6">
                {errorInfo.icon}
              </div>
              
              {/* Error Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {errorInfo.title}
              </h1>
              
              {/* Error Description */}
              <p className="text-xl text-muted-foreground mb-8">
                {errorInfo.description}
              </p>
              
              {/* Error Code (for debugging) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-8 p-4 bg-card rounded-lg text-left">
                  <div className="text-sm font-medium mb-2">Error Details:</div>
                  <code className="text-sm text-red-500 break-all">
                    {error.message}
                  </code>
                  {error.digest && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Error ID: {error.digest}
                    </div>
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  onClick={() => reset()}
                  className="flex-1 sm:flex-none"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/')}
                  className="flex-1 sm:flex-none"
                >
                  Go Home
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => router.back()}
                  className="flex-1 sm:flex-none"
                >
                  Go Back
                </Button>
              </div>
              
              {/* Helpful Suggestions */}
              <div className="bg-card rounded-xl p-6 text-left">
                <h3 className="text-lg font-semibold mb-4">
                  Here are some things you can try:
                </h3>
                <ul className="space-y-3">
                  {errorInfo.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Additional Help */}
              <div className="mt-8 pt-8 border-t">
                <p className="text-muted-foreground mb-4">
                  Still having trouble?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/contact')}
                  >
                    Contact Support
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/help')}
                  >
                    Visit Help Center
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://status.english.communities.pk', '_blank')}
                  >
                    Check System Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Quick Links Footer */}
        <footer className="border-t py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  title: 'Popular Pages',
                  links: [
                    { label: 'Home', href: '/' },
                    { label: 'Courses', href: '/courses' },
                    { label: 'Community', href: '/community' },
                    { label: 'Resources', href: '/resources' }
                  ]
                },
                {
                  title: 'Help & Support',
                  links: [
                    { label: 'Help Center', href: '/help' },
                    { label: 'FAQs', href: '/faq' },
                    { label: 'Contact Us', href: '/contact' },
                    { label: 'System Status', href: 'https://status.english.communities.pk' }
                  ]
                },
                {
                  title: 'Account',
                  links: [
                    { label: 'Sign In', href: '/auth/login' },
                    { label: 'Register', href: '/auth/register' },
                    { label: 'Reset Password', href: '/auth/reset' },
                    { label: 'My Dashboard', href: '/dashboard' }
                  ]
                },
                {
                  title: 'Legal',
                  links: [
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms of Service', href: '/terms' },
                    { label: 'Cookie Policy', href: '/cookies' },
                    { label: 'Accessibility', href: '/accessibility' }
                  ]
                }
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold mb-4">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <button
                          onClick={() => router.push(link.href)}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Copyright */}
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} English Communities PK. All rights reserved.</p>
              <p className="mt-1">Error occurred at {new Date().toLocaleString()}</p>
            </div>
          </div>
        </footer>
      </div>
    </FluidContainer>
  );
}

// Component-specific error boundaries
export function PageError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">Failed to Load</h2>
        <p className="text-muted-foreground mb-4">
          {error.message || 'An error occurred while loading this page.'}
        </p>
        <Button onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}

export function ComponentError({ error, reset }: ErrorProps) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-red-500 text-xl">⚠️</div>
        <div className="flex-1">
          <h4 className="font-semibold text-red-700 mb-1">
            Component Error
          </h4>
          <p className="text-sm text-red-600 mb-3">
            {error.message || 'This component failed to render.'}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={reset}
            >
              Retry
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataError({ error, reset, resource = 'data' }: ErrorProps & { resource?: string }) {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">📊</div>
      <h3 className="text-lg font-semibold mb-2">
        Failed to Load {resource.charAt(0).toUpperCase() + resource.slice(1)}
      </h3>
      <p className="text-muted-foreground mb-4">
        {error.message || `Unable to load ${resource}. Please try again.`}
      </p>
      <Button onClick={reset}>
        Reload {resource}
      </Button>
    </div>
  );
}

export function NetworkError({ error, reset }: ErrorProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🌐</div>
      <h2 className="text-2xl font-bold mb-3">Network Connection Lost</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        It looks like you're offline. Please check your internet connection and try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={reset}>
          Retry Connection
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
}

export function NotFoundError({ resource = 'Page' }: { resource?: string }) {
  const router = useRouter();
  
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🔍</div>
      <h2 className="text-2xl font-bold mb-3">{resource} Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The {resource.toLowerCase()} you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => router.push('/')}>
          Go Home
        </Button>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push('/search')}
        >
          Search Site
        </Button>
      </div>
    </div>
  );
}

export function AccessError({ error, reset }: ErrorProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🔒</div>
      <h2 className="text-2xl font-bold mb-3">Access Restricted</h2>
      <p className="text-muted-foreground mb-6">
        {error.message || 'You do not have permission to access this page.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => window.location.href = '/auth/login'}>
          Sign In
        </Button>
        <Button
          variant="outline"
          onClick={reset}
        >
          Try Again
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/auth/register'}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
}

export function MaintenanceError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="text-6xl mb-6">🔧</div>
        <h1 className="text-4xl font-bold mb-4">Site Under Maintenance</h1>
        <p className="text-xl text-muted-foreground mb-6">
          We're currently performing scheduled maintenance to improve your experience.
          The site will be back online shortly.
        </p>
        <div className="space-y-4">
          <div className="text-left bg-card p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Estimated Time:</h3>
            <p>30 minutes - 1 hour</p>
          </div>
          <div className="text-left bg-card p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What's Happening:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Performance improvements</li>
              <li>Security updates</li>
              <li>New feature deployment</li>
            </ul>
          </div>
          <div className="text-left bg-card p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm">
              Contact support at{' '}
              <a href="mailto:support@english.communities.pk" className="text-primary hover:underline">
                support@english.communities.pk
              </a>
            </p>
          </div>
        </div>
        <Button
          className="mt-8"
          onClick={() => window.location.reload()}
        >
          Check Status
        </Button>
      </div>
    </div>
  );
}