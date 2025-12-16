'use client';

import { useState } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Send, X, Loader2, User, Mail, Globe } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (data: {
    content: string;
    author: string;
    email: string;
    website?: string;
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  replyingTo?: string;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  replyingTo,
}: CommentFormProps) {
  const { themeColors } = useTheme();
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!content.trim()) {
      newErrors.content = 'Comment content is required';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Comment must be at least 10 characters';
    }

    if (!author.trim()) {
      newErrors.author = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (website.trim() && !/^https?:\/\/.+/.test(website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit({
      content: content.trim(),
      author: author.trim(),
      email: email.trim(),
      website: website.trim() || undefined,
    });

    // Clear form if not in reply mode
    if (!replyingTo) {
      setContent('');
      setAuthor('');
      setEmail('');
      setWebsite('');
    }
  };

  return (
    <div className="bg-surface border rounded-xl p-6" 
         style={{ 
           borderColor: themeColors.border,
           backgroundColor: themeColors.surface,
         }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: themeColors.text.primary }}>
          {replyingTo ? `Reply to ${replyingTo}` : 'Leave a Comment'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-background transition-colors"
            style={{ color: themeColors.text.secondary }}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Comment Content */}
        <div>
          <label className="block text-sm font-medium mb-2" 
                 style={{ color: themeColors.text.primary }}>
            Your Comment *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 resize-none"
            style={{
              backgroundColor: themeColors.background,
              borderColor: errors.content ? themeColors.error : themeColors.border,
              color: themeColors.text.primary,
              boxShadow: errors.content ? `0 0 0 2px ${themeColors.error}20` : 'none',
            }}
          />
          {errors.content && (
            <p className="mt-1 text-sm" style={{ color: themeColors.error }}>
              {errors.content}
            </p>
          )}
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1"
                   style={{ color: themeColors.text.primary }}>
              <User className="h-4 w-4" />
              Name *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeColors.background,
                borderColor: errors.author ? themeColors.error : themeColors.border,
                color: themeColors.text.primary,
                boxShadow: errors.author ? `0 0 0 2px ${themeColors.error}20` : 'none',
              }}
            />
            {errors.author && (
              <p className="mt-1 text-sm" style={{ color: themeColors.error }}>
                {errors.author}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1"
                   style={{ color: themeColors.text.primary }}>
              <Mail className="h-4 w-4" />
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeColors.background,
                borderColor: errors.email ? themeColors.error : themeColors.border,
                color: themeColors.text.primary,
                boxShadow: errors.email ? `0 0 0 2px ${themeColors.error}20` : 'none',
              }}
            />
            {errors.email && (
              <p className="mt-1 text-sm" style={{ color: themeColors.error }}>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-1"
                 style={{ color: themeColors.text.primary }}>
            <Globe className="h-4 w-4" />
            Website (optional)
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: themeColors.background,
              borderColor: errors.website ? themeColors.error : themeColors.border,
              color: themeColors.text.primary,
              boxShadow: errors.website ? `0 0 0 2px ${themeColors.error}20` : 'none',
            }}
          />
          {errors.website && (
            <p className="mt-1 text-sm" style={{ color: themeColors.error }}>
              {errors.website}
            </p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="text-sm" style={{ color: themeColors.text.secondary }}>
          <p>
            Your email address will not be published. Required fields are marked *
          </p>
          <p className="mt-1">
            By submitting a comment, you agree to our Community Guidelines.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: themeColors.primary,
              color: themeColors.text.accent,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {replyingTo ? 'Post Reply' : 'Post Comment'}
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{
                backgroundColor: themeColors.surface,
                color: themeColors.text.primary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
