'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

const COLORS = {
  accent: '#1C2A39',
  secondary: '#4A6B8A',
  tertiary: '#7B9CB8',
  quaternary: '#A8C4D9',
  quinary: '#D4E3ED',
  win: '#2D8A4E',
  loss: '#C0392B',
  draw: '#B08522',
  grid: '#E5E5E5',
  text: '#666666',
};

const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E5E5',
  borderRadius: '0',
  fontSize: '0.8125rem',
  padding: '0.5rem 0.75rem',
};

interface GoalsBarChartProps {
  data: Array<{
    name: string;
    goals_scored: number;
    goals_conceded: number;
  }>;
  height?: number;
}

export function GoalsBarChart({ data, height = 300 }: GoalsBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barGap={2} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: COLORS.text }}
          axisLine={{ stroke: COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.text }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          wrapperStyle={{ fontSize: '0.75rem', paddingTop: '0.5rem' }}
        />
        <Bar dataKey="goals_scored" name="Goals Scored" fill={COLORS.accent} radius={[2, 2, 0, 0]} />
        <Bar dataKey="goals_conceded" name="Goals Conceded" fill={COLORS.tertiary} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface ComparisonBarProps {
  data: Array<{
    name: string;
    value: number;
    label?: string;
  }>;
  height?: number;
  color?: string;
  dataKey?: string;
}

export function ComparisonBar({
  data,
  height = 280,
  color = COLORS.accent,
  dataKey = 'value',
}: ComparisonBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: COLORS.text }}
          axisLine={{ stroke: COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.text }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface MatchGoalsLineProps {
  data: Array<{
    match: string;
    goals_scored: number;
    goals_conceded: number;
  }>;
  height?: number;
}

export function MatchGoalsLine({ data, height = 280 }: MatchGoalsLineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey="match"
          tick={{ fontSize: 9, fill: COLORS.text }}
          axisLine={{ stroke: COLORS.grid }}
          tickLine={false}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.text }}
          axisLine={false}
          tickLine={false}
          domain={[0, 'auto']}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
        <Line
          type="monotone"
          dataKey="goals_scored"
          name="Scored"
          stroke={COLORS.accent}
          strokeWidth={2}
          dot={{ r: 3, fill: COLORS.accent }}
        />
        <Line
          type="monotone"
          dataKey="goals_conceded"
          name="Conceded"
          stroke={COLORS.loss}
          strokeWidth={2}
          dot={{ r: 3, fill: COLORS.loss }}
          strokeDasharray="4 3"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface DominanceRadarProps {
  data: Array<{
    metric: string;
    value: number;
  }>;
  height?: number;
}

export function DominanceRadar({ data, height = 300 }: DominanceRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid stroke={COLORS.grid} />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: 10, fill: COLORS.text }}
        />
        <PolarRadiusAxis tick={{ fontSize: 9, fill: COLORS.text }} />
        <Radar
          name="Performance"
          dataKey="value"
          stroke={COLORS.accent}
          fill={COLORS.accent}
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

interface MultiBarProps {
  data: Array<Record<string, unknown>>;
  bars: Array<{ dataKey: string; name: string; color: string }>;
  xKey: string;
  height?: number;
}

export function MultiBar({ data, bars, xKey, height = 300 }: MultiBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barGap={2} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 10, fill: COLORS.text }}
          axisLine={{ stroke: COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.text }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
