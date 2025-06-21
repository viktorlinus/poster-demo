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
    `Apply ${config.medium} artistic style to this pet portrait.`,
    `${config.technique}`,
    'Capture the animal\'s personality and distinctive features.',
    'Create poster format with white borders and keep bottom 20% empty for text.',
    'No text.'
  ].join(' ');
};

// Extremt enkla, generiska prompts som borde fungera för alla bilder
export const generateMemoryPrompts = (style: string) => {
  const config = STYLE_CONFIGS[style] || STYLE_CONFIGS[DEFAULT_STYLE];
  
  return [
    {
      id: 'simple-style',
      name: 'Simple Style',
      prompt: `Apply ${config.medium} artistic style to this pet portrait. ${config.technique} Capture the animal's personality and distinctive features. Create poster format with white borders and keep bottom 20% empty for text.`
    },
    {
      id: 'artistic-version',
      name: 'Artistic Version', 
      prompt: `Transform into ${config.medium} pet artwork using ${config.technique.toLowerCase()} Show the animal's character and unique markings. Format as poster with margins and bottom 20% reserved for text.`
    },
    {
      id: 'style-transfer',
      name: 'Style Transfer',
      prompt: `Convert to ${config.medium} style pet portrait. Use ${config.technique.toLowerCase()} Emphasize breed characteristics and personality. Poster layout with white borders and empty bottom 20% for text.`
    },
    {
      id: 'pet-memories',
      name: 'Pet Memories',
      prompt: `Create ${config.medium} memorial portrait of this beloved pet. ${config.technique} Honor their unique features and loving spirit. Format with bottom 20% kept empty for memorial text.`
    }
  ];
};
