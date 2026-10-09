// ─── Model Types ───────────────────────────────────────────────────────────────

export type ModelId = string;

export interface AIModel {
  id: ModelId;
  name: string;
  provider: string;
  description: string;
  logoUrl?: string;
  tags: string[];
  releaseDate: string;
  isActive: boolean;
}

// ─── Image Types ───────────────────────────────────────────────────────────────

export interface GeneratedImage {
  id: string;
  modelId: ModelId;
  prompt: string;
  imageUrl: string;
  thumbnailUrl?: string;
  generatedAt: string;
  metadata?: Record<string, unknown>;
}

// ─── Rating Types ──────────────────────────────────────────────────────────────

export type RatingCriteria = 'quality' | 'accuracy' | 'creativity' | 'detail' | 'overall';

export interface Rating {
  id: string;
  imageId: string;
  modelId: ModelId;
  userId?: string;
  scores: Record<RatingCriteria, number>; // 1–10
  comment?: string;
  createdAt: string;
}

export interface AggregatedRating {
  modelId: ModelId;
  totalRatings: number;
  averageScores: Record<RatingCriteria, number>;
  overallScore: number;
}

// ─── Comparison Types ──────────────────────────────────────────────────────────

export interface ComparisonSession {
  id: string;
  prompt: string;
  modelIds: ModelId[];
  images: GeneratedImage[];
  createdAt: string;
  status: 'pending' | 'active' | 'completed';
}

export interface ComparisonResult {
  sessionId: string;
  winner?: ModelId;
  rankings: Array<{ modelId: ModelId; rank: number; score: number }>;
  totalVotes: number;
}

// ─── Leaderboard Types ─────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  model: AIModel;
  aggregatedRating: AggregatedRating;
  winRate: number;
  totalComparisons: number;
  trend: 'up' | 'down' | 'stable';
}

// ─── UI / Filter Types ─────────────────────────────────────────────────────────

export type SortField = 'overall' | 'quality' | 'accuracy' | 'creativity' | 'detail' | 'winRate';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  sortField: SortField;
  sortOrder: SortOrder;
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}
