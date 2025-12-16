interface WindowWithAnalytics extends Window {
  dataLayer?: any[];
  gtag?: (...args: any[]) => void;
  fbq?: (...args: any[]) => void;
}

export class AnalyticsManager {
  private isInitialized = false;

  // Initialize analytics
  init(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    const win = window as WindowWithAnalytics;

    // Google Analytics
    if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
      this.initGoogleAnalytics(win);
    }

    // Facebook Pixel
    if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
      this.initFacebookPixel(win);
    }

    this.isInitialized = true;
  }

  // Google Analytics
  private initGoogleAnalytics(win: WindowWithAnalytics): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`;
    document.head.appendChild(script);

    win.dataLayer = win.dataLayer || [];
    win.gtag = function gtag() {
      win.dataLayer!.push(arguments);
    };
    win.gtag!('js', new Date());
    win.gtag!('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID!);
  }

  // Facebook Pixel
  private initFacebookPixel(win: WindowWithAnalytics): void {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f.fbq)f.fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1" />`;
    document.body.appendChild(noscript);
  }

  // Track page view
  trackPageView(path: string, title: string): void {
    const win = window as WindowWithAnalytics;
    
    // Google Analytics
    if (win.gtag) {
      win.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID!, {
        page_path: path,
        page_title: title,
      });
    }

    // Facebook Pixel
    if (win.fbq) {
      win.fbq('track', 'PageView');
    }

    // Custom event
    this.trackEvent('page_view', { path, title });
  }

  // Track custom event
  trackEvent(eventName: string, eventParams?: Record<string, any>): void {
    const win = window as WindowWithAnalytics;
    
    // Google Analytics
    if (win.gtag) {
      win.gtag('event', eventName, eventParams);
    }

    // Facebook Pixel
    if (win.fbq && eventParams) {
      win.fbq('track', eventName, eventParams);
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Event: ${eventName}`, eventParams);
    }
  }

  // Track user engagement
  trackEngagement(type: string, data?: Record<string, any>): void {
    this.trackEvent(`engagement_${type}`, data);
  }

  // Track post interactions
  trackPostInteraction(action: string, postId: number, postTitle: string): void {
    this.trackEvent(`post_${action}`, {
      post_id: postId,
      post_title: postTitle,
      timestamp: new Date().toISOString(),
    });
  }

  // Track comment interactions
  trackCommentInteraction(action: string, commentId: number, postId: number): void {
    this.trackEvent(`comment_${action}`, {
      comment_id: commentId,
      post_id: postId,
      timestamp: new Date().toISOString(),
    });
  }

  // Track search
  trackSearch(query: string, resultsCount: number): void {
    this.trackEvent('search', {
      search_query: query,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
    });
  }

  // Track reaction
  trackReaction(reactionType: string, postId: number, action: 'add' | 'remove'): void {
    this.trackEvent('reaction', {
      reaction_type: reactionType,
      post_id: postId,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  // Track ad click
  trackAdClick(adPosition: string, adType: string): void {
    this.trackEvent('ad_click', {
      ad_position: adPosition,
      ad_type: adType,
      timestamp: new Date().toISOString(),
    });
  }

  // Track theme change
  trackThemeChange(theme: string, mode: 'light' | 'dark'): void {
    this.trackEvent('theme_change', {
      theme,
      mode,
      timestamp: new Date().toISOString(),
    });
  }

  // Track font change
  trackFontChange(font: string): void {
    this.trackEvent('font_change', {
      font,
      timestamp: new Date().toISOString(),
    });
  }

  // Track error
  trackError(error: Error, context?: string): void {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Get user ID (for authenticated users)
  setUserId(userId: string): void {
    const win = window as WindowWithAnalytics;
    if (win.gtag) {
      win.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID!, {
        user_id: userId,
      });
    }
  }

  // Clear user ID (on logout)
  clearUserId(): void {
    const win = window as WindowWithAnalytics;
    if (win.gtag) {
      win.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID!, {
        user_id: null,
      });
    }
  }
}

// Singleton instance
export const analyticsManager = new AnalyticsManager();