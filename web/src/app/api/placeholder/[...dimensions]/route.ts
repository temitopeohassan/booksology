import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

export async function GET(
  request: NextRequest,
  { params }: { params: { dimensions: string[] } }
) {
  const [width, height] = params.dimensions.map(Number);

  if (!width || !height || isNaN(width) || isNaN(height)) {
    return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 });
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.max(width, height) / 10}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${width}x${height}`, width / 2, height / 2);

  // Convert canvas to buffer
  const buffer = await canvas.toBuffer('image/png');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
