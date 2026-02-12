export interface MatchScorer {
  name: string;
  minute: number;
}

export interface Match {
  date: string;
  opponent: string;
  home_away: string;
  score: string;
  goals_scored: number;
  goals_conceded: number;
  stage: string;
  scorers: string[];
  possession: number | null;
  shots: number | null;
  shots_on_target: number | null;
  extra_time?: boolean;
}

export interface KnockoutRound {
  round: string;
  opponent: string;
  leg1?: { score: string; venue: string };
  leg2?: { score: string; venue: string };
  aggregate: string;
  key_contributors: string[];
  detail?: string;
  note?: string;
  venue?: string;
  score?: string;
}

export interface PlayerStat {
  name: string;
  goals: number;
  assists: number;
  minutes: number;
  contribution_share: number;
}

export interface FinalInfo {
  opponent: string;
  venue: string;
  date: string;
  score: string;
  extra_time: boolean;
  scorers: MatchScorer[];
  attendance: number;
}

export interface Season {
  id: string;
  display_name: string;
  competition: string;
  manager: string;
  squad_core: string[];
  formation: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  goal_difference: number;
  clean_sheets: number;
  goals_per_match: number;
  goals_conceded_per_match: number;
  win_percentage: number;
  avg_possession: number | null;
  knockout_path: KnockoutRound[];
  final: FinalInfo;
  matches: Match[];
  top_scorers: PlayerStat[];
}

export interface CrossSeasonComparison {
  season: string;
  display_name: string;
  manager: string;
  goals_per_match: number;
  goals_conceded_per_match: number;
  goal_difference: number;
  win_percentage: number;
  clean_sheets: number;
  avg_possession: number | null;
  matches_played: number;
  goals_scored: number;
  goals_conceded: number;
  top_scorer: string;
  top_scorer_goals: number;
  top_scorer_dependency: number;
  dominance_index: number;
}

export interface CommonTraits {
  avg_goals_per_match: number;
  avg_goals_conceded_per_match: number;
  avg_win_percentage: number;
  avg_clean_sheet_pct: number;
  total_goals_scored: number;
  total_matches: number;
  total_goals_conceded: number;
}

export interface CrossSeasonData {
  comparison: CrossSeasonComparison[];
  common_traits: CommonTraits;
}

export interface DataSet {
  metadata: {
    title: string;
    description: string;
    seasons_covered: string[];
    data_sources: string[];
    data_integrity_note: string;
  };
  seasons: Season[];
  cross_season: CrossSeasonData;
}
