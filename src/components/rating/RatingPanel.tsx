import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle } from 'lucide-react';
import type { GeneratedImage, RatingCriteria } from '../../types';
import { RATING_CRITERIA, MIN_RATING } from '../../utils/constants';
import { useRating } from '../../hooks/useRating';
import { SAMPLE_MODELS } from '../../utils/constants';
import './RatingPanel.css';

interface RatingPanelProps {
  image: GeneratedImage;
  onRated?: () => void;
}

export const RatingPanel = ({ image, onRated }: RatingPanelProps) => {
  const model = SAMPLE_MODELS.find((m) => m.id === image.modelId);
  const { isSubmitting, submitted, error, submitRating } = useRating();

  const [scores, setScores] = useState<Record<RatingCriteria, number>>(
    Object.fromEntries(RATING_CRITERIA.map((c) => [c.key, 0])) as Record<RatingCriteria, number>,
  );
  const [comment, setComment] = useState('');
  const [hovered, setHovered] = useState<{ key: RatingCriteria; star: number } | null>(null);

  const handleScore = (key: RatingCriteria, value: number) =>
    setScores((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    await submitRating({
      imageId: image.id,
      modelId: image.modelId,
      scores,
      comment: comment || undefined,
    });
    onRated?.();
  };

  const isComplete = (Object.values(scores) as number[]).every((s) => s >= MIN_RATING);

  if (submitted) {
    return (
      <motion.div
        className="rating-panel rating-panel--success card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle size={48} color="#10b981" />
        <h3>Rating Submitted!</h3>
        <p>Thanks for helping rank this model.</p>
      </motion.div>
    );
  }

  return (
    <div className="rating-panel card">
      <div className="rating-panel__header">
        <h3>Rate This Image</h3>
        {model && <span className="badge badge-primary">{model.name}</span>}
      </div>

      <div className="rating-panel__criteria">
        {RATING_CRITERIA.map((criterion) => {
          const currentScore = scores[criterion.key];
          return (
            <div key={criterion.key} className="rating-panel__criterion">
              <div className="rating-panel__criterion-info">
                <span className="rating-panel__criterion-name">{criterion.label}</span>
                <span className="rating-panel__criterion-desc">{criterion.description}</span>
              </div>
              <div className="rating-panel__stars">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => {
                  const isActive =
                    star <= (hovered?.key === criterion.key ? hovered.star : currentScore);
                  return (
                    <motion.button
                      key={star}
                      id={`rating-${criterion.key}-star-${star}`}
                      className={`star-btn ${isActive ? 'star-btn--active' : ''}`}
                      style={{ color: isActive ? criterion.color : undefined }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHovered({ key: criterion.key, star })}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleScore(criterion.key, star)}
                      aria-label={`Rate ${criterion.label} ${star} out of 10`}
                    >
                      <Star size={18} fill={isActive ? 'currentColor' : 'none'} />
                    </motion.button>
                  );
                })}
                <span className="rating-panel__score-display">
                  {currentScore > 0 ? currentScore : '—'}/10
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rating-panel__comment">
        <label htmlFor="rating-comment">Comment (optional)</label>
        <textarea
          id="rating-comment"
          className="input"
          placeholder="Share your thoughts on this image…"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && <p className="rating-panel__error">{error}</p>}

      <button
        id="rating-submit-btn"
        className="btn btn-primary btn-lg"
        onClick={handleSubmit}
        disabled={!isComplete || isSubmitting}
      >
        <Send size={16} />
        {isSubmitting ? 'Submitting…' : 'Submit Rating'}
      </button>
    </div>
  );
};
