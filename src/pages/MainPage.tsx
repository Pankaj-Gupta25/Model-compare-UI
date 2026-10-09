import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, GitCompare, Sparkles } from 'lucide-react';
import { Leaderboard } from '../components/leaderboard/Leaderboard';
import { CompareModels } from '../components/comparison/CompareModels';
import { APP_NAME, APP_SUBTITLE } from '../data/imagebench';
import './MainPage.css';

type Tab = 'leaderboard' | 'compare';

const TABS: Array<{ id: Tab; label: string; icon: typeof Trophy }> = [
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'compare',     label: 'Compare Models', icon: GitCompare },
];

export const MainPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard');

  return (
    <div className="main-page">
      <div className="container main-page__inner">
        {/* Page header */}
        <header className="main-page__header">
          <div className="main-page__eyebrow">
            <Sparkles size={14} />
            Pilot Evaluation · 8 Participants
          </div>
          <h1 className="main-page__title">{APP_NAME}</h1>
          <p className="main-page__subtitle">{APP_SUBTITLE}</p>
        </header>

        {/* Tabs */}
        <nav className="main-tabs" role="tablist" aria-label="Main navigation">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`tab-${id}`}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              className={`main-tab ${activeTab === id ? 'main-tab--active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={16} />
              {label}
              {activeTab === id && (
                <motion.span
                  className="main-tab__indicator"
                  layoutId="tab-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activeTab === 'leaderboard' ? <Leaderboard /> : <CompareModels />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
