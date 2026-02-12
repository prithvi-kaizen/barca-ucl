'use client';

import Link from 'next/link';
import { Season } from '@/lib/types';
import { MatchGoalsLine, ComparisonBar } from '@/components/Charts';

function getResult(gs: number, gc: number): string {
  if (gs > gc) return 'W';
  if (gs === gc) return 'D';
  return 'L';
}

export default function SeasonDetailClient({ season }: { season: Season }) {
  const matchChartData = season.matches.map((m, i) => ({
    match: `${m.opponent} (${m.home_away})`,
    goals_scored: m.goals_scored,
    goals_conceded: m.goals_conceded,
  }));

  const homeMatches = season.matches.filter(m => m.home_away === 'H');
  const awayMatches = season.matches.filter(m => m.home_away === 'A');
  const homeWins = homeMatches.filter(m => m.goals_scored > m.goals_conceded).length;
  const awayWins = awayMatches.filter(m => m.goals_scored > m.goals_conceded).length;
  const neutralMatches = season.matches.filter(m => m.home_away === 'N');

  // Win margin distribution
  const margins: Record<string, number> = {};
  season.matches.forEach(m => {
    const diff = m.goals_scored - m.goals_conceded;
    let label: string;
    if (diff > 2) label = '3+ Goal Win';
    else if (diff === 2) label = '2 Goal Win';
    else if (diff === 1) label = '1 Goal Win';
    else if (diff === 0) label = 'Draw';
    else label = 'Loss';
    margins[label] = (margins[label] || 0) + 1;
  });
  const marginData = Object.entries(margins)
    .sort(([a], [b]) => {
      const order = ['3+ Goal Win', '2 Goal Win', '1 Goal Win', 'Draw', 'Loss'];
      return order.indexOf(a) - order.indexOf(b);
    })
    .map(([name, value]) => ({ name, value }));

  return (
    <>
      {/* Back link */}
      <Link
        href="/"
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          marginBottom: '1.5rem',
        }}
      >
        ← All Campaigns
      </Link>

      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h1 className="page-title">{season.display_name}</h1>
          <span style={{
            background: 'var(--color-accent)',
            color: 'white',
            fontSize: '0.625rem',
            fontWeight: 700,
            padding: '0.25rem 0.5rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {season.competition}
          </span>
        </div>
        <p className="page-subtitle">
          Manager: {season.manager} · Formation: {season.formation}
        </p>
      </div>

      {/* Season Snapshot */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        marginBottom: '2.5rem',
      }}>
        {[
          { value: season.goals_scored, label: 'Goals Scored' },
          { value: season.goals_conceded, label: 'Goals Conceded' },
          { value: `+${season.goal_difference}`, label: 'Goal Difference' },
          { value: season.clean_sheets, label: 'Clean Sheets' },
          { value: `${season.win_percentage}%`, label: 'Win Rate' },
          { value: season.avg_possession ? `${season.avg_possession}%` : 'N/A', label: 'Avg Possession' },
          { value: `${season.wins}W ${season.draws}D ${season.losses}L`, label: 'Record' },
          { value: season.goals_per_match, label: 'Goals / Match' },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Match Dominance */}
      <h2 className="section-title">Match Dominance</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <div className="chart-container">
          <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
            Goals Per Match
          </h3>
          <MatchGoalsLine data={matchChartData} height={260} />
        </div>
        <div className="chart-container">
          <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
            Win Margin Distribution
          </h3>
          <ComparisonBar data={marginData} height={260} />
        </div>
      </div>

      {/* Home vs Away */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
        marginBottom: '2.5rem',
      }}>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--color-win)' }}>
            {homeWins}/{homeMatches.length}
          </div>
          <div className="stat-label">Home Wins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>
            {awayWins}/{awayMatches.length}
          </div>
          <div className="stat-label">Away Wins</div>
        </div>
        {neutralMatches.length > 0 && (
          <div className="stat-card">
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {neutralMatches.filter(m => m.goals_scored > m.goals_conceded).length}/{neutralMatches.length}
            </div>
            <div className="stat-label">Neutral Wins (Final)</div>
          </div>
        )}
      </div>

      {/* Knockout Journey */}
      <h2 className="section-title">Knockout Journey</h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        padding: '1.5rem 1.5rem 0.5rem',
        marginBottom: '2.5rem',
      }}>
        {season.knockout_path.map((round, i) => (
          <div key={i} className="knockout-step">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <div>
                <div style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.125rem',
                }}>
                  {round.round}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                  vs {round.opponent}
                </div>
                {round.detail && (
                  <div style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary)',
                    marginTop: '0.25rem',
                    fontStyle: 'italic',
                  }}>
                    {round.detail}
                  </div>
                )}
              </div>
              <div style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                whiteSpace: 'nowrap',
              }}>
                {round.aggregate}
              </div>
            </div>
            {round.leg1 && round.leg2 && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
              }}>
                <span>1st Leg ({round.leg1.venue}): {round.leg1.score}</span>
                <span>2nd Leg ({round.leg2.venue}): {round.leg2.score}</span>
              </div>
            )}
            {round.venue && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.25rem',
              }}>
                📍 {round.venue}
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: '0.375rem',
              marginTop: '0.375rem',
              flexWrap: 'wrap',
            }}>
              {round.key_contributors.map((player, j) => (
                <span key={j} style={{
                  fontSize: '0.6875rem',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  padding: '0.125rem 0.5rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  {player}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* The Final */}
      <h2 className="section-title">The Final</h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-accent)',
        padding: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {new Date(season.final.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>
              FC Barcelona {season.final.score} {season.final.opponent}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {season.final.venue} · Attendance: {season.final.attendance.toLocaleString()}
            </div>
          </div>
          {season.final.extra_time && (
            <span style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              background: 'var(--color-draw)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              letterSpacing: '0.06em',
            }}>
              EXTRA TIME
            </span>
          )}
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {season.final.scorers.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
            }}>
              <span style={{ fontWeight: 600 }}>{s.name}</span>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                background: 'var(--color-bg)',
                padding: '0.125rem 0.375rem',
                border: '1px solid var(--color-border)',
              }}>
                {s.minute}&apos;
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Player Contributions */}
      <h2 className="section-title">Player Contributions</h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        marginBottom: '2.5rem',
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>Minutes</th>
              <th>Contribution</th>
              <th style={{ width: '30%' }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {season.top_scorers.map((player, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{player.name}</td>
                <td>{player.goals}</td>
                <td>{player.assists}</td>
                <td>{player.minutes}</td>
                <td>{player.contribution_share}%</td>
                <td>
                  <div className="contribution-bar-track">
                    <div
                      className="contribution-bar-fill"
                      style={{ width: `${player.contribution_share}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match-by-Match */}
      <h2 className="section-title">Match Log</h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        overflow: 'auto',
        marginBottom: '2rem',
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Stage</th>
              <th>Opponent</th>
              <th>H/A</th>
              <th>Score</th>
              <th>Scorers</th>
              {season.avg_possession !== null && <th>Poss</th>}
            </tr>
          </thead>
          <tbody>
            {season.matches.map((match, i) => {
              const result = getResult(match.goals_scored, match.goals_conceded);
              return (
                <tr key={i}>
                  <td>
                    <span className={`result-badge result-badge-${result.toLowerCase()}`}>
                      {result}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                    {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{match.stage}</td>
                  <td style={{ fontWeight: 500, fontSize: '0.875rem' }}>{match.opponent}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{match.home_away}</td>
                  <td style={{ fontWeight: 700, fontSize: '0.875rem' }}>{match.score}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    {match.scorers.length > 0 ? match.scorers.join(', ') : '—'}
                  </td>
                  {season.avg_possession !== null && (
                    <td style={{ fontSize: '0.8125rem' }}>
                      {match.possession !== null ? `${match.possession}%` : 'N/A'}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Squad Core */}
      <h2 className="section-title">Squad Core</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '2rem',
      }}>
        {season.squad_core.map((player, i) => (
          <span key={i} style={{
            fontSize: '0.8125rem',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            padding: '0.375rem 0.75rem',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
          }}>
            {player}
          </span>
        ))}
      </div>
    </>
  );
}
