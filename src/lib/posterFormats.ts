// lib/posterFormats.ts
export interface PosterFormat {
  id: string;
  label: string;
  dimensions: { width: number; height: number }; // cm
  aspectRatio: number;
  pixelDimensions: { width: number; height: number }; // för canvas
  popular?: boolean;
  ikea?: boolean;
  priceModifier?: number; // Prisjustering från basepris
}

export const POSTER_FORMATS: PosterFormat[] = [
  {
    id: '30x45',
    label: '30×45 cm - Perfekt passform',
    dimensions: { width: 30, height: 45 },
    aspectRatio: 2/3,
    pixelDimensions: { width: 1024, height: 1536 } // Original AI ratio
  },
  {
    id: '40x50', 
    label: '40×50 cm - IKEA standard ⭐',
    dimensions: { width: 40, height: 50 },
    aspectRatio: 4/5,
    pixelDimensions: { width: 1024, height: 1280 },
    popular: true,
    ikea: true,
    priceModifier: 20
  },
  {
    id: '50x70',
    label: '50×70 cm - IKEA väggkonst',
    dimensions: { width: 50, height: 70 },
    aspectRatio: 5/7, 
    pixelDimensions: { width: 1024, height: 1434 },
    ikea: true,
    priceModifier: 50
  },
  {
    id: 'A2',
    label: 'A2 (42×59 cm) - Standard A-format',
    dimensions: { width: 42, height: 59.4 },
    aspectRatio: 42/59.4,
    pixelDimensions: { width: 1024, height: 1448 },
    priceModifier: 30
  }
];

export const getDefaultFormat = (): PosterFormat => {
  return POSTER_FORMATS.find(f => f.id === '30x45') || POSTER_FORMATS[0];
};

export const getFormatById = (id: string): PosterFormat | undefined => {
  return POSTER_FORMATS.find(f => f.id === id);
};
