import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';          // körs som Node (inte Edge)
export const maxDuration = 10;          // s (Hobby = 10, Pro = 60)

const REPLICATE = 'https://api.replicate.com/v1/predictions';
const VERSION =
  'c15c48c0e85a93f3d4e283ac6ca684ce180d94d1975783663c747e7bfa6f5e5c';
const TOKEN = process.env.REPLICATE_API_TOKEN!;

/* -------- POST /api/upscale  --------
   Skapa prediction och returnera ID  */
export async function POST(req: NextRequest) {
  const { imageUrl, scale = 4 } = await req.json();

  if (!imageUrl)
    return NextResponse.json({ error: 'No image URL' }, { status: 400 });

  const res = await fetch(REPLICATE, {
    method: 'POST',
    headers: {
      Authorization: `Token ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: VERSION,
      input: { image: imageUrl, scale },
    }),
  });

  if (!res.ok)
    return NextResponse.json({ error: await res.text() }, { status: 502 });

  const prediction = await res.json();
  return NextResponse.json({ id: prediction.id, status: prediction.status });
}

/* -------- GET /api/upscale?id=xxx --------
   Klienten pollar status                */
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id)
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const res = await fetch(`${REPLICATE}/${id}`, {
    headers: { Authorization: `Token ${TOKEN}` },
  });

  if (!res.ok)
    return NextResponse.json({ error: await res.text() }, { status: 502 });

  const data = await res.json();
  return NextResponse.json(data);
}
