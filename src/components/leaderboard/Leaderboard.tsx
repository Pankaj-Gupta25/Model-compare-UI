import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, ChevronUp, ChevronDown } from 'lucide-react';
import {
  CRITERIA,
  MODELS,
  PILOT_META,
  MAX_SCORE,
  type CriterionKey,
} from '../../data/imagebench';
import './Leaderboard.css';

const MEDAL = ['🥇', '🥈', '🥉'];
const CRITERION_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#7c3aed', '#4f46e5', '#818cf8'];

function ScoreBar({ value, max = MAX_SCORE, color }: { value: number; max?: number; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="score-bar">
      <motion.div
        className="score-bar__fill"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </div>
  );
}

export function Leaderboard() {
  const [activeCriterion, setActiveCriterion] = useState<CriterionKey>('overall');

  const sorted = useMemo(
    () => [...MODELS].sort((a, b) => b.scores[activeCriterion] - a.scores[activeCriterion]),
    [activeCriterion],
  );

  const criterion = CRITERIA.find((c) => c.key === activeCriterion)!;

  return (
    <div className="leaderboard">
      {/* Header */}
      <div className="leaderboard__header">
        <div className="leaderboard__title-row">
          <Award size={28} className="leaderboard__icon" />
          <div>
            <h2 className="leaderboard__title">Model Leaderboard</h2>
            <p className="leaderboard__meta">{PILOT_META}</p>
          </div>
        </div>
      </div>

      {/* Criterion selector */}
      <div className="criterion-tabs" role="tablist" aria-label="Rank by criterion">
        {CRITERIA.map((c, i) => (
          <button
            key={c.key}
            id={`criterion-tab-${c.key}`}
            role="tab"
            aria-selected={activeCriterion === c.key}
            className={`criterion-tab ${activeCriterion === c.key ? 'criterion-tab--active' : ''}`}
            style={activeCriterion === c.key ? { '--tab-color': CRITERION_COLORS[i] } as React.CSSProperties : undefined}
            onClick={() => setActiveCriterion(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Ranking cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCriterion}
          className="rankings"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {sorted.map((model, idx) => {
            const score = model.scores[activeCriterion];
            const delta = idx === 0 ? null : score - sorted[0].scores[activeCriterion];
            return (
              <motion.div
                key={model.id}
                className={`rank-card ${idx === 0 ? 'rank-card--first' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                {/* Rank badge */}
                <div className="rank-card__badge">
                  {idx < 3 ? (
                    <span className="rank-card__medal">{MEDAL[idx]}</span>
                  ) : (
                    <span className="rank-card__number">#{idx + 1}</span>
                  )}
                </div>

                {/* Model info + bar */}
                <div className="rank-card__info">
                  <div className="rank-card__name-row">
                    <span className="rank-card__name">{model.name}</span>
                    <span className="rank-card__provider">{model.provider}</span>
                  </div>
                  <ScoreBar value={score} color={criterion.color} />
                  <span className="rank-card__criterion-label">{criterion.label}</span>
                </div>

                {/* Score */}
                <div className="rank-card__score-block">
                  <span
                    className="rank-card__score"
                    style={{ color: criterion.color }}
                  >
                    {score.toFixed(2)}
                  </span>
                  <span className="rank-card__score-max">/ {MAX_SCORE}</span>
                  {delta !== null && (
                    <span className={`rank-card__delta ${delta < 0 ? 'rank-card__delta--neg' : ''}`}>
                      {delta < 0 ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                      {Math.abs(delta).toFixed(2)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Insight panel */}
      <motion.div
        className="insight-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="insight-panel__icon"><TrendingUp size={18} /></div>
        <div>
          <h4 className="insight-panel__heading">What the results suggest</h4>
          <p className="insight-panel__body">
            <strong>Nano Banana 2.1</strong> has the highest overall average (3.91/5).{' '}
            <strong>Gemini 3.1 Flash Image</strong> leads visual quality (4.00/5).
          </p>
          <p className="insight-panel__note">
            These are exploratory pilot results from 8 participants — not a definitive ranking of all model capabilities.
          </p>
        </div>
      </motion.div>

      {/* All-criteria overview table */}
      <div className="criteria-overview">
        <h4 className="criteria-overview__title">All Criteria at a Glance</h4>
        <div className="criteria-overview__table-wrap">
          <table className="criteria-table">
            <thead>
              <tr>
                <th>Model</th>
                {CRITERIA.filter((c) => c.key !== 'overall').map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th>Overall</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((model) => (
                <tr key={model.id}>
                  <td className="criteria-table__model-name">{model.name}</td>
                  {CRITERIA.filter((c) => c.key !== 'overall').map((c, ci) => (
                    <td key={c.key} className="criteria-table__score" style={{ color: CRITERION_COLORS[ci + 1] }}>
                      {model.scores[c.key].toFixed(2)}
                    </td>
                  ))}
                  <td className="criteria-table__score criteria-table__score--overall">
                    {model.scores.overall.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
