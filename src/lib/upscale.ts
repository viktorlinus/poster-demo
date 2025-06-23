// lib/upscale.ts
/**
 * Skicka in bild-URL och få tillbaka upscaled URL.
 * Klienten pollar /api/upscale tills status = "succeeded".
 */
export async function upscaleImage(imageUrl: string, scale = 4) {
  // 1) Starta prediction
  const start = await fetch('/api/upscale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, scale }),
  });

  if (!start.ok) throw new Error(await start.text());
  const { id } = await start.json();

  // 2) Polla status
  let tries = 0;
  while (tries < 120) {           // max ~2 min
    await new Promise(r => setTimeout(r, 1000));
    const res = await fetch(`/api/upscale?id=${id}`);
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    if (data.status === 'succeeded') return data.output as string;
    if (data.status === 'failed') throw new Error('Upscaling failed');
    tries++;
  }
  throw new Error('Upscaling timeout on client');
}
