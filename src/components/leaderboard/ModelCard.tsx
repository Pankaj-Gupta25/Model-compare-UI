import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LeaderboardEntry } from '../../types';
import { RATING_CRITERIA } from '../../utils/constants';
import { formatScore, getScoreColor } from '../../utils/helpers';
import './ModelCard.css';

interface ModelCardProps {
  entry: LeaderboardEntry;
  style?: React.CSSProperties;
}

export const ModelCard = ({ entry, style }: ModelCardProps) => {
  const { rank, model, aggregatedRating, winRate, totalComparisons, trend } = entry;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8';

  return (
    <motion.div
      className={`model-card card ${rank <= 3 ? `model-card--top-${rank}` : ''}`}
      style={style}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Rank badge */}
      <div className="model-card__rank">
        {rank <= 3 ? (
          <span className="model-card__rank-medal">
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
          </span>
        ) : (
          <span className="model-card__rank-number">#{rank}</span>
        )}
      </div>

      {/* Header */}
      <div className="model-card__header">
        <div className="model-card__info">
          <h3 className="model-card__name">{model.name}</h3>
          <p className="model-card__provider">{model.provider}</p>
        </div>
        <div
          className="model-card__overall-score score-pill"
          style={{ background: `${getScoreColor(aggregatedRating.overallScore)}22`, color: getScoreColor(aggregatedRating.overallScore) }}
        >
          {formatScore(aggregatedRating.overallScore)}
        </div>
      </div>

      {/* Tags */}
      <div className="model-card__tags">
        {model.tags.map((tag) => (
          <span key={tag} className="badge badge-primary">{tag}</span>
        ))}
      </div>

      {/* Criteria scores */}
      <div className="model-card__criteria">
        {RATING_CRITERIA.filter((c) => c.key !== 'overall').map((criterion) => {
          const score = aggregatedRating.averageScores[criterion.key] ?? 0;
          const pct = (score / 10) * 100;
          return (
            <div key={criterion.key} className="model-card__criterion">
              <div className="model-card__criterion-label">
                <span>{criterion.label}</span>
                <span style={{ color: criterion.color }}>{formatScore(score)}</span>
              </div>
              <div className="model-card__criterion-bar">
                <div
                  className="model-card__criterion-fill"
                  style={{ width: `${pct}%`, background: criterion.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="model-card__stats">
        <div className="model-card__stat">
          <span className="model-card__stat-value">{winRate}%</span>
          <span className="model-card__stat-label">Win Rate</span>
        </div>
        <div className="model-card__stat">
          <span className="model-card__stat-value">{aggregatedRating.totalRatings.toLocaleString()}</span>
          <span className="model-card__stat-label">Ratings</span>
        </div>
        <div className="model-card__stat">
          <span className="model-card__stat-value">{(totalComparisons / 1000).toFixed(1)}K</span>
          <span className="model-card__stat-label">Comparisons</span>
        </div>
        <div className="model-card__stat model-card__stat--trend" style={{ color: trendColor }}>
          <TrendIcon size={16} />
          <span className="model-card__stat-label" style={{ color: trendColor }}>Trend</span>
        </div>
      </div>
    </motion.div>
  );
};
