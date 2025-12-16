// File 34: lib/ads/manager.ts
import { AdConfig, AdSlot, AdType, AdSize, AdTargeting } from './types';
import { getAdConfig } from './config';
import { generateAdSlotId, isValidAdSize, formatAdTargeting } from './utils';

/**
 * AdManager: Centralized advertisement management system
 * Handles ad loading, display, refresh, and analytics
 */
export class AdManager {
  private config: AdConfig;
  private loadedAds: Map<string, AdSlot> = new Map();
  private isInitialized: boolean = false;
  private refreshIntervals: Map<string, number> = new Map();

  constructor(config?: Partial<AdConfig>) {
    this.config = { ...getAdConfig(), ...config };
  }

  /**
   * Initialize the ad manager
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized || typeof window === 'undefined') {
      return this.isInitialized;
    }

    try {
      // Load ad scripts dynamically
      await this.loadAdScripts();
      
      // Initialize ad providers
      await this.initializeProviders();
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('AdManager initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize AdManager:', error);
      return false;
    }
  }

  /**
   * Load required ad scripts
   */
  private async loadAdScripts(): Promise<void> {
    const scriptsToLoad = this.config.providers
      .filter(provider => provider.enabled)
      .map(provider => provider.scriptUrl)
      .filter(Boolean);

    const loadPromises = scriptsToLoad.map(url => 
      new Promise<void>((resolve, reject) => {
        if (!url || document.querySelector(`script[src="${url}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
      })
    );

    await Promise.all(loadPromises);
  }

  /**
   * Initialize ad providers
   */
  private async initializeProviders(): Promise<void> {
    // Initialize Google AdSense if enabled
    if (this.config.providers.some(p => p.name === 'google-adsense' && p.enabled)) {
      await this.initializeGoogleAdSense();
    }

    // Initialize custom ad providers
    this.config.providers
      .filter(p => p.name !== 'google-adsense' && p.enabled)
      .forEach(provider => {
        this.initializeCustomProvider(provider);
      });
  }

  /**
   * Initialize Google AdSense
   */
  private async initializeGoogleAdSense(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || (window as any).adsbygoogle) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        // Initialize AdSense
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({
          google_ad_client: this.config.adClientId,
          enable_page_level_ads: this.config.enablePageLevelAds,
          overlays: false
        });
        resolve();
      };

      script.onerror = () => {
        console.warn('Failed to load Google AdSense');
        resolve();
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initialize custom ad provider
   */
  private initializeCustomProvider(provider: any): void {
    console.log(`Initializing custom ad provider: ${provider.name}`);
    // Custom provider initialization logic would go here
  }

  /**
   * Set up event listeners for ad management
   */
  private setupEventListeners(): void {
    // Handle visibility change for ad refresh
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.refreshVisibleAds();
      }
    });

    // Handle route changes for Single Page Applications
    if (typeof window !== 'undefined') {
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = (...args) => {
        originalPushState.apply(window.history, args);
        this.handleRouteChange();
      };

      window.history.replaceState = (...args) => {
        originalReplaceState.apply(window.history, args);
        this.handleRouteChange();
      };

      window.addEventListener('popstate', () => this.handleRouteChange());
    }
  }

  /**
   * Handle route change for ad refresh
   */
  private handleRouteChange(): void {
    setTimeout(() => {
      this.refreshAllAds();
    }, 100);
  }

  /**
   * Display an ad in a specific slot
   */
  async displayAd(
    containerId: string,
    adType: AdType = 'display',
    size: AdSize = 'auto',
    targeting?: AdTargeting
  ): Promise<AdSlot | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Ad container not found: ${containerId}`);
      return null;
    }

    // Clear existing content
    container.innerHTML = '';

    // Generate unique ad slot ID
    const adSlotId = generateAdSlotId(containerId, adType);
    
    // Create ad slot configuration
    const adSlot: AdSlot = {
      id: adSlotId,
      containerId,
      adType,
      size,
      targeting: formatAdTargeting(targeting || {}, this.config.defaultTargeting),
      isLoaded: false,
      impressions: 0,
      clicks: 0
    };

    // Create ad element
    const adElement = this.createAdElement(adSlot);
    container.appendChild(adElement);

    // Load the ad
    await this.loadAd(adSlot, adElement);

    // Store the ad slot
    this.loadedAds.set(adSlotId, adSlot);

    // Set up refresh interval if configured
    if (this.config.refreshInterval > 0) {
      this.setupRefreshInterval(adSlotId);
    }

    return adSlot;
  }

  /**
   * Create ad element based on type
   */
  private createAdElement(adSlot: AdSlot): HTMLElement {
    const adElement = document.createElement('div');
    adElement.id = adSlot.id;
    adElement.className = `ad-slot ad-type-${adSlot.adType}`;

    // Set styles based on ad size
    if (adSlot.size !== 'auto' && isValidAdSize(adSlot.size)) {
      const [width, height] = adSlot.size.split('x').map(Number);
      adElement.style.width = `${width}px`;
      adElement.style.height = `${height}px`;
    } else {
      adElement.style.width = '100%';
      adElement.style.minHeight = '250px';
    }

    // Add data attributes for targeting
    Object.entries(adSlot.targeting).forEach(([key, value]) => {
      adElement.setAttribute(`data-ad-${key}`, String(value));
    });

    // Add loading placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'ad-loading';
    placeholder.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: var(--muted);
        color: var(--muted-foreground);
        font-size: 14px;
      ">
        Loading advertisement...
      </div>
    `;
    adElement.appendChild(placeholder);

    return adElement;
  }

  /**
   * Load ad into element
   */
  private async loadAd(adSlot: AdSlot, adElement: HTMLElement): Promise<void> {
    try {
      // Remove loading placeholder
      const placeholder = adElement.querySelector('.ad-loading');
      if (placeholder) {
        adElement.removeChild(placeholder);
      }

      // Load based on ad type
      switch (adSlot.adType) {
        case 'display':
          await this.loadDisplayAd(adSlot, adElement);
          break;
        case 'banner':
          await this.loadBannerAd(adSlot, adElement);
          break;
        case 'native':
          await this.loadNativeAd(adSlot, adElement);
          break;
        case 'video':
          await this.loadVideoAd(adSlot, adElement);
          break;
        default:
          await this.loadDisplayAd(adSlot, adElement);
      }

      adSlot.isLoaded = true;
      adSlot.impressions++;
      this.trackAdImpression(adSlot);

      // Add click tracking
      adElement.addEventListener('click', () => {
        adSlot.clicks++;
        this.trackAdClick(adSlot);
      });

    } catch (error) {
      console.error(`Failed to load ad ${adSlot.id}:`, error);
      this.showAdFallback(adSlot, adElement);
    }
  }

  /**
   * Load display ad (Google AdSense style)
   */
  private async loadDisplayAd(adSlot: AdSlot, adElement: HTMLElement): Promise<void> {
    if (!this.config.adClientId) {
      throw new Error('Ad client ID not configured');
    }

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    
    // Set ad size
    if (adSlot.size !== 'auto' && isValidAdSize(adSlot.size)) {
      const [width, height] = adSlot.size.split('x').map(Number);
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      ins.style.width = `${width}px`;
      ins.style.height = `${height}px`;
    } else {
      ins.setAttribute('data-ad-format', 'fluid');
      ins.setAttribute('data-ad-layout', 'in-article');
      ins.setAttribute('data-full-width-responsive', 'true');
    }

    // Set targeting parameters
    ins.setAttribute('data-ad-client', this.config.adClientId);
    ins.setAttribute('data-ad-slot', adSlot.id);

    Object.entries(adSlot.targeting).forEach(([key, value]) => {
      ins.setAttribute(`data-ad-${key}`, String(value));
    });

    adElement.appendChild(ins);

    // Push to AdSense
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (error) {
      console.error('Error pushing to adsbygoogle:', error);
    }
  }

  /**
   * Load banner ad
   */
  private async loadBannerAd(adSlot: AdSlot, adElement: HTMLElement): Promise<void> {
    // Custom banner ad implementation
    const bannerAd = document.createElement('div');
    bannerAd.className = 'banner-ad';
    bannerAd.innerHTML = `
      <a href="${this.config.fallbackAd?.link || '#'}" 
         target="_blank" 
         rel="noopener sponsored"
         style="
           display: block;
           width: 100%;
           height: 100%;
           background: var(--card);
           border: 1px solid var(--border);
           border-radius: 8px;
           overflow: hidden;
           text-decoration: none;
           color: inherit;
         ">
        <div style="padding: 16px; text-align: center;">
          <h4 style="margin: 0 0 8px 0; color: var(--primary);">
            ${this.config.fallbackAd?.title || 'Sponsored Content'}
          </h4>
          <p style="margin: 0; font-size: 14px; color: var(--muted-foreground);">
            ${this.config.fallbackAd?.description || 'Advertisement'}
          </p>
        </div>
      </a>
    `;
    adElement.appendChild(bannerAd);
  }

  /**
   * Load native ad
   */
  private async loadNativeAd(adSlot: AdSlot, adElement: HTMLElement): Promise<void> {
    // Native ad implementation
    const nativeAd = document.createElement('div');
    nativeAd.className = 'native-ad';
    nativeAd.innerHTML = `
      <article style="
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px;
        margin: 8px 0;
      ">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <div style="
            width: 60px;
            height: 60px;
            background: var(--primary);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          ">
            Ad
          </div>
          <div style="flex: 1;">
            <h4 style="margin: 0 0 4px 0; color: var(--foreground);">
              ${this.config.fallbackAd?.title || 'Sponsored'}
            </h4>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: var(--muted-foreground);">
              ${this.config.fallbackAd?.description || 'Advertisement content'}
            </p>
            <a href="${this.config.fallbackAd?.link || '#'}" 
               style="
                 color: var(--primary);
                 font-size: 14px;
                 font-weight: 500;
                 text-decoration: none;
               ">
              Learn more →
            </a>
          </div>
        </div>
      </article>
    `;
    adElement.appendChild(nativeAd);
  }

  /**
   * Load video ad
   */
  private async loadVideoAd(adSlot: AdSlot, adElement: HTMLElement): Promise<void> {
    // Video ad implementation
    const videoAd = document.createElement('div');
    videoAd.className = 'video-ad';
    videoAd.innerHTML = `
      <div style="
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px;
        text-align: center;
      ">
        <div style="
          width: 100%;
          height: 180px;
          background: var(--muted);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: var(--muted-foreground);
        ">
          <span>Video Advertisement</span>
        </div>
        <p style="margin: 0; font-size: 14px; color: var(--muted-foreground);">
          Video content would be displayed here
        </p>
      </div>
    `;
    adElement.appendChild(videoAd);
  }

  /**
   * Show fallback ad when primary ad fails
   */
  private showAdFallback(adSlot: AdSlot, adElement: HTMLElement): void {
    if (!this.config.fallbackAd) return;

    adElement.innerHTML = '';
    
    const fallbackAd = document.createElement('div');
    fallbackAd.className = 'fallback-ad';
    fallbackAd.innerHTML = `
      <a href="${this.config.fallbackAd.link}" 
         target="_blank" 
         rel="noopener sponsored"
         style="
           display: block;
           width: 100%;
           height: 100%;
           background: var(--card);
           border: 2px dashed var(--border);
           border-radius: 8px;
           padding: 16px;
           text-align: center;
           text-decoration: none;
           color: inherit;
         ">
        <div style="margin-bottom: 8px;">
          <span style="
            background: var(--primary);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          ">
            Ad
          </span>
        </div>
        <h4 style="margin: 0 0 4px 0; color: var(--primary);">
          ${this.config.fallbackAd.title}
        </h4>
        <p style="margin: 0; font-size: 14px; color: var(--muted-foreground);">
          ${this.config.fallbackAd.description}
        </p>
      </a>
    `;
    
    adElement.appendChild(fallbackAd);
  }

  /**
   * Set up refresh interval for ad slot
   */
  private setupRefreshInterval(adSlotId: string): void {
    if (this.refreshIntervals.has(adSlotId)) {
      clearInterval(this.refreshIntervals.get(adSlotId));
    }

    const interval = setInterval(() => {
      this.refreshAd(adSlotId);
    }, this.config.refreshInterval * 1000);

    this.refreshIntervals.set(adSlotId, interval as any);
  }

  /**
   * Refresh a specific ad
   */
  async refreshAd(adSlotId: string): Promise<void> {
    const adSlot = this.loadedAds.get(adSlotId);
    if (!adSlot || !adSlot.isLoaded) return;

    const container = document.getElementById(adSlot.containerId);
    if (!container) return;

    // Increment refresh count
    adSlot.refreshes = (adSlot.refreshes || 0) + 1;

    // Check if max refreshes reached
    if (this.config.maxRefreshes && adSlot.refreshes >= this.config.maxRefreshes) {
      this.destroyAd(adSlotId);
      return;
    }

    // Destroy and recreate ad
    this.destroyAdElement(adSlotId);
    await this.displayAd(adSlot.containerId, adSlot.adType, adSlot.size, adSlot.targeting);
  }

  /**
   * Refresh all visible ads
   */
  async refreshVisibleAds(): Promise<void> {
    const refreshPromises = Array.from(this.loadedAds.values())
      .filter(adSlot => {
        const element = document.getElementById(adSlot.id);
        return element && this.isElementInViewport(element);
      })
      .map(adSlot => this.refreshAd(adSlot.id));

    await Promise.all(refreshPromises);
  }

  /**
   * Refresh all ads
   */
  async refreshAllAds(): Promise<void> {
    const refreshPromises = Array.from(this.loadedAds.values())
      .map(adSlot => this.refreshAd(adSlot.id));

    await Promise.all(refreshPromises);
  }

  /**
   * Check if element is in viewport
   */
  private isElementInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Destroy ad element
   */
  private destroyAdElement(adSlotId: string): void {
    const element = document.getElementById(adSlotId);
    if (element) {
      element.innerHTML = '';
    }
  }

  /**
   * Destroy ad completely
   */
  destroyAd(adSlotId: string): void {
    this.destroyAdElement(adSlotId);
    
    const interval = this.refreshIntervals.get(adSlotId);
    if (interval) {
      clearInterval(interval);
      this.refreshIntervals.delete(adSlotId);
    }
    
    this.loadedAds.delete(adSlotId);
  }

  /**
   * Destroy all ads
   */
  destroyAllAds(): void {
    Array.from(this.loadedAds.keys()).forEach(adSlotId => {
      this.destroyAd(adSlotId);
    });
    
    this.loadedAds.clear();
    this.refreshIntervals.clear();
  }

  /**
   * Track ad impression
   */
  private trackAdImpression(adSlot: AdSlot): void {
    // Send impression data to analytics
    if (this.config.analyticsEnabled && typeof window !== 'undefined') {
      // Implement analytics tracking here
      console.log('Ad impression tracked:', adSlot.id);
    }
  }

  /**
   * Track ad click
   */
  private trackAdClick(adSlot: AdSlot): void {
    // Send click data to analytics
    if (this.config.analyticsEnabled && typeof window !== 'undefined') {
      // Implement analytics tracking here
      console.log('Ad click tracked:', adSlot.id);
    }
  }

  /**
   * Get ad performance metrics
   */
  getAdMetrics(adSlotId?: string): any {
    if (adSlotId) {
      const adSlot = this.loadedAds.get(adSlotId);
      return adSlot ? {
        impressions: adSlot.impressions,
        clicks: adSlot.clicks,
        ctr: adSlot.impressions > 0 ? (adSlot.clicks / adSlot.impressions) * 100 : 0,
        isLoaded: adSlot.isLoaded,
        refreshes: adSlot.refreshes || 0
      } : null;
    }

    const allAds = Array.from(this.loadedAds.values());
    return {
      totalAds: allAds.length,
      totalImpressions: allAds.reduce((sum, ad) => sum + ad.impressions, 0),
      totalClicks: allAds.reduce((sum, ad) => sum + ad.clicks, 0),
      averageCTR: allAds.length > 0 
        ? (allAds.reduce((sum, ad) => sum + (ad.impressions > 0 ? (ad.clicks / ad.impressions) : 0), 0) / allAds.length) * 100 
        : 0
    };
  }

  /**
   * Update ad targeting
   */
  updateAdTargeting(adSlotId: string, targeting: Partial<AdTargeting>): boolean {
    const adSlot = this.loadedAds.get(adSlotId);
    if (!adSlot) return false;

    adSlot.targeting = { ...adSlot.targeting, ...targeting };
    
    // Update data attributes on the element
    const element = document.getElementById(adSlotId);
    if (element) {
      Object.entries(targeting).forEach(([key, value]) => {
        element.setAttribute(`data-ad-${key}`, String(value));
      });
    }

    return true;
  }

  /**
   * Check if ad blocker is detected
   */
  isAdBlockerDetected(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.width = '1px';
      testAd.style.height = '1px';
      testAd.style.position = 'absolute';
      testAd.style.left = '-1000px';
      testAd.style.top = '-1000px';
      document.body.appendChild(testAd);

      setTimeout(() => {
        const isBlocked = testAd.offsetHeight === 0;
        document.body.removeChild(testAd);
        
        if (isBlocked) {
          console.warn('Ad blocker detected');
        }
      }, 100);

      return false;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
let adManagerInstance: AdManager | null = null;

export function getAdManager(config?: Partial<AdConfig>): AdManager {
  if (!adManagerInstance) {
    adManagerInstance = new AdManager(config);
  }
  return adManagerInstance;
}

export default AdManager;