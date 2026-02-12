'use client';

import { useState } from 'react';
import { getAllSeasons } from '@/lib/data';
import { ComparisonBar } from '@/components/Charts';
import { Season } from '@/lib/types';

export default function PlayersPage() {
  const seasons = getAllSeasons();
  const [selectedSeason, setSelectedSeason] = useState<string>(seasons[0].id);
  const season = seasons.find(s => s.id === selectedSeason) as Season;

  // Prepare data for contribution chart
  const contributionData = season.top_scorers.map(p => ({
    name: p.name.split(' ').pop() || p.name,
    value: p.contribution_share,
  }));

  const goalsData = season.top_scorers.map(p => ({
    name: p.name.split(' ').pop() || p.name,
    value: p.goals,
  }));

  // Cross-season top scorer comparison
  const topScorerComparison = seasons.map(s => ({
    name: s.display_name,
    value: s.top_scorers[0].goals,
    label: s.top_scorers[0].name,
  }));

  // Aggregate player data across all seasons
  const playerMap: Record<string, {
    goals: number;
    assists: number;
    minutes: number;
    seasons: string[];
  }> = {};

  seasons.forEach(s => {
    s.top_scorers.forEach(p => {
      if (!playerMap[p.name]) {
        playerMap[p.name] = { goals: 0, assists: 0, minutes: 0, seasons: [] };
      }
      playerMap[p.name].goals += p.goals;
      playerMap[p.name].assists += p.assists;
      playerMap[p.name].minutes += p.minutes;
      playerMap[p.name].seasons.push(s.display_name);
    });
  });

  const allTimePlayers = Object.entries(playerMap)
    .map(([name, stats]) => ({
      name,
      ...stats,
      per90Goals: stats.minutes > 0 ? ((stats.goals / stats.minutes) * 90).toFixed(2) : '0.00',
      per90Assists: stats.minutes > 0 ? ((stats.assists / stats.minutes) * 90).toFixed(2) : '0.00',
      contributions: stats.goals + stats.assists,
    }))
    .sort((a, b) => b.contributions - a.contributions);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Player Contribution Engine</h1>
        <p className="page-subtitle">
          Who drove each campaign? Goals, assists, and influence across five winning sides.
        </p>
      </div>

      {/* Season Selector */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        {seasons.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSeason(s.id)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid',
              borderColor: selectedSeason === s.id ? 'var(--color-accent)' : 'var(--color-border)',
              background: selectedSeason === s.id ? 'var(--color-accent)' : 'var(--color-bg-card)',
              color: selectedSeason === s.id ? 'white' : 'var(--color-text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            {s.display_name}
          </button>
        ))}
      </div>

      {/* Season Player Stats */}
      <h2 className="section-title">
        {season.display_name} — Key Contributors ({season.manager})
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div className="chart-container">
          <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Goals by Player
          </h3>
          <ComparisonBar data={goalsData} color="#1C2A39" height={250} />
        </div>
        <div className="chart-container">
          <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Contribution Share (%)
          </h3>
          <ComparisonBar data={contributionData} color="#4A6B8A" height={250} />
        </div>
      </div>

      {/* Per-season player table */}
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        overflow: 'auto',
        marginBottom: '2.5rem',
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>G+A</th>
              <th>Minutes</th>
              <th>Per 90 (G)</th>
              <th>Per 90 (A)</th>
              <th>Contribution %</th>
            </tr>
          </thead>
          <tbody>
            {season.top_scorers.map((player, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>{player.name}</td>
                <td>{player.goals}</td>
                <td>{player.assists}</td>
                <td style={{ fontWeight: 600 }}>{player.goals + player.assists}</td>
                <td>{player.minutes}</td>
                <td>{player.minutes > 0 ? ((player.goals / player.minutes) * 90).toFixed(2) : '0.00'}</td>
                <td>{player.minutes > 0 ? ((player.assists / player.minutes) * 90).toFixed(2) : '0.00'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="contribution-bar-track" style={{ width: '100px' }}>
                      <div className="contribution-bar-fill" style={{ width: `${player.contribution_share}%` }} />
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{player.contribution_share}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cross-season top scorer */}
      <h2 className="section-title">Top Scorer Across Campaigns</h2>
      <div className="chart-container" style={{ marginBottom: '2.5rem' }}>
        <ComparisonBar data={topScorerComparison} color="#1C2A39" height={280} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginTop: '1rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
        }}>
          {topScorerComparison.map((s, i) => (
            <span key={i}>{s.name}: {s.label} ({s.value})</span>
          ))}
        </div>
      </div>

      {/* All time aggregated stats */}
      <h2 className="section-title">Aggregated Player Stats (Across Winning Campaigns)</h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        overflow: 'auto',
        marginBottom: '2rem',
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Campaigns</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>G+A</th>
              <th>Minutes</th>
              <th>Per 90 (G)</th>
              <th>Per 90 (A)</th>
            </tr>
          </thead>
          <tbody>
            {allTimePlayers.slice(0, 12).map((player, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{player.name}</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {player.seasons.join(', ')}
                </td>
                <td>{player.goals}</td>
                <td>{player.assists}</td>
                <td style={{ fontWeight: 700 }}>{player.contributions}</td>
                <td>{player.minutes}</td>
                <td>{player.per90Goals}</td>
                <td>{player.per90Assists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
