import { NextResponse } from 'next/server';
import { getAllSeasons } from '@/lib/data';

export async function GET() {
  const seasons = getAllSeasons();
  const summaries = seasons.map(s => ({
    id: s.id,
    display_name: s.display_name,
    manager: s.manager,
    matches_played: s.matches_played,
    goals_scored: s.goals_scored,
    goals_conceded: s.goals_conceded,
    goal_difference: s.goal_difference,
    win_percentage: s.win_percentage,
    stage_reached: 'Winner',
  }));
  return NextResponse.json(summaries);
}
