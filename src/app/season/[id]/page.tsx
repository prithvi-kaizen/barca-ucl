import { getSeasonById, getAllSeasons } from '@/lib/data';
import { notFound } from 'next/navigation';
import SeasonDetailClient from './SeasonDetailClient';

export function generateStaticParams() {
  const seasons = getAllSeasons();
  return seasons.map((s) => ({ id: s.id }));
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const season = getSeasonById(id);

  if (!season) {
    notFound();
  }

  return <SeasonDetailClient season={season} />;
}
