// Delad style-konfiguration mellan frontend och backend
export interface StyleConfig {
  medium: string;
  technique: string;
  displayName: string;
  emoji?: string;
}

export const STYLE_CONFIGS: Record<string, StyleConfig> = {
  watercolor: {
    medium: 'watercolor',
    technique: 'Use soft pastel washes and gentle watercolor techniques.',
    displayName: 'Akvarell',
    emoji: '🎨'
  },
  'pencil sketch': {
    medium: 'pencil sketch',
    technique: 'Use delicate graphite strokes and soft shading.',
    displayName: 'Blyerts',
    emoji: '✏️'
  },
  'oil painting': {
    medium: 'oil painting',
    technique: 'Use rich textures and classical painting techniques.',
    displayName: 'Oljemålning',
    emoji: '🖌️'
  },
  'charcoal drawing': {
    medium: 'charcoal drawing',
    technique: 'Use soft charcoal strokes and gentle smudging.',
    displayName: 'Kolritning',
    emoji: '⚫'
  },
  'pastel drawing': {
    medium: 'pastel drawing',
    technique: 'Use soft pastel colors and gentle blending.',
    displayName: 'Pastellritning',
    emoji: '🌈'
  },
  'digital art': {
    medium: 'cartoon-style digital illustration',
    technique: 'Use vibrant colors, playful cartoon aesthetics, and soft cel-shading techniques.',
    displayName: 'Cartoon/Tecknad',
    emoji: '💻'
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
    'Create poster format.',
    'No text.'
  ].join(' ');
};

// Extremt enkla, generiska prompts som borde fungera för alla bilder
// Optimala prompt-kombinationer baserat på test-resultat
const STYLE_OPTIMAL_PROMPTS: Record<string, PromptVariantId[]> = {
  'watercolor': ['simple-style', 'simple-style-v2'],           // Simple Style vinnare
  'pencil sketch': ['style-transfer', 'style-transfer-v2'],    // Style Transfer vinnare
  'oil painting': ['style-transfer-v2', 'style-transfer'],     // Style Transfer v2 bäst
  'charcoal drawing': ['simple-style', 'simple-style-v2'],    // Simple Style vinnare
  'pastel drawing': ['style-transfer', 'style-transfer-v2'],   // Style Transfer vinnare
  'digital art': ['style-transfer-v2', 'style-transfer']     // Style Transfer v2 vinnare för cartoon
};

// Alla tillgängliga prompt-varianter
type PromptVariantId = 'simple-style' | 'simple-style-v2' | 'style-transfer' | 'style-transfer-v2';

const ALL_PROMPT_VARIANTS: Record<PromptVariantId, {
  name: string;
  promptTemplate: (config: StyleConfig) => string;
}> = {
  'simple-style': {
    name: 'Simple Style',
    promptTemplate: (config: StyleConfig) => 
      `Apply ${config.medium} artistic style to this pet portrait. ${config.technique} Capture the animal's personality and distinctive features. Create poster format.`
  },
  'simple-style-v2': {
    name: 'Simple Style v2', 
    promptTemplate: (config: StyleConfig) => 
      `Transform this pet portrait into ${config.medium} art style. ${config.technique} Preserve the animal's unique facial features and expression. Poster format.`
  },
  'style-transfer': {
    name: 'Style Transfer',
    promptTemplate: (config: StyleConfig) => 
      `Convert to ${config.medium} style pet portrait. Use ${config.technique.toLowerCase()} Emphasize breed characteristics and personality. Poster format.`
  },
  'style-transfer-v2': {
    name: 'Style Transfer v2',
    promptTemplate: (config: StyleConfig) => 
      `Apply ${config.medium} artistic rendering to this pet image. ${config.technique} Maintain the pet's individual character and recognizable features. Poster format.`
  }
};

export const generateMemoryPrompts = (style: string) => {
  const config = STYLE_CONFIGS[style] || STYLE_CONFIGS[DEFAULT_STYLE];
  const optimalPrompts = STYLE_OPTIMAL_PROMPTS[style] || ['simple-style', 'style-transfer'];
  
  // Generera bara de 2 bästa promptserna för denna stil
  return optimalPrompts.map(promptId => {
    const variant = ALL_PROMPT_VARIANTS[promptId as PromptVariantId];
    return {
      id: promptId,
      name: variant.name,
      prompt: variant.promptTemplate(config)
    };
  });
};

// Legacy function för att testa alla 4 (för nya stilar som cartoon)
export const generateAllPrompts = (style: string) => {
  const config = STYLE_CONFIGS[style] || STYLE_CONFIGS[DEFAULT_STYLE];
  
  return Object.entries(ALL_PROMPT_VARIANTS).map(([promptId, variant]) => ({
    id: promptId,
    name: variant.name,
    prompt: variant.promptTemplate(config)
  }));
};
