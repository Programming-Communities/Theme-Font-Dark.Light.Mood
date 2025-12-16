'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export interface NewsletterFormProps {
  variant?: 'default' | 'inline' | 'minimal' | 'popup';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  errorMessage?: string;
  showName?: boolean;
  requireName?: boolean;
  showConsent?: boolean;
  consentText?: string;
  listId?: string;
  className?: string;
  onSubmit?: (data: NewsletterFormData) => Promise<void> | void;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  consent?: boolean;
}

interface FormErrors {
  email?: string;
  name?: string;
  consent?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  variant = 'default',
  size = 'md',
  title = 'Subscribe to our newsletter',
  description = 'Get the latest posts delivered right to your inbox.',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  successMessage = 'Thank you for subscribing!',
  errorMessage = 'Something went wrong. Please try again.',
  showName = false,
  requireName = false,
  showConsent = true,
  consentText = 'I agree to receive email updates and newsletters.',
  listId = 'default',
  className,
  onSubmit,
  onSuccess,
  onError,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: user?.email || '',
    name: user?.name || '',
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Name validation
    if (requireName && !formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    // Consent validation
    if (showConsent && !formData.consent) {
      newErrors.consent = 'You must agree to receive emails';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // If custom onSubmit is provided, use it
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default implementation - integrate with your newsletter service
        // Example: Mailchimp, ConvertKit, etc.
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            listId,
            source: 'website',
          }),
        });

        if (!response.ok) {
          throw new Error('Subscription failed');
        }
      }

      setStatus('success');
      setMessage(successMessage);
      onSuccess?.(formData.email);

      // Reset form on success
      if (!user) {
        setFormData({ email: '', name: '', consent: false });
      }
    } catch (error) {
      setStatus('error');
      setMessage(errorMessage);
      onError?.((error as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const sizeClasses = {
    sm: {
      input: 'px-3 py-1.5 text-sm',
      button: 'px-4 py-1.5 text-sm',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      input: 'px-4 py-2 text-base',
      button: 'px-6 py-2 text-base',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      input: 'px-6 py-3 text-lg',
      button: 'px-8 py-3 text-lg',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-4',
    inline: 'flex flex-col sm:flex-row items-center gap-3',
    minimal: 'space-y-3',
    popup: 'bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-6 max-w-md mx-auto',
  };

  const sizeConfig = sizeClasses[size];

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showName && (
        <div>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Your name"
            className={cn(
              'w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              sizeConfig.input,
              errors.name && 'border-red-500 focus:ring-red-500'
            )}
            disabled={!!user?.name}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>
      )}

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            sizeConfig.input,
            errors.email && 'border-red-500 focus:ring-red-500'
          )}
          disabled={!!user?.email}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      {showConsent && (
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent || false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              id="newsletter-consent"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="newsletter-consent"
              className={cn(
                'text-gray-700 dark:text-gray-300',
                errors.consent && 'text-red-600 dark:text-red-400'
              )}
            >
              {consentText}
            </label>
            {errors.consent && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.consent}</p>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className={cn(
          'w-full rounded-md bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          sizeConfig.button
        )}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Subscribing...
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );

  const renderMessage = () => {
    if (!message) return null;

    const isSuccess = status === 'success';
    const isError = status === 'error';

    return (
      <div
        className={cn(
          'p-4 rounded-md',
          isSuccess && 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300',
          isError && 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
        )}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            {isSuccess ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    );
  };

  if (variant === 'inline') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex flex-col sm:flex-row gap-3">
          {showName && (
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Your name"
              className={cn(
                'flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                sizeConfig.input,
                errors.name && 'border-red-500 focus:ring-red-500'
              )}
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={placeholder}
            className={cn(
              'flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              sizeConfig.input,
              errors.email && 'border-red-500 focus:ring-red-500'
            )}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className={cn(
              'rounded-md bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              sizeConfig.button
            )}
          >
            {buttonText}
          </button>
        </div>
        {showConsent && (
          <div className="flex items-start">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent || false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
              id="inline-consent"
            />
            <label
              htmlFor="inline-consent"
              className="ml-2 text-sm text-gray-600 dark:text-gray-400"
            >
              {consentText}
            </label>
          </div>
        )}
        {renderMessage()}
      </div>
    );
  }

  return (
    <div className={cn(variantClasses[variant], className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className={cn('font-bold text-gray-900 dark:text-white', sizeConfig.title)}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn('text-gray-600 dark:text-gray-400', sizeConfig.description)}>
              {description}
            </p>
          )}
        </div>
      )}

      {renderForm()}
      {renderMessage()}
    </div>
  );
};

export interface NewsletterPreferencesProps {
  lists?: Array<{
    id: string;
    name: string;
    description?: string;
    subscribed: boolean;
  }>;
  frequency?: 'daily' | 'weekly' | 'monthly';
  format?: 'html' | 'text';
  onUpdate?: (preferences: NewsletterPreferencesData) => Promise<void> | void;
  className?: string;
}

export interface NewsletterPreferencesData {
  lists: string[];
  frequency: string;
  format: string;
}

export const NewsletterPreferences: React.FC<NewsletterPreferencesProps> = ({
  lists = [],
  frequency = 'weekly',
  format = 'html',
  onUpdate,
  className,
}) => {
  const [preferences, setPreferences] = useState<NewsletterPreferencesData>({
    lists: lists.filter(list => list.subscribed).map(list => list.id),
    frequency,
    format,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleListToggle = (listId: string) => {
    setPreferences(prev => ({
      ...prev,
      lists: prev.lists.includes(listId)
        ? prev.lists.filter(id => id !== listId)
        : [...prev.lists, listId],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      if (onUpdate) {
        await onUpdate(preferences);
      } else {
        // Default implementation
        await fetch('/api/newsletter/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences),
        });
      }

      setMessage('Preferences updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {lists.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Newsletter Lists
          </h4>
          <div className="space-y-3">
            {lists.map(list => (
              <div key={list.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={preferences.lists.includes(list.id)}
                    onChange={() => handleListToggle(list.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    id={`list-${list.id}`}
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor={`list-${list.id}`}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {list.name}
                  </label>
                  {list.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {list.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Email Preferences
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency
            </label>
            <select
              value={preferences.frequency}
              onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Format
            </label>
            <div className="space-y-2">
              {['html', 'text'].map((fmt) => (
                <div key={fmt} className="flex items-center">
                  <input
                    type="radio"
                    id={`format-${fmt}`}
                    name="format"
                    value={fmt}
                    checked={preferences.format === fmt}
                    onChange={(e) => setPreferences(prev => ({ ...prev, format: e.target.value }))}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor={`format-${fmt}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {fmt === 'html' ? 'HTML (with images and formatting)' : 'Plain Text'}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-md bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>

      {message && (
        <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm">
          {message}
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;