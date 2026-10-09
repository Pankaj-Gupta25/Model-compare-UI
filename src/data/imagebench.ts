// ─── Criteria & Labels ─────────────────────────────────────────────────────────

export type CriterionKey = 'overall' | 'adherence' | 'realism' | 'visual' | 'visibility' | 'business';

export const CRITERIA: Array<{ key: CriterionKey; label: string; description: string; color: string }> = [
  { key: 'overall',    label: 'Overall Average',      description: 'Mean score across all criteria',                       color: '#6366f1' },
  { key: 'adherence',  label: 'Prompt Adherence',      description: 'How closely the image matches the prompt',             color: '#8b5cf6' },
  { key: 'realism',    label: 'Realism',               description: 'How realistic and photographic the output looks',      color: '#a78bfa' },
  { key: 'visual',     label: 'Visual Quality',        description: 'Overall image aesthetics, lighting, composition',      color: '#7c3aed' },
  { key: 'visibility', label: 'Product Visibility',    description: 'How clearly the product is shown',                     color: '#4f46e5' },
  { key: 'business',   label: 'Business Usability',    description: 'Readiness for real business / catalogue use',          color: '#818cf8' },
];

// ─── Models ────────────────────────────────────────────────────────────────────

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  scores: Record<CriterionKey, number>;
}

export const MODELS: AIModel[] = [
  {
    id: 'nano-banana',
    name: 'Nano Banana 2.1',
    provider: 'Nano AI',
    scores: { overall: 3.91, adherence: 3.91, realism: 3.84, visual: 3.97, visibility: 4.00, business: 3.81 },
  },
  {
    id: 'gemini-flash',
    name: 'Gemini 3.1 Flash Image',
    provider: 'Google DeepMind',
    scores: { overall: 3.69, adherence: 3.88, realism: 3.25, visual: 4.00, visibility: 3.91, business: 3.41 },
  },
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash Image',
    provider: 'Google DeepMind',
    scores: { overall: 3.41, adherence: 3.44, realism: 3.25, visual: 3.53, visibility: 3.69, business: 3.12 },
  },
];

// ─── Product Categories & Prompts ─────────────────────────────────────────────

export type Category = 'Clothing' | 'Food' | 'Jewellery' | 'Handicrafts';

export const CATEGORIES: Category[] = ['Clothing', 'Food', 'Jewellery', 'Handicrafts'];

export const PROMPTS: Record<Category, string> = {
  Clothing:
    'Indian woman wearing a red embroidered kurta with gold details and white palazzo pants, full outfit, natural proportions, neutral studio background and soft professional lighting.',
  Food:
    'Indian butter chicken with naan, basmati rice and mint chutney, realistic textures and proportions, suitable for a food-delivery app.',
  Jewellery:
    'Traditional Indian gold necklace with red and green gemstones, complete necklace, neutral luxury background and realistic gold reflections.',
  Handicrafts:
    'Handmade terracotta coffee mug with traditional geometric patterns, warm minimal tabletop, realistic texture and clean catalogue presentation.',
};

// ─── App meta ──────────────────────────────────────────────────────────────────

export const APP_NAME = 'ImageBench India';
export const APP_SUBTITLE = 'Finding useful AI-generated product images for Indian small businesses';
export const PILOT_META = 'Pilot evaluation · 8 participants · 4 prompts · 12 generated images';
export const MAX_SCORE = 5;
