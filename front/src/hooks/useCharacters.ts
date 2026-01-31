import { useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { useVotingContext } from '../context/VotingContext';

export function useCharacters() {
  const { setCurrentCharacter, setLoading, setError } = useVotingContext();

  const fetchRandomCharacter = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const character = await mockApi.getRandomCharacter();
      setCurrentCharacter(character);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch character';
      setError(errorMessage);
      setCurrentCharacter(null);
    } finally {
      setLoading(false);
    }
  }, [setCurrentCharacter, setLoading, setError]);

  return {
    fetchRandomCharacter,
  };
}
