import { useState, useCallback, useEffect } from 'react';
import { statsService } from '../services/statsService';
import { voteService } from '../services/voteService';
import type { CharacterStats, EvaluatedCharacter, Character } from '../types';
import { ApiError, NotFoundError } from '../services/api/errors';

interface StatsData {
  favorites: Array<{ character: Character; stats: CharacterStats }>;
  controversial: Array<{ character: Character; stats: CharacterStats }>;
  recentlyEvaluated: EvaluatedCharacter[];
}

export function useStats() {
  const [stats, setStats] = useState<StatsData>({
    favorites: [],
    controversial: [],
    recentlyEvaluated: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    console.log('[useStats] Fetching statistics');
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all statistics in parallel
      const [favorites, controversial, recentVotes] = await Promise.all([
        statsService.getTopLiked(3).catch(err => {
          if (err instanceof NotFoundError) return [];
          throw err;
        }),
        statsService.getTopDisliked(2).catch(err => {
          if (err instanceof NotFoundError) return [];
          throw err;
        }),
        voteService.getRecentVotes(4).catch(err => {
          if (err instanceof NotFoundError) return [];
          throw err;
        }),
      ]);

      setStats({
        favorites,
        controversial,
        recentlyEvaluated: recentVotes,
      });
      
      console.log('[useStats] Statistics fetched successfully');
    } catch (err) {
      let errorMessage = 'Failed to fetch statistics';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('[useStats] Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
