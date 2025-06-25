// Global gtag types for Google Analytics
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        transaction_id?: string;
        currency?: string;
        items?: Array<{
          item_id: string;
          item_name: string;
          category: string;
          quantity: number;
          price: number;
        }>;
        anonymize_ip?: boolean;
        allow_google_signals?: boolean;
        allow_ad_personalization_signals?: boolean;
      }
    ) => void;
    dataLayer: any[];
  }
}

export {};