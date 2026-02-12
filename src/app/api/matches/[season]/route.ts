import { NextResponse } from 'next/server';
import { getSeasonById } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ season: string }> }
) {
  const { season: seasonId } = await params;
  const season = getSeasonById(seasonId);
  if (!season) {
    return NextResponse.json({ error: 'Season not found' }, { status: 404 });
  }
  return NextResponse.json(season.matches);
}
