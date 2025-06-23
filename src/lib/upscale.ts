// ESRGAN Upscaling Implementation
// Alternativ till OpenAI medium/high quality

export async function upscaleImage(imageUrl: string, scale: number = 4): Promise<string> {
  try {
    // Replicate ESRGAN (billigast)
    const response = await fetch('/api/upscale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        scale
      })
    });

    if (!response.ok) {
      throw new Error(`Upscaling failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result.upscaledUrl;
  } catch (error) {
    console.error('Upscaling error:', error);
    throw error;
  }
}

// Kostnad: ~$0.01 per upscaling (vs $0.035+ för OpenAI medium)
