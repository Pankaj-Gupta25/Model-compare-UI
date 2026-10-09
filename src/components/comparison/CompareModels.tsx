import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon, ChevronDown } from 'lucide-react';
import {
  CRITERIA,
  MODELS,
  CATEGORIES,
  PROMPTS,
  MAX_SCORE,
  type CriterionKey,
  type Category,
  type AIModel,
} from '../../data/imagebench';
import './CompareModels.css';

// Colour palette for comparison bars (matching home.html)
const BAR_COLORS: Record<string, string> = {
  'gemini-flash':    '#7297b5',
  'nano-banana':     '#47795c',
  'gemini-2-5-flash':'#a78bfa',
};

function ImageSlot({ model, imageId }: { model: AIModel; imageId: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImgSrc(URL.createObjectURL(file));
  };

  return (
    <div className="image-slot card">
      <div
        className={`image-slot__display ${imgSrc ? '' : 'image-slot__display--empty'}`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`Upload image for ${model.name}`}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={`${model.name} generated output`} className="image-slot__img" />
        ) : (
          <div className="image-slot__placeholder">
            <ImageIcon size={36} className="image-slot__placeholder-icon" />
            <span className="image-slot__placeholder-name">{model.name}</span>
            <span className="image-slot__placeholder-hint">
              <Upload size={13} /> Click to upload image
            </span>
            <input
              ref={inputRef}
              id={`upload-${imageId}`}
              type="file"
              accept="image/*"
              className="image-slot__file-input"
              onChange={handleFile}
            />
          </div>
        )}
        {imgSrc && (
          <button
            className="image-slot__replace-btn"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            <Upload size={14} /> Replace
          </button>
        )}
        {imgSrc && (
          <input
            ref={inputRef}
            id={`upload-${imageId}`}
            type="file"
            accept="image/*"
            className="image-slot__file-input"
            onChange={handleFile}
          />
        )}
      </div>
      <div className="image-slot__footer">
        <span className="image-slot__model-name">{model.name}</span>
        <span className="image-slot__overall">
          {model.scores.overall.toFixed(2)} <span className="image-slot__max">/ {MAX_SCORE}</span>
        </span>
        <span className="image-slot__overall-label">Overall pilot avg</span>
      </div>
    </div>
  );
}

export function CompareModels() {
  const [category, setCategory] = useState<Category>('Clothing');
  const [criterion, setCriterion] = useState<CriterionKey>('adherence');

  // Use first two models (matching home.html default: Gemini Flash vs Nano Banana)
  const modelA = MODELS.find((m) => m.id === 'gemini-flash')!;
  const modelB = MODELS.find((m) => m.id === 'nano-banana')!;

  const scoreA = modelA.scores[criterion];
  const scoreB = modelB.scores[criterion];
  const criterionLabel = CRITERIA.find((c) => c.key === criterion)?.label ?? criterion;

  const winner =
    scoreA === scoreB ? null : scoreA > scoreB ? modelA : modelB;
  const diff = Math.abs(scoreB - scoreA);

  return (
    <div className="compare-models">
      {/* Category selector */}
      <div className="compare-models__panel card">
        <div className="compare-models__panel-header">
          <label htmlFor="category-select" className="compare-models__label">
            Product Category
          </label>
        </div>

        <div className="category-tabs" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`category-tab-${cat.toLowerCase()}`}
              role="tab"
              aria-selected={category === cat}
              className={`category-tab ${category === cat ? 'category-tab--active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="compare-models__prompt-box">
          <span className="compare-models__prompt-label">Prompt</span>
          <AnimatePresence mode="wait">
            <motion.p
              key={category}
              className="compare-models__prompt-text"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {PROMPTS[category]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Side-by-side images */}
      <div className="compare-models__images">
        <ImageSlot model={modelA} imageId="img-a" />
        <div className="compare-models__vs">VS</div>
        <ImageSlot model={modelB} imageId="img-b" />
      </div>

      {/* Criterion comparison */}
      <div className="compare-models__panel card">
        <div className="compare-models__panel-header">
          <label className="compare-models__label">Compare Criterion</label>
        </div>

        <div className="criterion-tabs-sm" role="tablist">
          {CRITERIA.filter((c) => c.key !== 'overall').map((c) => (
            <button
              key={c.key}
              id={`compare-criterion-${c.key}`}
              role="tab"
              aria-selected={criterion === c.key}
              className={`criterion-tab-sm ${criterion === c.key ? 'criterion-tab-sm--active' : ''}`}
              onClick={() => setCriterion(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="comparison-bars">
          {[modelA, modelB].map((model) => {
            const score = model.scores[criterion];
            const color = BAR_COLORS[model.id] ?? '#6366f1';
            return (
              <div key={model.id} className="comparison-bar">
                <div className="comparison-bar__header">
                  <span className="comparison-bar__name">{model.name}</span>
                  <span className="comparison-bar__score" style={{ color }}>
                    {score.toFixed(2)} / {MAX_SCORE}
                  </span>
                </div>
                <div className="score-bar">
                  <motion.div
                    className="score-bar__fill"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / MAX_SCORE) * 100}%` }}
                    key={criterion}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}

          <AnimatePresence mode="wait">
            <motion.p
              key={criterion}
              className="comparison-verdict"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {scoreA === scoreB
                ? 'Both models have the same score for this criterion.'
                : `${winner?.name} leads by ${diff.toFixed(2)} points for ${criterionLabel.toLowerCase()}.`}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* All-model comparison for the selected criterion */}
      <div className="compare-models__panel card">
        <h4 className="compare-models__label" style={{ marginBottom: '1rem' }}>
          All Models — {criterionLabel}
        </h4>
        <div className="all-model-bars">
          {[...MODELS]
            .sort((a, b) => b.scores[criterion] - a.scores[criterion])
            .map((model, i) => {
              const score = model.scores[criterion];
              const color = BAR_COLORS[model.id] ?? '#6366f1';
              return (
                <div key={model.id} className="comparison-bar">
                  <div className="comparison-bar__header">
                    <span className="comparison-bar__rank">#{i + 1}</span>
                    <span className="comparison-bar__name">{model.name}</span>
                    <span className="comparison-bar__score" style={{ color }}>
                      {score.toFixed(2)}
                    </span>
                  </div>
                  <div className="score-bar">
                    <motion.div
                      className="score-bar__fill"
                      style={{ background: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / MAX_SCORE) * 100}%` }}
                      key={criterion}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer note */}
      <p className="compare-models__footer-note">
        ⚠️ The displayed scores are aggregate pilot averages and are not category-specific.
        Upload actual outputs for the selected prompt before using this as visual evidence.
      </p>
    </div>
  );
}
