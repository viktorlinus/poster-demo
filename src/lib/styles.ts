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

// Nya förbättrade prompts baserat på v2+v4 combo + nya ord
export const generateMemoryPrompts = (style: string) => {
  const config = STYLE_CONFIGS[style] || STYLE_CONFIGS[DEFAULT_STYLE];
  
  return [
    {
      id: 'combo-v5',
      name: 'Combo v5 - Best of v2+v4',
      prompt: [
        `Create a ${config.medium} tribute portrait maintaining every detail and recognizable traits of this beloved subject.`,
        'Keep all original elements intact while honoring their distinctive appearance and natural essence.',
        `Apply ${config.technique.toLowerCase()} for enhancement only, not alteration,`,
        'preserving the authentic look and personality.',
        'Format as poster with white margins and text space.',
        'Do not add any text to the image.'
      ].join(' ')
    },
    {
      id: 'artistic-portrait',
      name: 'Artistic Portrait',
      prompt: [
        `Render this portrait in ${config.medium} artistic style while maintaining exact facial characteristics.`,
        'Preserve the subject\'s natural features and distinctive traits.',
        `Use ${config.technique.toLowerCase()} to enhance without changing core appearance.`,
        'Keep authentic details and recognizable qualities intact.',
        'Create poster format with margins and space for text.',
        'Do not include any text.'
      ].join(' ')
    },
    {
      id: 'commemorative',
      name: 'Commemorative Artwork',
      prompt: [
        `Transform this portrait into commemorative ${config.medium} artwork preserving all identifying features.`,
        'Maintain the subject\'s unique characteristics and natural appearance.',
        `Apply ${config.technique.toLowerCase()} while keeping original details unchanged.`,
        'Honor their authentic look and distinctive qualities.',
        'Format with white borders and bottom text area.',
        'No text should be added.'
      ].join(' ')
    },
    {
      id: 'keepsake',
      name: 'Keepsake Portrait',
      prompt: [
        `Create a ${config.medium} keepsake portrait capturing every detail of this cherished subject.`,
        'Preserve their recognizable features and natural essence completely.',
        `Use ${config.technique.toLowerCase()} for artistic enhancement without altering identity.`,
        'Maintain authentic appearance and distinctive characteristics.',
        'Design as poster with white margins and text space.',
        'Do not add text to the image.'
      ].join(' ')
    }
  ];
};
