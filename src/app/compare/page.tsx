'use client';

import { getCrossSeasonData, getAllSeasons } from '@/lib/data';
import { GoalsBarChart, ComparisonBar, DominanceRadar } from '@/components/Charts';

export default function ComparePage() {
  const crossSeason = getCrossSeasonData();
  const seasons = getAllSeasons();
  const { comparison, common_traits: traits } = crossSeason;

  const goalsData = comparison.map(s => ({
    name: s.display_name,
    goals_scored: s.goals_scored,
    goals_conceded: s.goals_conceded,
  }));

  const goalsPerMatchData = comparison.map(s => ({
    name: s.display_name,
    value: s.goals_per_match,
  }));

  const winRateData = comparison.map(s => ({
    name: s.display_name,
    value: s.win_percentage,
  }));

  const dominanceData = comparison.map(s => ({
    name: s.display_name,
    value: s.dominance_index,
  }));

  const dependencyData = comparison.map(s => ({
    name: s.display_name,
    value: s.top_scorer_dependency,
    label: s.top_scorer,
  }));

  // Radar for best season default
  const bestSeason = comparison.reduce((a, b) =>
    a.dominance_index > b.dominance_index ? a : b
  );
  const radarData = [
    { metric: 'Goals/Match', value: bestSeason.goals_per_match },
    { metric: 'Win %', value: bestSeason.win_percentage / 10 },
    { metric: 'Clean Sheets', value: bestSeason.clean_sheets },
    { metric: 'Goal Diff', value: bestSeason.goal_difference },
    { metric: 'Dominance', value: bestSeason.dominance_index / 10 },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Cross-Season Comparison</h1>
        <p className="page-subtitle">
          How do the five winning sides compare? Patterns of elite performance across eras.
        </p>
      </div>

      {/* Common Traits */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
        marginBottom: '2.5rem',
      }}>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{traits.avg_goals_per_match}</div>
          <div className="stat-label">Avg Goals / Match</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{traits.avg_goals_conceded_per_match}</div>
          <div className="stat-label">Avg Conceded / Match</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{traits.avg_win_percentage}%</div>
          <div className="stat-label">Avg Win Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{traits.avg_clean_sheet_pct}%</div>
          <div className="stat-label">Avg Clean Sheet %</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{traits.total_goals_scored}</div>
          <div className="stat-label">Total Goals (5 Campaigns)</div>
        </div>
      </div>

      {/* Goals Comparison */}
      <h2 className="section-title">Goals Scored vs Conceded</h2>
      <div className="chart-container" style={{ marginBottom: '2rem' }}>
        <GoalsBarChart data={goalsData} height={320} />
      </div>

      {/* Two col charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <h2 className="section-title">Goals Per Match</h2>
          <div className="chart-container">
            <ComparisonBar data={goalsPerMatchData} color="#1C2A39" />
          </div>
        </div>
        <div>
          <h2 className="section-title">Win Rate (%)</h2>
          <div className="chart-container">
            <ComparisonBar data={winRateData} color="#2D8A4E" />
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <div>
          <h2 className="section-title">Dominance Index</h2>
          <div className="chart-container">
            <ComparisonBar data={dominanceData} color="#1C2A39" />
          </div>
        </div>
        <div>
          <h2 className="section-title">Top Scorer Dependency (%)</h2>
          <div className="chart-container">
            <ComparisonBar data={dependencyData} color="#4A6B8A" />
          </div>
        </div>
      </div>

      {/* Season comparison table */}
      <h2 className="section-title">Season-by-Season Breakdown</h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        overflow: 'auto',
        marginBottom: '2rem',
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Season</th>
              <th>Manager</th>
              <th>P</th>
              <th>GS</th>
              <th>GC</th>
              <th>GD</th>
              <th>Win %</th>
              <th>CS</th>
              <th>Poss</th>
              <th>Top Scorer</th>
              <th>Dominance</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.display_name}</td>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>{s.manager}</td>
                <td>{s.matches_played}</td>
                <td>{s.goals_scored}</td>
                <td>{s.goals_conceded}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-win)' }}>+{s.goal_difference}</td>
                <td>{s.win_percentage}%</td>
                <td>{s.clean_sheets}</td>
                <td>{s.avg_possession ? `${s.avg_possession}%` : 'N/A'}</td>
                <td style={{ fontSize: '0.8125rem' }}>{s.top_scorer} ({s.top_scorer_goals})</td>
                <td style={{ fontWeight: 700 }}>{s.dominance_index}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <h2 className="section-title">Key Observations</h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
      }}>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          color: 'var(--color-text-primary)',
        }}>
          <li style={{ display: 'flex', gap: '0.625rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>→</span>
            The 2008–09 and 2010–11 campaigns (both under Guardiola) achieved the highest goal tallies (30 each) 
            with the 2010–11 side conceding just {comparison.find(s => s.season === '2010-11')?.goals_conceded} goals.
          </li>
          <li style={{ display: 'flex', gap: '0.625rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>→</span>
            The 2014–15 MSN-era team scored the most total goals ({comparison.find(s => s.season === '2014-15')?.goals_scored}) 
            across {comparison.find(s => s.season === '2014-15')?.matches_played} matches.
          </li>
          <li style={{ display: 'flex', gap: '0.625rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>→</span>
            The 1991–92 European Cup campaign had the fewest matches (10) but maintained a strong defensive record 
            with {comparison.find(s => s.season === '1991-92')?.clean_sheets} clean sheets.
          </li>
          <li style={{ display: 'flex', gap: '0.625rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>→</span>
            Across all five campaigns, winning sides averaged {traits.avg_win_percentage}% win rate — 
            consistency is a hallmark of champions.
          </li>
        </ul>
      </div>
    </>
  );
}
