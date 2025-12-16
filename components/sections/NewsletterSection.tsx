'use client';

import { useState } from 'react';
import { useCookies } from '@/hooks/useCookies';
import { Alert } from '@/components/ui/common/Alert';
import { Input } from '@/components/ui/common/Input';

interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    subscribed: boolean;
  };
}

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const { getCookie, setCookie } = useCookies();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionStatus({
        type: 'error',
        message: 'Please enter your email address',
      });
      return;
    }

    if (!validateEmail(email)) {
      setSubscriptionStatus({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      return;
    }

    // Check if already subscribed
    const subscribedEmails = getCookie('newsletter_subscribed') || '[]';
    const emails = JSON.parse(subscribedEmails);
    
    if (emails.includes(email.toLowerCase())) {
      setSubscriptionStatus({
        type: 'error',
        message: 'This email is already subscribed to our newsletter',
      });
      return;
    }

    setIsLoading(true);
    setSubscriptionStatus({ type: null, message: '' });

    try {
      // Simulate API call to WordPress newsletter endpoint
      const response = await fetch('https://api.communities.pk/wp-json/english-communities/v1/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          source: 'website_newsletter_section',
          timestamp: new Date().toISOString(),
        }),
      });

      const data: NewsletterResponse = await response.json();

      if (data.success) {
        // Store in cookies to prevent duplicate subscriptions
        const updatedEmails = [...emails, email.toLowerCase()];
        setCookie('newsletter_subscribed', JSON.stringify(updatedEmails), {
          expires: 365, // 1 year
          secure: true,
          sameSite: 'Strict',
        });

        setSubscriptionStatus({
          type: 'success',
          message: '🎉 Successfully subscribed! Check your email for confirmation.',
        });
        setEmail('');

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubscriptionStatus({ type: null, message: '' });
        }, 5000);
      } else {
        setSubscriptionStatus({
          type: 'error',
          message: data.message || 'Failed to subscribe. Please try again.',
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      className="py-12 md:py-16"
      aria-label="Newsletter Subscription"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-6 md:p-8 lg:p-12 relative overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 10px 40px var(--shadow)',
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full"
              style={{ backgroundColor: 'var(--primary)' }}
            />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full"
              style={{ backgroundColor: 'var(--secondary)' }}
            />
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
              }}
            >
              <span className="text-2xl">✉️</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Stay Updated with English Learning Tips
            </h2>
            
            <p className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Join 10,000+ English learners who receive weekly tips, resources, and community updates directly in their inbox.
            </p>
          </div>

          {subscriptionStatus.type && (
            <div className="mb-6">
              <Alert
                type={subscriptionStatus.type}
                message={subscriptionStatus.message}
                onClose={() => setSubscriptionStatus({ type: null, message: '' })}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  aria-label="Email address for newsletter subscription"
                  className="w-full py-3 px-4 text-base"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  minWidth: '140px',
                }}
                aria-label={isLoading ? 'Subscribing...' : 'Subscribe to newsletter'}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Subscribing...
                  </div>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              By subscribing, you agree to our{' '}
              <a 
                href="/privacy"
                className="font-medium hover:underline"
                style={{ color: 'var(--primary)' }}
                aria-label="Privacy policy"
              >
                Privacy Policy
              </a>
              . No spam, unsubscribe anytime.
            </p>
          </div>

          {/* Benefits list */}
          <div className="mt-8 pt-8 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <h3 className="text-lg font-semibold mb-4 text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              What you'll receive:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: '🎯', text: 'Weekly learning tips & strategies' },
                { icon: '📚', text: 'Exclusive resource recommendations' },
                { icon: '💬', text: 'Community discussion highlights' },
                { icon: '🏆', text: 'Success stories from members' },
                { icon: '📅', text: 'Upcoming events & webinars' },
                { icon: '🎁', text: 'Special offers & early access' },
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span className="text-xl">{benefit.icon}</span>
                  <span className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}