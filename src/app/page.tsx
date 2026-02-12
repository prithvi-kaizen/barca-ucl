import Link from 'next/link';
import { getAllSeasons, getCrossSeasonData } from '@/lib/data';

export default function Home() {
  const seasons = getAllSeasons();
  const crossSeason = getCrossSeasonData();
  const traits = crossSeason.common_traits;

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Champions League Winners</h1>
        <p className="page-subtitle">
          Five campaigns. Five trophies. What does a winning Barcelona side look like?
        </p>
      </div>

      {/* Aggregate Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '3rem',
      }}>
        <div className="stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Titles Won</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{traits.total_matches}</div>
          <div className="stat-label">Matches Played</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{traits.total_goals_scored}</div>
          <div className="stat-label">Goals Scored</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{traits.avg_goals_per_match}</div>
          <div className="stat-label">Avg Goals / Match</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{traits.avg_win_percentage}%</div>
          <div className="stat-label">Avg Win Rate</div>
        </div>
      </div>

      {/* Season Cards */}
      <h2 className="section-title">Select a Campaign</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {seasons.map((season) => (
          <Link
            key={season.id}
            href={`/season/${season.id}`}
            className="season-card"
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}>
              <div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-accent)',
                }}>
                  {season.display_name}
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  marginTop: '0.125rem',
                }}>
                  {season.manager}
                </div>
              </div>
              <div style={{
                background: 'var(--color-accent)',
                color: 'white',
                fontSize: '0.625rem',
                fontWeight: 700,
                padding: '0.25rem 0.5rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                Winner
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
            }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {season.goals_scored}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', letterSpacing: '0.04em' }}>
                  Goals
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {season.matches_played}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', letterSpacing: '0.04em' }}>
                  Matches
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {season.clean_sheets}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', letterSpacing: '0.04em' }}>
                  Clean Sheets
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--color-border)',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
            }}>
              Final: {season.final.score} vs {season.final.opponent}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
