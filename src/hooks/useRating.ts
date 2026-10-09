import { useState, useCallback } from 'react';
import type { Rating, RatingCriteria } from '../types';
import { ratingsApi } from '../api';
import { MIN_RATING } from '../utils/constants';

interface UseRatingReturn {
  isSubmitting: boolean;
  submitted: boolean;
  error: string | null;
  submitRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => Promise<void>;
  reset: () => void;
}

export const useRating = (): UseRatingReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRating = useCallback(async (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    // Validate all criteria are rated
    const allRated = (Object.keys(rating.scores) as RatingCriteria[]).every(
      (k) => rating.scores[k] >= MIN_RATING,
    );
    if (!allRated) {
      setError('Please rate all criteria before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await ratingsApi.submit(rating);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError('Failed to submit rating. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSubmitted(false);
    setError(null);
  }, []);

  return { isSubmitting, submitted, error, submitRating, reset };
};
