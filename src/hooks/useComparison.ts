import { useState, useCallback } from 'react';
import type { ComparisonSession } from '../types';
import { comparisonApi } from '../api';

interface UseComparisonReturn {
  session: ComparisonSession | null;
  isLoading: boolean;
  error: string | null;
  startComparison: (prompt: string, modelIds: string[]) => Promise<void>;
  reset: () => void;
}

export const useComparison = (): UseComparisonReturn => {
  const [session, setSession] = useState<ComparisonSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startComparison = useCallback(async (prompt: string, modelIds: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await comparisonApi.create(prompt, modelIds);
      if (result.success) {
        setSession(result.data);
      } else {
        setError(result.error ?? 'Failed to create comparison session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSession(null);
    setError(null);
  }, []);

  return { session, isLoading, error, startComparison, reset };
};
