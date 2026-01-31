import { useState, useCallback, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import type { CharacterStats, EvaluatedCharacter, Character } from '../types';

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
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all statistics in parallel
      const [favoritesStats, controversialStats, recentVotes] = await Promise.all([
        mockApi.getFavorites(3),
        mockApi.getControversial(2),
        mockApi.getRecentVotes(4),
      ]);

      // Map character IDs to full character objects
      const favorites = favoritesStats.map(stats => {
        const character = mockApi.getCharacterById(stats.characterId);
        if (!character) {
          throw new Error(`Character with id ${stats.characterId} not found`);
        }
        return { character, stats };
      });

      const controversial = controversialStats.map(stats => {
        const character = mockApi.getCharacterById(stats.characterId);
        if (!character) {
          throw new Error(`Character with id ${stats.characterId} not found`);
        }
        return { character, stats };
      });

      setStats({
        favorites,
        controversial,
        recentlyEvaluated: recentVotes,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
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
