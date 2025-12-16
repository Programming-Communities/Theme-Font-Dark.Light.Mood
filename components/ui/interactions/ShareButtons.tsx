'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsAppIcon,
  RedditIcon,
  TelegramIcon,
  EmailIcon,
  LinkIcon,
  CopyIcon,
  CheckIcon,
} from './ShareIcons';

export interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'rounded' | 'outline';
  color?: 'primary' | 'neutral' | 'brand';
  layout?: 'horizontal' | 'vertical' | 'grid';
  platforms?: SharePlatform[];
  showCounts?: boolean;
  showLabel?: boolean;
  className?: string;
  onShare?: (platform: SharePlatform) => void;
}

export type SharePlatform =
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'whatsapp'
  | 'reddit'
  | 'telegram'
  | 'email'
  | 'copy';

export interface ShareCounts {
  facebook?: number;
  twitter?: number;
  linkedin?: number;
  reddit?: number;
  total?: number;
}

const platformConfig = {
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    icon: FacebookIcon,
    getUrl: (url: string, title?: string, description?: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    icon: TwitterIcon,
    getUrl: (url: string, title?: string, description?: string, hashtags?: string[], via?: string) => {
      const text = title ? encodeURIComponent(title) : '';
      const hashtagsParam = hashtags?.length ? `&hashtags=${hashtags.join(',')}` : '';
      const viaParam = via ? `&via=${via}` : '';
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}${hashtagsParam}${viaParam}`;
    },
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: LinkedinIcon,
    getUrl: (url: string, title?: string, description?: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    name: 'WhatsApp',
    color: '#25D366',
    icon: WhatsAppIcon,
    getUrl: (url: string, title?: string, description?: string) => {
      const text = title ? `${title} ${url}` : url;
      return `https://wa.me/?text=${encodeURIComponent(text)}`;
    },
  },
  reddit: {
    name: 'Reddit',
    color: '#FF4500',
    icon: RedditIcon,
    getUrl: (url: string, title?: string, description?: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '')}`,
  },
  telegram: {
    name: 'Telegram',
    color: '#0088CC',
    icon: TelegramIcon,
    getUrl: (url: string, title?: string, description?: string) => {
      const text = title ? `${title} ${url}` : url;
      return `https://t.me/share/url?url=${encodeURIComponent(text)}`;
    },
  },
  email: {
    name: 'Email',
    color: '#EA4335',
    icon: EmailIcon,
    getUrl: (url: string, title?: string, description?: string) => {
      const subject = title ? encodeURIComponent(title) : '';
      const body = description 
        ? encodeURIComponent(`${description}\n\n${url}`)
        : encodeURIComponent(url);
      return `mailto:?subject=${subject}&body=${body}`;
    },
  },
  copy: {
    name: 'Copy Link',
    color: '#6B7280',
    icon: CopyIcon,
    getUrl: () => '',
  },
};

const sizeClasses = {
  sm: {
    button: 'p-2',
    icon: 'h-4 w-4',
    text: 'text-xs',
  },
  md: {
    button: 'p-3',
    icon: 'h-5 w-5',
    text: 'text-sm',
  },
  lg: {
    button: 'p-4',
    icon: 'h-6 w-6',
    text: 'text-base',
  },
};

const variantClasses = {
  default: '',
  minimal: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  rounded: 'rounded-full',
  outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800',
};

