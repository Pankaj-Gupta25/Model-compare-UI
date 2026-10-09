import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { SAMPLE_MODELS } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';
import './ModelsPage.css';

export const ModelsPage = () => (
  <div className="models-page">
    <div className="container">
      <div className="page-header">
        <h1>🤖 AI Models</h1>
        <p className="page-header__sub">All AI image generation models currently tracked on {' '}
          <span style={{ color: 'var(--color-primary-light)' }}>ModelArena</span>.
        </p>
      </div>

      <div className="models-grid">
        {SAMPLE_MODELS.map((model, i) => (
          <motion.div
            key={model.id}
            className="model-detail-card card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className="model-detail-card__header">
              <div className="model-detail-card__avatar">
                {model.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="model-detail-card__name">{model.name}</h3>
                <p className="model-detail-card__provider">{model.provider}</p>
              </div>
              {model.isActive && <span className="badge badge-success model-detail-card__status">Active</span>}
            </div>

            <p className="model-detail-card__desc">{model.description}</p>

            <div className="model-detail-card__meta">
              <span className="model-detail-card__meta-item">
                <Calendar size={13} /> {formatDate(model.releaseDate)}
              </span>
            </div>

            <div className="model-detail-card__tags">
              <Tag size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              {model.tags.map((tag) => (
                <span key={tag} className="badge badge-primary">{tag}</span>
              ))}
            </div>

            <div className="model-detail-card__actions">
              <Link
                to={`/compare?models=${model.id}`}
                id={`model-compare-${model.id}`}
                className="btn btn-primary btn-sm"
              >
                Compare This Model
              </Link>
              <Link
                to="/leaderboard"
                id={`model-leaderboard-${model.id}`}
                className="btn btn-ghost btn-sm"
              >
                View Rankings
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
