import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Loader2, RotateCcw, CheckSquare, Square } from 'lucide-react';
import { useComparison } from '../hooks/useComparison';
import { RatingPanel } from '../components/rating/RatingPanel';
import { SAMPLE_MODELS } from '../utils/constants';
import './ComparePage.css';

export const ComparePage = () => {
  const { session, isLoading, error, startComparison, reset } = useComparison();
  const [prompt, setPrompt] = useState('');
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(['midjourney-v6', 'dalle-3']);
  const [ratedImages, setRatedImages] = useState<Set<string>>(new Set());

  const toggleModel = (id: string) => {
    setSelectedModelIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleCompare = () => {
    if (prompt.trim() && selectedModelIds.length >= 2) {
      startComparison(prompt.trim(), selectedModelIds);
    }
  };

  return (
    <div className="compare-page">
      <div className="container">
        <div className="page-header">
          <h1>⚡ Compare Models</h1>
          <p className="page-header__sub">Enter a prompt, select models, and rate the outputs.</p>
        </div>

        {/* Setup form */}
        {!session && (
          <motion.div
            className="compare-setup card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="compare-setup__section">
              <label className="compare-setup__label" htmlFor="compare-prompt">
                <Wand2 size={16} /> Your Prompt
              </label>
              <textarea
                id="compare-prompt"
                className="input compare-setup__textarea"
                placeholder="e.g. A cyberpunk cityscape at sunset with neon lights reflecting on wet streets, ultra detailed, cinematic..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            <div className="compare-setup__section">
              <p className="compare-setup__label">Select Models (min 2)</p>
              <div className="model-selector">
                {SAMPLE_MODELS.map((model) => {
                  const selected = selectedModelIds.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      id={`model-select-${model.id}`}
                      className={`model-selector__item ${selected ? 'model-selector__item--selected' : ''}`}
                      onClick={() => toggleModel(model.id)}
                    >
                      {selected ? <CheckSquare size={16} /> : <Square size={16} />}
                      <div className="model-selector__info">
                        <span className="model-selector__name">{model.name}</span>
                        <span className="model-selector__provider">{model.provider}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="compare-error">{error}</p>}

            <button
              id="start-comparison-btn"
              className="btn btn-primary btn-lg"
              onClick={handleCompare}
              disabled={!prompt.trim() || selectedModelIds.length < 2 || isLoading}
            >
              {isLoading ? (
                <><Loader2 size={18} className="spin" /> Generating…</>
              ) : (
                <><Wand2 size={18} /> Generate & Compare</>
              )}
            </button>
          </motion.div>
        )}

        {/* Comparison results */}
        <AnimatePresence>
          {session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="compare-results-header">
                <div>
                  <h2>Results</h2>
                  <p className="compare-prompt-display">"{session.prompt}"</p>
                </div>
                <button
                  id="reset-comparison-btn"
                  className="btn btn-ghost btn-sm"
                  onClick={() => { reset(); setRatedImages(new Set()); }}
                >
                  <RotateCcw size={14} /> New Comparison
                </button>
              </div>

              <div className="compare-grid">
                {session.images.map((image) => {
                  const model = SAMPLE_MODELS.find((m) => m.id === image.modelId);
                  const isRated = ratedImages.has(image.id);
                  return (
                    <motion.div
                      key={image.id}
                      className="compare-item"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="compare-item__image-wrap">
                        <img
                          src={image.imageUrl}
                          alt={`${model?.name} output`}
                          className="compare-item__image"
                          loading="lazy"
                        />
                        <div className="compare-item__model-badge">
                          <span>{model?.name}</span>
                          <span className="compare-item__provider">{model?.provider}</span>
                        </div>
                      </div>
                      {!isRated ? (
                        <RatingPanel
                          image={image}
                          onRated={() => setRatedImages((prev) => new Set([...prev, image.id]))}
                        />
                      ) : (
                        <div className="compare-item__rated card">
                          <span>✅ Rated!</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
