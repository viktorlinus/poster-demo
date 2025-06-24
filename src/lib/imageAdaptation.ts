// lib/imageAdaptation.ts
export type AdaptationMode = 'crop' | 'letterbox';

export interface AdaptationResult {
  canvasWidth: number;
  canvasHeight: number;
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
  backgroundColor: string;
}

export const calculateImageAdaptation = (
  originalWidth: number,
  originalHeight: number,
  targetWidth: number, 
  targetHeight: number,
  mode: AdaptationMode
): AdaptationResult => {
  
  const originalRatio = originalWidth / originalHeight;
  const targetRatio = targetWidth / targetHeight;
  
  let result: AdaptationResult;
  
  if (mode === 'crop') {
    // Fyll hela canvas, beskär från original
    if (originalRatio > targetRatio) {
      // Original är bredare - beskär från sidorna
      const scaledHeight = targetHeight;
      const scaledWidth = scaledHeight * originalRatio;
      result = {
        canvasWidth: targetWidth,
        canvasHeight: targetHeight,
        imageX: -(scaledWidth - targetWidth) / 2,
        imageY: 0,
        imageWidth: scaledWidth,
        imageHeight: scaledHeight,
        backgroundColor: 'transparent'
      };
    } else {
      // Original är högre - beskär från topp/botten  
      const scaledWidth = targetWidth;
      const scaledHeight = scaledWidth / originalRatio;
      result = {
        canvasWidth: targetWidth,
        canvasHeight: targetHeight,
        imageX: 0,
        imageY: -(scaledHeight - targetHeight) / 2,
        imageWidth: scaledWidth,
        imageHeight: scaledHeight,
        backgroundColor: 'transparent'
      };
    }
  } else {
    // Letterbox - bevara hela bilden, lägg till marginaler
    if (originalRatio > targetRatio) {
      // Anpassa till målens bredd
      const scaledWidth = targetWidth;
      const scaledHeight = scaledWidth / originalRatio;
      result = {
        canvasWidth: targetWidth,
        canvasHeight: targetHeight,
        imageX: 0,
        imageY: (targetHeight - scaledHeight) / 2,
        imageWidth: scaledWidth,
        imageHeight: scaledHeight,
        backgroundColor: '#ffffff'
      };
    } else {
      // Anpassa till målens höjd
      const scaledHeight = targetHeight;
      const scaledWidth = scaledHeight * originalRatio;
      result = {
        canvasWidth: targetWidth,
        canvasHeight: targetHeight,
        imageX: (targetWidth - scaledWidth) / 2,
        imageY: 0,
        imageWidth: scaledWidth,
        imageHeight: scaledHeight,
        backgroundColor: '#ffffff'
      };
    }
  }
  
  return result;
};

export const getOptimalUpscaleFactor = (format: { dimensions: { width: number } }): number => {
  // Baserat på DPI-krav för bra print-kvalitet (100+ DPI)
  const targetDPI = 120;
  const widthInInches = format.dimensions.width / 2.54; // cm till inches
  const requiredWidth = widthInInches * targetDPI;
  const baseWidth = 1024; // Original AI-bild bredd
  
  const calculatedFactor = Math.ceil(requiredWidth / baseWidth);
  
  // Begränsa till praktiska värden
  return Math.min(Math.max(calculatedFactor, 4), 8);
};
