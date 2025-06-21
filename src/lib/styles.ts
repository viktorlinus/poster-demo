// Delad style-konfiguration mellan frontend och backend
export interface StyleConfig {
  medium: string;
  technique: string;
  displayName: string;
}

export const STYLE_CONFIGS: Record<string, StyleConfig> = {
  watercolor: {
    medium: 'watercolor',
    technique: 'Use soft pastel washes and gentle watercolor techniques.',
    displayName: 'Akvarell'
  },
  'pencil sketch': {
    medium: 'pencil sketch',
    technique: 'Use delicate graphite strokes and soft shading.',
    displayName: 'Blyerts'
  },
  'oil painting': {
    medium: 'oil painting',
    technique: 'Use rich textures and classical painting techniques.',
    displayName: 'Oljemålning'
  },
  'charcoal drawing': {
    medium: 'charcoal drawing',
    technique: 'Use soft charcoal strokes and gentle smudging.',
    displayName: 'Kolritning'
  },
  'pastel drawing': {
    medium: 'pastel drawing',
    technique: 'Use soft pastel colors and gentle blending.',
    displayName: 'Pastellritning'
  },
  'digital art': {
    medium: 'digital art',
    technique: 'Use modern digital painting techniques with soft gradients.',
    displayName: 'Digital konst'
  },
  'vintage photography': {
    medium: 'vintage-style photographic',
    technique: 'Apply sepia tones and classic photography aesthetics.',
    displayName: 'Vintage fotografi'
  }
};

export const DEFAULT_STYLE = 'watercolor';

// Hjälpfunktioner
export const getAvailableStyles = (): string[] => Object.keys(STYLE_CONFIGS);

export const isValidStyle = (style: string): boolean => style in STYLE_CONFIGS;

export const getStyleDisplayName = (style: string): string => {
  return STYLE_CONFIGS[style]?.displayName || STYLE_CONFIGS[DEFAULT_STYLE].displayName;
};

export const generateStylePrompt = (style: string): string => {
  const config = STYLE_CONFIGS[style] || STYLE_CONFIGS[DEFAULT_STYLE];
  
  return [
    `Render this image in ${config.medium} style`,
    'while preserving the exact composition, features, and details from the original.',
    `Use ${config.technique.toLowerCase()}`,
    'for artistic enhancement without changing any visual elements.',
    'Format as poster with white margins and leave space at the bottom for text.',
    'Do not add any text to the image.'
  ].join(' ');
};
