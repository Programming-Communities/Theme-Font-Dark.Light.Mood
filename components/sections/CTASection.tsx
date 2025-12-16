'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Alert } from '@/components/ui/common/Alert';

interface CTASectionProps {
  variant?: 'primary' | 'secondary' | 'success';
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export default function CTASection({
  variant = 'primary',
  title = 'Join Our Thriving Community',
  description = 'Connect with English learners, participate in discussions, and access exclusive resources. Start your journey to fluency today!',
  primaryAction = {
    label: 'Join Community',
    href: '/register',
  },
  secondaryAction = {
    label: 'Browse Resources',
    href: '/resources',
  },
}: CTASectionProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variantColors = {
    primary: {
      bg: 'var(--primary)',
      hover: 'var(--primary-dark)',
      text: 'white',
    },
    secondary: {
      bg: 'var(--secondary)',
      hover: 'var(--secondary-dark)',
      text: 'white',
    },
    success: {
      bg: 'var(--success)',
      hover: 'var(--success-dark)',
      text: 'white',
    },
  };

  const handlePrimaryClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      router.push('/community');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      router.push(primaryAction.href);
    } catch (err) {
      setError('Failed to navigate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: variantColors[variant].bg }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: variantColors[variant].bg }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Navigation Error"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        <div className="space-y-6 mb-8">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {isAuthenticated ? `Welcome back, ${user?.displayName || 'Member'}!` : title}
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isAuthenticated 
              ? 'Continue your English learning journey with personalized resources and community discussions.'
              : description
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handlePrimaryClick}
            disabled={isLoading}
            className="px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: variantColors[variant].bg,
              color: variantColors[variant].text,
              minWidth: '200px',
            }}
            aria-label={isLoading ? 'Loading...' : primaryAction.label}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                Loading...
              </div>
            ) : (
              <>
                {isAuthenticated ? 'Go to Dashboard' : primaryAction.label}
                <span className="ml-2" aria-hidden="true">→</span>
              </>
            )}
          </button>

          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '2px solid var(--border)',
                minWidth: '200px',
              }}
              aria-label={secondaryAction.label}
            >
              {secondaryAction.label}
              <span className="ml-2" aria-hidden="true">↗</span>
            </Link>
          )}
        </div>

        {/* Stats preview for unauthenticated users */}
        {!isAuthenticated && (
          <div className="mt-12 pt-8 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Members', value: '5,000+' },
                { label: 'Learning Resources', value: '1,200+' },
                { label: 'Daily Discussions', value: '300+' },
                { label: 'Success Stories', value: '850+' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="text-2xl md:text-3xl font-bold mb-1"
                    style={{ color: variantColors[variant].bg }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span>Free to Join</span>
          </div>
          <div className="hidden sm:block">•</div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span>Secure & Private</span>
          </div>
          <div className="hidden sm:block">•</div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <span>Global Community</span>
          </div>
        </div>
      </div>
    </section>
  );
}