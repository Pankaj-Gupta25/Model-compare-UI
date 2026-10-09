import type { AggregatedRating, LeaderboardEntry, RatingCriteria } from '../types';
import { SAMPLE_MODELS, RATING_CRITERIA } from './constants';

// ─── Formatting Helpers ─────────────────────────────────────────────────────────

export const formatScore = (score: number, decimals = 1): string =>
  score.toFixed(decimals);

export const formatPercent = (value: number): string =>
  `${Math.round(value)}%`;

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// ─── Score Helpers ──────────────────────────────────────────────────────────────

export const getScoreColor = (score: number): string => {
  if (score >= 8) return '#10b981'; // emerald
  if (score >= 6) return '#6366f1'; // indigo
  if (score >= 4) return '#f59e0b'; // amber
  return '#ef4444';                  // red
};

export const getScoreLabel = (score: number): string => {
  if (score >= 9) return 'Exceptional';
  if (score >= 7) return 'Excellent';
  if (score >= 5) return 'Good';
  if (score >= 3) return 'Fair';
  return 'Poor';
};

// ─── Leaderboard Mock Data Generator ───────────────────────────────────────────

export const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const mockScores: Record<string, Record<RatingCriteria, number>> = {
    'midjourney-v6':      { quality: 9.2, accuracy: 8.4, creativity: 9.5, detail: 9.0, overall: 9.1 },
    'dalle-3':            { quality: 8.7, accuracy: 9.1, creativity: 8.6, detail: 8.4, overall: 8.7 },
    'stable-diffusion-xl':{ quality: 8.1, accuracy: 7.8, creativity: 8.4, detail: 8.6, overall: 8.2 },
    'imagen-3':           { quality: 8.9, accuracy: 8.8, creativity: 8.2, detail: 8.7, overall: 8.7 },
    'flux-pro':           { quality: 8.6, accuracy: 9.0, creativity: 8.5, detail: 8.8, overall: 8.7 },
    'adobe-firefly-3':    { quality: 8.0, accuracy: 8.2, creativity: 7.9, detail: 7.8, overall: 8.0 },
  };

  const winRates: Record<string, number> = {
    'midjourney-v6': 71, 'dalle-3': 62, 'stable-diffusion-xl': 48,
    'imagen-3': 65, 'flux-pro': 60, 'adobe-firefly-3': 44,
  };

  const trends: Record<string, LeaderboardEntry['trend']> = {
    'midjourney-v6': 'stable', 'dalle-3': 'up', 'stable-diffusion-xl': 'down',
    'imagen-3': 'up', 'flux-pro': 'up', 'adobe-firefly-3': 'stable',
  };

  const entries = SAMPLE_MODELS.map((model) => {
    const scores = mockScores[model.id] ?? RATING_CRITERIA.reduce(
      (acc, c) => ({ ...acc, [c.key]: Math.random() * 3 + 7 }), {} as Record<RatingCriteria, number>,
    );
    const aggregated: AggregatedRating = {
      modelId: model.id,
      totalRatings: Math.floor(Math.random() * 5000) + 1000,
      averageScores: scores,
      overallScore: scores.overall,
    };
    return {
      rank: 0,
      model,
      aggregatedRating: aggregated,
      winRate: winRates[model.id] ?? 50,
      totalComparisons: Math.floor(Math.random() * 10000) + 2000,
      trend: trends[model.id] ?? 'stable',
    } satisfies Omit<LeaderboardEntry, 'rank'> & { rank: number };
  });

  return entries
    .sort((a, b) => b.aggregatedRating.overallScore - a.aggregatedRating.overallScore)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
};

// ─── Class name utility ─────────────────────────────────────────────────────────

export const cx = (...classes: (string | undefined | false | null)[]): string =>
  classes.filter(Boolean).join(' ');
