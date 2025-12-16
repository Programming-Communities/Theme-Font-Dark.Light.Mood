'use client';

import { ReactNode, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  preventScroll?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  preventScroll = true,
}: ModalProps) {
  const { themeColors } = useTheme();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventScroll]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className={`relative w-full ${sizeClasses[size]} rounded-2xl shadow-2xl transition-all duration-300`}
            style={{ 
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b"
                   style={{ borderColor: themeColors.border }}>
                <h2 className="text-xl font-bold" style={{ color: themeColors.text.primary }}>
                  {title}
                </h2>
                
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface transition-colors"
                    style={{ color: themeColors.text.secondary }}
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            {/* Close button when no title */}
            {!title && showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-surface transition-colors z-10"
                style={{ color: themeColors.text.secondary }}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>

            {/* Backdrop click area for mobile */}
            <div 
              className="absolute -inset-4 -z-10 md:hidden"
              onClick={closeOnOverlayClick ? onClose : undefined}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}