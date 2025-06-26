'use client';
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isTranslationError: boolean;
  errorMessage: string;
}

class TranslationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isTranslationError: false,
      errorMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Kontrollera om felet är översättningsrelaterat
    const isTranslationError = 
      error.message.includes('removeChild') ||
      error.message.includes('not a child of this node') ||
      error.message.includes('Cannot read properties of null') ||
      error.stack?.includes('translate') ||
      false;

    return {
      hasError: true,
      isTranslationError,
      errorMessage: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by TranslationErrorBoundary:', error, errorInfo);
    
    // Logga översättningsfel specifikt
    if (this.state.isTranslationError) {
      console.warn('Translation conflict detected. This usually happens when browser auto-translate interferes with React DOM manipulation.');
    }
  }

  handleReload = () => {
    // Reload utan cache för att återställa ren DOM
    window.location.reload();
  };

  handleDisableTranslation = () => {
    // Försök att stänga av Google Translate om möjligt
    try {
      // Kolla om Google Translate element finns
      const googleTranslateElement = document.querySelector('.goog-te-banner-frame');
      if (googleTranslateElement) {
        // Försök stänga translate-widget
        const closeButton = document.querySelector('.goog-te-banner .goog-te-banner-close');
        if (closeButton) {
          (closeButton as HTMLElement).click();
        }
      }
      
      // Reload sidan efter kort delay
      setTimeout(() => {
        this.handleReload();
      }, 500);
    } catch (error) {
      console.error('Could not disable translation:', error);
      this.handleReload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.state.isTranslationError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Översättningskonflikt upptäckt
              </h2>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Det verkar som att din webbläsare har översatt sidan automatiskt, vilket orsakar tekniska problem. 
                För bästa upplevelse rekommenderar vi att du:
              </p>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={this.handleDisableTranslation}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Stäng av översättning och ladda om
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                >
                  Ladda om sidan
                </button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Tips:</strong> Stäng av automatisk översättning i webbläsarinställningarna för petmemories.se
                </p>
              </div>
            </div>
          </div>
        );
      }
      
      // Annat fel - visa generisk error
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Något gick fel
            </h2>
            
            <p className="text-gray-600 mb-6 text-sm">
              Ett oväntat fel inträffade. Försök ladda om sidan.
            </p>
            
            <button
              onClick={this.handleReload}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Ladda om sidan
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">Teknisk information</summary>
                <pre className="text-xs text-gray-600 mt-2 bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.errorMessage}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TranslationErrorBoundary;