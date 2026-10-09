import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from '../api';

export const useLeaderboard = () =>
  useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardApi.get(),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
