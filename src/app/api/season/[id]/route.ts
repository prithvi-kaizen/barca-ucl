import { NextResponse } from 'next/server';
import { getSeasonById } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const season = getSeasonById(id);
  if (!season) {
    return NextResponse.json({ error: 'Season not found' }, { status: 404 });
  }
  return NextResponse.json(season);
}