const colorClasses = {
  primary: 'text-primary hover:bg-primary/10',
  neutral: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
  brand: '',
};

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = typeof window !== 'undefined' ? document.title : '',
  description = '',
  hashtags = [],
  via,
  size = 'md',
  variant = 'default',
  color = 'neutral',
  layout = 'horizontal',
  platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'copy'],
  showCounts = false,
  showLabel = false,
  className,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [counts, setCounts] = useState<ShareCounts>({});

  const handleShare = async (platform: SharePlatform) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      const config = platformConfig[platform];
      const shareUrl = config.getUrl(url, title, description, hashtags, via);
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }

    onShare?.(platform);
  };

  // Fetch share counts (would be implemented with an API)
  React.useEffect(() => {
    if (showCounts) {
      // This would be replaced with actual API calls
      // For now, we'll simulate counts
      const simulateCounts = async () => {
        // In a real implementation, you would fetch from:
        // - Facebook Graph API
        // - Twitter API
        // - etc.
        setCounts({
          facebook: Math.floor(Math.random() * 1000),
          twitter: Math.floor(Math.random() * 500),
          total: Math.floor(Math.random() * 2000),
        });
      };
      simulateCounts();
    }
  }, [showCounts, url]);

  const getPlatformCount = (platform: SharePlatform): number | undefined => {
    switch (platform) {
      case 'facebook': return counts.facebook;
      case 'twitter': return counts.twitter;
      case 'linkedin': return counts.linkedin;
      case 'reddit': return counts.reddit;
      default: return undefined;
    }
  };

  const sizeConfig = sizeClasses[size];
  const containerClasses = cn(
    'flex',
    layout === 'horizontal' && 'flex-row items-center space-x-2',
    layout === 'vertical' && 'flex-col items-start space-y-2',
    layout === 'grid' && 'grid grid-cols-4 gap-2',
    className
  );

  return (
    <div className={containerClasses}>
      {platforms.map((platform) => {
        const config = platformConfig[platform];
        const Icon = platform === 'copy' && copied ? CheckIcon : config.icon;
        const count = getPlatformCount(platform);
        const isCopy = platform === 'copy';
        const isBrandColor = color === 'brand';

        const buttonClasses = cn(
          'inline-flex items-center justify-center rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          sizeConfig.button,
          variantClasses[variant],
          !isBrandColor && colorClasses[color],
          isBrandColor && `text-white hover:opacity-90`,
          isCopy && copied && 'text-green-600 dark:text-green-400'
        );

        const buttonStyle = isBrandColor
          ? { backgroundColor: config.color }
          : undefined;

        return (
          <div
            key={platform}
            className={cn(
              'relative',
              layout === 'grid' && 'flex flex-col items-center'
            )}
          >
            <button
              type="button"
              onClick={() => handleShare(platform)}
              className={buttonClasses}
              style={buttonStyle}
              aria-label={`Share on ${config.name}`}
              title={`Share on ${config.name}`}
            >
              <Icon className={sizeConfig.icon} />
              {showLabel && (
                <span className={cn('ml-2', sizeConfig.text)}>
                  {platform === 'copy' && copied ? 'Copied!' : config.name}
                </span>
              )}
            </button>
            {showCounts && count !== undefined && (
              <span
                className={cn(
                  'absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full',
                  isBrandColor
                    ? 'bg-white text-gray-900'
                    : 'bg-primary text-white'
                )}
              >
                {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareProps: Omit<ShareButtonsProps, 'className'>;
  title?: string;
  className?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareProps,
  title = 'Share this content',
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        
        <div
          className={cn(
            'relative z-10 w-full max-w-md rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl',
            className
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share this link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareProps.url || ''}
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareProps.url || '');
                }}
                className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <ShareButtons
              {...shareProps}
              layout="grid"
              size="lg"
              showLabel
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export interface ShareFloatingButtonProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  shareProps: Omit<ShareButtonsProps, 'className'>;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
}

export const ShareFloatingButton: React.FC<ShareFloatingButtonProps> = ({
  position = 'bottom-right',
  shareProps,
  icon,
  label = 'Share',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={cn('fixed z-40', positionClasses[position], className)}>
      {isOpen ? (
        <div className="mb-2 rounded-lg bg-white dark:bg-gray-900 p-4 shadow-lg">
          <ShareButtons {...shareProps} layout="vertical" />
        </div>
      ) : null}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full bg-primary p-4 text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {icon || (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
        {label && (
          <span className="ml-2 font-medium">{label}</span>
        )}
      </button>
    </div>
  );
};

export default ShareButtons;