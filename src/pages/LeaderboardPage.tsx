import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useFilters } from '../hooks/useFilters';
import { ModelCard } from '../components/leaderboard/ModelCard';
import type { SortField } from '../types';
import './LeaderboardPage.css';

const SORT_OPTIONS: Array<{ value: SortField; label: string }> = [
  { value: 'overall',    label: 'Overall Score' },
  { value: 'quality',    label: 'Quality' },
  { value: 'accuracy',   label: 'Accuracy' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'detail',     label: 'Detail' },
  { value: 'winRate',    label: 'Win Rate' },
];

const ALL_TAGS = ['artistic', 'photorealistic', 'premium', 'versatile', 'accurate', 'creative',
  'open-source', 'detailed', 'google', 'cutting-edge', 'fast', 'commercial', 'safe', 'adobe'];

export const LeaderboardPage = () => {
  const { data: entries, isLoading } = useLeaderboard();
  const { filters, setSearch, toggleTag, setSortField, hasActiveFilters, resetFilters } = useFilters();
  const [showFilters, setShowFilters] = useState(false);

  const filtered = (entries ?? [])
    .filter((e) => {
      const q = filters.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        e.model.name.toLowerCase().includes(q) ||
        e.model.provider.toLowerCase().includes(q);
      const matchesTags = filters.selectedTags.length === 0 ||
        filters.selectedTags.some((tag) => e.model.tags.includes(tag));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      const field = filters.sortField;
      const valA = field === 'winRate' ? a.winRate : (a.aggregatedRating.averageScores[field as keyof typeof a.aggregatedRating.averageScores] ?? a.aggregatedRating.overallScore);
      const valB = field === 'winRate' ? b.winRate : (b.aggregatedRating.averageScores[field as keyof typeof b.aggregatedRating.averageScores] ?? b.aggregatedRating.overallScore);
      return filters.sortOrder === 'desc' ? valB - valA : valA - valB;
    });

  return (
    <div className="leaderboard-page">
      <div className="container">
        {/* Page header */}
        <div className="page-header">
          <div>
            <h1>🏆 Leaderboard</h1>
            <p className="page-header__sub">
              Rankings based on {(entries ?? []).reduce((sum, e) => sum + e.aggregatedRating.totalRatings, 0).toLocaleString()} community ratings
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="leaderboard-controls">
          <div className="leaderboard-controls__search">
            <Search size={16} className="leaderboard-controls__search-icon" />
            <input
              id="leaderboard-search"
              className="input"
              placeholder="Search models or providers…"
              value={filters.searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div className="leaderboard-controls__sort">
            {SORT_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                id={`sort-${value}`}
                className={`btn btn-sm ${filters.sortField === value ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSortField(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            id="toggle-filters"
            className={`btn btn-sm ${showFilters ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter size={14} /> Filters {hasActiveFilters && <span className="filter-dot" />}
          </button>
        </div>

        {/* Tag filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="tag-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="tag-filters__inner">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    id={`tag-filter-${tag}`}
                    className={`badge ${filters.selectedTags.includes(tag) ? 'badge-primary' : ''} tag-filter-btn`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
                {hasActiveFilters && (
                  <button className="btn btn-sm btn-ghost" onClick={resetFilters}>
                    <X size={12} /> Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {isLoading ? (
          <div className="leaderboard-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton" style={{ height: 340 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No models match your filters.</p>
            <button className="btn btn-ghost" onClick={resetFilters}>Clear filters</button>
          </div>
        ) : (
          <motion.div
            className="leaderboard-grid"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((entry, i) => (
              <ModelCard
                key={entry.model.id}
                entry={entry}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
