import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, GitCompare, BarChart3, Star, Zap } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, SAMPLE_MODELS } from '../utils/constants';
import './HomePage.css';

const FEATURES = [
  {
    icon: GitCompare,
    title: 'Side-by-Side Compare',
    desc: 'Generate images from the same prompt across multiple AI models and compare the results instantly.',
  },
  {
    icon: Star,
    title: 'Community Ratings',
    desc: 'Rate images on quality, accuracy, creativity, and detail. Your votes shape the rankings.',
  },
  {
    icon: Trophy,
    title: 'Live Leaderboard',
    desc: 'See which AI image models dominate based on thousands of real community ratings.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    desc: 'Deep-dive into per-criterion scores, win rates, and performance trends over time.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const HomePage = () => (
  <div className="home-page">
    {/* Glow orbs */}
    <div className="glow-orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent)', top: '-200px', left: '50%', transform: 'translateX(-50%)' }} />
    <div className="glow-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent)', bottom: '10%', right: '-100px' }} />

    {/* Hero */}
    <section className="hero">
      <div className="container">
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <span className="hero__eyebrow badge badge-primary">
              <Zap size={12} /> Community-Powered Rankings
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero__title">
            The Ultimate <span className="hero__title-gradient">AI Image Model</span> Arena
          </motion.h1>

          <motion.p variants={itemVariants} className="hero__subtitle">
            {APP_TAGLINE} — compare outputs side-by-side, rate them on multiple criteria, and
            discover which model truly reigns supreme.
          </motion.p>

          <motion.div variants={itemVariants} className="hero__cta-group">
            <Link to="/compare" className="btn btn-primary btn-lg" id="hero-start-compare">
              Start Comparing <ArrowRight size={18} />
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-lg" id="hero-view-leaderboard">
              View Leaderboard <Trophy size={18} />
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div variants={itemVariants} className="hero__stats">
            {[
              { value: '50K+', label: 'Ratings Cast' },
              { value: '12K+', label: 'Comparisons' },
              { value: '6',    label: 'AI Models' },
              { value: '98%',  label: 'Satisfaction' },
            ].map(({ value, label }) => (
              <div key={label} className="hero__stat">
                <span className="hero__stat-value">{value}</span>
                <span className="hero__stat-label">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="features">
      <div className="container">
        <div className="section-header">
          <h2>Everything You Need to <span className="text-gradient">Evaluate AI Models</span></h2>
          <p>A comprehensive platform for the AI image generation community.</p>
        </div>
        <div className="features__grid">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="feature-card card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="feature-card__icon">
                <feature.icon size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Models preview */}
    <section className="models-preview">
      <div className="container">
        <div className="section-header">
          <h2>Models in the Arena</h2>
          <p>Currently tracking {SAMPLE_MODELS.length} leading AI image generation models.</p>
        </div>
        <div className="models-preview__grid">
          {SAMPLE_MODELS.map((model, i) => (
            <motion.div
              key={model.id}
              className="model-chip card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
            >
              <span className="model-chip__name">{model.name}</span>
              <span className="model-chip__provider">{model.provider}</span>
            </motion.div>
          ))}
        </div>
        <div className="models-preview__cta">
          <Link to="/models" className="btn btn-ghost" id="home-view-all-models">
            View All Models <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section className="cta-banner">
      <div className="container">
        <div className="cta-banner__inner card">
          <div className="cta-banner__text">
            <h2>Ready to Start Rating?</h2>
            <p>Join the community and help determine which AI model is truly the best.</p>
          </div>
          <Link to="/compare" className="btn btn-primary btn-lg" id="home-cta-compare">
            Compare Models Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  </div>
);
