// Google Analytics 4 configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  }
};

// Track events
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
    event({
      action: 'ai_generation_started',
      category: 'engagement',
      label: style,
    });
  },

  // AI Generation completed
  aiGenerationCompleted: (style: string, timeSpent: number) => {
    event({
      action: 'ai_generation_completed',
      category: 'engagement',
      label: style,
      value: timeSpent,
    });
  },

  // Text editor opened
  textEditorOpened: () => {
    event({
      action: 'text_editor_opened',
      category: 'engagement',
    });
  },

  // Pricing viewed
  pricingViewed: (tier: string) => {
    event({
      action: 'pricing_viewed',
      category: 'conversion',
      label: tier,
    });
  },

  // Checkout started
  checkoutStarted: (tier: string, value: number) => {
    event({
      action: 'begin_checkout',
      category: 'conversion',
      label: tier,
      value: value,
    });
  },

  // Order completed
  orderCompleted: (orderId: string, tier: string, value: number, style: string) => {
    // Standard purchase event
    purchase({
      transactionId: orderId,
      value: value / 100, // Convert from öre to kronor
      items: [{
        item_id: orderId,
        item_name: `${tier} Poster - ${style}`,
        category: tier,
        quantity: 1,
        price: value / 100,
      }],
    });

    // Additional business event
    event({
      action: 'order_completed',
      category: 'conversion',
      label: `${tier}_${style}`,
      value: value,
    });
  },
};