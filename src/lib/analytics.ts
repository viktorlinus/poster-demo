// Google Analytics 4 configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Meta Pixel configuration
export const META_PIXEL_ID = '2123196551511928';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  }
};

// Google Analytics 4 E-commerce events
export const gaEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Meta Pixel events
export const fbEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Legacy event function (keeping for backwards compatibility)
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// E-commerce events for conversion tracking
export const purchase = ({
  transactionId,
  value,
  currency = 'SEK',
  items,
}: {
  transactionId: string;
  value: number;
  currency?: string;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }
};

// Key business events
export const businessEvents = {
  // AI Generation started
  aiGenerationStarted: (style: string) => {
    // GA4 Standard E-commerce Event
    gaEvent('view_item', {
      currency: 'SEK',
      value: 299, // Base price
      items: [{
        item_id: `ai_generation_${style}`,
        item_name: `AI Poster - ${style}`,
        item_category: 'AI Generation',
        item_variant: style,
        price: 299,
        quantity: 1
      }]
    });
    
    // Meta Pixel
    fbEvent('ViewContent', {
      content_type: 'product',
      content_category: 'AI Generation',
      content_name: style
    });
  },

  // AI Generation completed
  aiGenerationCompleted: (style: string, timeSpent: number) => {
    // GA4 Custom Event
    gaEvent('ai_generation_completed', {
      item_name: `AI Poster - ${style}`,
      item_category: 'AI Generation',
      engagement_time_msec: timeSpent * 1000
    });
  },

  // Text editor opened
  textEditorOpened: () => {
    // GA4 Engagement Event
    gaEvent('text_editor_opened', {
      engagement_time_msec: 1000 // Base engagement
    });
  },

  // Pricing viewed
  pricingViewed: (tier: string) => {
    // GA4 Standard E-commerce Event
    gaEvent('view_item_list', {
      item_list_id: 'pricing_tiers',
      item_list_name: 'Pricing Options',
      items: [{
        item_id: tier,
        item_name: `${tier} Poster`,
        item_category: 'Poster',
        item_variant: tier,
        price: tier === 'Digital' ? 79 : tier === 'Print' ? 299 : 399,
        quantity: 1
      }]
    });
  },

  // Checkout started
  checkoutStarted: (tier: string, value: number) => {
    // GA4 Standard E-commerce Event
    gaEvent('begin_checkout', {
      currency: 'SEK',
      value: value / 100,
      items: [{
        item_id: `poster_${tier.toLowerCase()}`,
        item_name: `${tier} Poster`,
        item_category: 'Poster',
        item_variant: tier,
        price: value / 100,
        quantity: 1
      }]
    });
    
    // Meta Pixel
    fbEvent('InitiateCheckout', {
      content_name: tier,
      value: value / 100,
      currency: 'SEK'
    });
  },

  // Order completed
  orderCompleted: (orderId: string, tier: string, value: number, style: string) => {
    // GA4 Standard E-commerce Purchase Event
    gaEvent('purchase', {
      transaction_id: orderId,
      value: value / 100,
      currency: 'SEK',
      items: [{
        item_id: `poster_${tier.toLowerCase()}`,
        item_name: `${tier} Poster - ${style}`,
        item_category: 'Poster',
        item_variant: tier,
        item_brand: 'PetMemories',
        price: value / 100,
        quantity: 1
      }]
    });

    // Meta Pixel Purchase event
    fbEvent('Purchase', {
      value: value / 100,
      currency: 'SEK',
      content_name: `${tier} Poster - ${style}`,
      content_category: tier,
      content_ids: [orderId],
      num_items: 1
    });
  },
};