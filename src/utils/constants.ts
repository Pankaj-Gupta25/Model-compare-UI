import type { RatingCriteria, AIModel } from '../types';

// ─── Rating Criteria Config ─────────────────────────────────────────────────────
export const RATING_CRITERIA: Array<{ key: RatingCriteria; label: string; description: string; color: string }> = [
  { key: 'quality',    label: 'Quality',    description: 'Overall image quality and resolution',    color: '#6366f1' },
  { key: 'accuracy',   label: 'Accuracy',   description: 'How accurately the image matches prompt', color: '#8b5cf6' },
  { key: 'creativity', label: 'Creativity', description: 'Creative interpretation and uniqueness',   color: '#a78bfa' },
  { key: 'detail',     label: 'Detail',     description: 'Level of fine details and textures',       color: '#c4b5fd' },
  { key: 'overall',   label: 'Overall',    description: 'General impression of the image',           color: '#7c3aed' },
];

// ─── Sample AI Models ───────────────────────────────────────────────────────────
export const SAMPLE_MODELS: AIModel[] = [
  {
    id: 'midjourney-v6',
    name: 'Midjourney v6',
    provider: 'Midjourney',
    description: 'State-of-the-art aesthetic image generation with stunning visual quality.',
    tags: ['artistic', 'photorealistic', 'premium'],
    releaseDate: '2024-01-01',
    isActive: true,
  },
  {
    id: 'dalle-3',
    name: 'DALL·E 3',
    provider: 'OpenAI',
    description: 'Advanced text-to-image model with high prompt adherence and creative output.',
    tags: ['versatile', 'accurate', 'creative'],
    releaseDate: '2023-10-01',
    isActive: true,
  },
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    description: 'Open-source powerhouse with exceptional customization and detail.',
    tags: ['open-source', 'detailed', 'versatile'],
    releaseDate: '2023-07-01',
    isActive: true,
  },
  {
    id: 'imagen-3',
    name: 'Imagen 3',
    provider: 'Google DeepMind',
    description: 'Google\'s highest quality text-to-image model with photorealistic outputs.',
    tags: ['photorealistic', 'google', 'premium'],
    releaseDate: '2024-05-01',
    isActive: true,
  },
  {
    id: 'flux-pro',
    name: 'FLUX.1 Pro',
    provider: 'Black Forest Labs',
    description: 'Next-generation diffusion model with exceptional prompt following.',
    tags: ['cutting-edge', 'accurate', 'fast'],
    releaseDate: '2024-08-01',
    isActive: true,
  },
  {
    id: 'adobe-firefly-3',
    name: 'Adobe Firefly 3',
    provider: 'Adobe',
    description: 'Commercially safe model trained on licensed content with creative control.',
    tags: ['commercial', 'safe', 'adobe'],
    releaseDate: '2024-04-01',
    isActive: true,
  },
];

// ─── Misc ───────────────────────────────────────────────────────────────────────
export const APP_NAME = 'ModelArena';
export const APP_TAGLINE = 'Where AI Image Models Compete';
export const MAX_RATING = 10;
export const MIN_RATING = 1;
export const ITEMS_PER_PAGE = 12;
