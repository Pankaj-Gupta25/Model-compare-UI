import type {
  ApiResponse,
  PaginatedResponse,
  LeaderboardEntry,
  ComparisonSession,
  Rating,
  AIModel,
} from '../types';
import { SAMPLE_MODELS } from '../utils/constants';
import { generateMockLeaderboard } from '../utils/helpers';

// ─── Simulated API delay ────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── Models API ─────────────────────────────────────────────────────────────────
export const modelsApi = {
  getAll: async (): Promise<ApiResponse<AIModel[]>> => {
    await delay(400);
    return { success: true, data: SAMPLE_MODELS };
  },
  getById: async (id: string): Promise<ApiResponse<AIModel | undefined>> => {
    await delay(300);
    return { success: true, data: SAMPLE_MODELS.find((m) => m.id === id) };
  },
};

// ─── Leaderboard API ───────────────────────────────────────────────────────────
export const leaderboardApi = {
  get: async (): Promise<ApiResponse<LeaderboardEntry[]>> => {
    await delay(600);
    return { success: true, data: generateMockLeaderboard() };
  },
};

// ─── Comparison API ─────────────────────────────────────────────────────────────
export const comparisonApi = {
  create: async (prompt: string, modelIds: string[]): Promise<ApiResponse<ComparisonSession>> => {
    await delay(800);
    const session: ComparisonSession = {
      id: `session-${Date.now()}`,
      prompt,
      modelIds,
      images: modelIds.map((modelId) => ({
        id: `img-${modelId}-${Date.now()}`,
        modelId,
        prompt,
        imageUrl: `https://picsum.photos/seed/${modelId}-${Date.now()}/512/512`,
        generatedAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    return { success: true, data: session };
  },
};

// ─── Ratings API ────────────────────────────────────────────────────────────────
export const ratingsApi = {
  submit: async (rating: Omit<Rating, 'id' | 'createdAt'>): Promise<ApiResponse<Rating>> => {
    await delay(500);
    const saved: Rating = {
      ...rating,
      id: `rating-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: saved };
  },

  getForModel: async (modelId: string): Promise<PaginatedResponse<Rating>> => {
    await delay(400);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: 12,
      hasNextPage: false,
    };
    void modelId;
  },
};
