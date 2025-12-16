// File 52: types/components.d.ts
/**
 * Component type definitions for English Communities PK
 */

import { ReactNode } from 'react';

declare global {
  namespace Components {
    // Base Component Props
    interface BaseProps {
      className?: string;
      style?: React.CSSProperties;
      children?: ReactNode;
    }
    
    // Layout Components
    interface LayoutProps extends BaseProps {
      title?: string;
      description?: string;
      keywords?: string[];
      image?: string;
      type?: 'website' | 'article' | 'profile';
      structuredData?: Record<string, any>;
      canonicalUrl?: string;
      noIndex?: boolean;
      theme?: string;
      font?: string;
      mode?: 'light' | 'dark' | 'auto';
    }
    
    interface HeaderProps extends BaseProps {
      transparent?: boolean;
      sticky?: boolean;
      showSearch?: boolean;
      showAuth?: boolean;
      showThemeToggle?: boolean;
    }
    
    interface FooterProps extends BaseProps {
      showNewsletter?: boolean;
      showSocial?: boolean;
      showLinks?: boolean;
      showCopyright?: boolean;
    }
    
    // Navigation Components
    interface NavItem {
      id: string;
      label: string;
      href: string;
      icon?: ReactNode;
      children?: NavItem[];
      isActive?: boolean;
      isExternal?: boolean;
      badge?: string;
      roles?: string[];
    }
    
    interface NavigationProps extends BaseProps {
      items: NavItem[];
      orientation?: 'horizontal' | 'vertical';
      depth?: number;
      onItemClick?: (item: NavItem) => void;
    }
    
    // Card Components
    interface CardProps extends BaseProps {
      variant?: 'default' | 'outlined' | 'elevated' | 'interactive';
      hoverable?: boolean;
      padding?: 'none' | 'sm' | 'md' | 'lg';
      borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
      shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    }
    
    interface PostCardProps extends CardProps {
      post: WordPress.Post;
      layout?: 'horizontal' | 'vertical' | 'compact';
      showExcerpt?: boolean;
      showMeta?: boolean;
      showCategory?: boolean;
      showAuthor?: boolean;
      showDate?: boolean;
      showReadTime?: boolean;
      imageSize?: 'thumbnail' | 'medium' | 'large' | 'full';
    }
    
    // Button Components
    interface ButtonProps extends BaseProps {
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      loading?: boolean;
      disabled?: boolean;
      fullWidth?: boolean;
      leftIcon?: ReactNode;
      rightIcon?: ReactNode;
      onClick?: () => void;
      type?: 'button' | 'submit' | 'reset';
      href?: string;
    }
    
    // Form Components
    interface FormFieldProps extends BaseProps {
      label?: string;
      name: string;
      type?: string;
      placeholder?: string;
      value?: any;
      defaultValue?: any;
      error?: string;
      required?: boolean;
      disabled?: boolean;
      readOnly?: boolean;
      helperText?: string;
      prefix?: ReactNode;
      suffix?: ReactNode;
      onChange?: (value: any) => void;
      onBlur?: () => void;
      onFocus?: () => void;
    }
    
    // Modal Components
    interface ModalProps extends BaseProps {
      isOpen: boolean;
      onClose: () => void;
      title?: string;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
      closeOnOverlayClick?: boolean;
      showCloseButton?: boolean;
      preventScroll?: boolean;
    }
    
    // Tabs Components
    interface TabItem {
      id: string;
      label: string;
      content: ReactNode;
      icon?: ReactNode;
      disabled?: boolean;
    }
    
    interface TabsProps extends BaseProps {
      tabs: TabItem[];
      defaultTab?: string;
      variant?: 'default' | 'pills' | 'underline';
      orientation?: 'horizontal' | 'vertical';
      onChange?: (tabId: string) => void;
    }
    
    // Accordion Components
    interface AccordionItem {
      id: string;
      title: string;
      content: ReactNode;
      isOpen?: boolean;
      disabled?: boolean;
    }
    
    interface AccordionProps extends BaseProps {
      items: AccordionItem[];
      allowMultiple?: boolean;
      variant?: 'default' | 'bordered' | 'ghost';
      onChange?: (openItems: string[]) => void;
    }
    
    // Breadcrumb Components
    interface BreadcrumbItem {
      label: string;
      href?: string;
      isCurrent?: boolean;
    }
    
    interface BreadcrumbProps extends BaseProps {
      items: BreadcrumbItem[];
      separator?: ReactNode;
      showHome?: boolean;
    }
    
    // Pagination Components
    interface PaginationProps extends BaseProps {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      onPageChange: (page: number) => void;
      showNumbers?: boolean;
      showFirstLast?: boolean;
      showPrevNext?: boolean;
      siblingCount?: number;
      boundaryCount?: number;
    }
    
    // Alert Components
    interface AlertProps extends BaseProps {
      variant?: 'info' | 'success' | 'warning' | 'error';
      title?: string;
      showIcon?: boolean;
      closable?: boolean;
      onClose?: () => void;
    }
    
    // Badge Components
    interface BadgeProps extends BaseProps {
      variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
      size?: 'sm' | 'md' | 'lg';
      dot?: boolean;
      max?: number;
      value?: number | string;
    }
    
    // Avatar Components
    interface AvatarProps extends BaseProps {
      src?: string;
      alt?: string;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
      shape?: 'circle' | 'square' | 'rounded';
      fallback?: string;
      online?: boolean;
    }
    
    // Skeleton Components
    interface SkeletonProps extends BaseProps {
      variant?: 'text' | 'circle' | 'rect';
      width?: number | string;
      height?: number | string;
      animation?: 'pulse' | 'wave' | 'none';
      count?: number;
    }
    
    // Tooltip Components
    interface TooltipProps extends BaseProps {
      content: ReactNode;
      placement?: 'top' | 'bottom' | 'left' | 'right';
      delay?: number;
      disabled?: boolean;
      interactive?: boolean;
    }
    
    // Popover Components
    interface PopoverProps extends BaseProps {
      trigger: ReactNode;
      content: ReactNode;
      placement?: 'top' | 'bottom' | 'left' | 'right';
      triggerType?: 'click' | 'hover';
      closeOnClickOutside?: boolean;
      arrow?: boolean;
    }
    
    // Dropdown Components
    interface DropdownItem {
      id: string;
      label: string;
      icon?: ReactNode;
      href?: string;
      onClick?: () => void;
      disabled?: boolean;
      divider?: boolean;
      children?: DropdownItem[];
    }
    
    interface DropdownProps extends BaseProps {
      trigger: ReactNode;
      items: DropdownItem[];
      placement?: 'top' | 'bottom' | 'left' | 'right';
      triggerType?: 'click' | 'hover';
      closeOnClick?: boolean;
    }
    
    // Progress Components
    interface ProgressProps extends BaseProps {
      value: number;
      max?: number;
      variant?: 'default' | 'success' | 'warning' | 'error';
      size?: 'sm' | 'md' | 'lg';
      showLabel?: boolean;
      isIndeterminate?: boolean;
    }
    
    // Rating Components
    interface RatingProps extends BaseProps {
      value: number;
      max?: number;
      size?: 'sm' | 'md' | 'lg';
      readOnly?: boolean;
      halfFill?: boolean;
      onChange?: (value: number) => void;
    }
    
    // Toast Components
    interface ToastProps extends BaseProps {
      id: string;
      title: string;
      description?: string;
      variant?: 'info' | 'success' | 'warning' | 'error';
      duration?: number;
      position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
      closable?: boolean;
      onClose?: () => void;
    }
  }
}

export {};