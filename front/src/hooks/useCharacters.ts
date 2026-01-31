import { useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { useVotingContext } from '../context/VotingContext';

export function useCharacters() {
  const { setCurrentCharacter, setLoading, setError } = useVotingContext();

  const fetchRandomCharacter = useCallback(async () => {
    console.log('fetchRandomCharacter called');
    setLoading(true);
    setError(null);

    try {
      const character = await mockApi.getRandomCharacter();
      console.log('Fetched character:', character.name);
      setCurrentCharacter(character);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch character';
      console.error('Error fetching character:', errorMessage);
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
