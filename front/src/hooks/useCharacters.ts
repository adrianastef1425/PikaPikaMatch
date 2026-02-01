import { useCallback } from 'react';
import { characterService } from '../services/characterService';
import { useVotingContext } from '../context/VotingContext';
import { ApiError } from '../services/api/errors';

export function useCharacters() {
  const { setCurrentCharacter, setLoading, setError } = useVotingContext();

  const fetchRandomCharacter = useCallback(async () => {
    console.log('[useCharacters] Fetching random character');
    setLoading(true);
    setError(null);

    try {
      const character = await characterService.getRandomCharacter();
      console.log('[useCharacters] Fetched character:', character.name);
      setCurrentCharacter(character);
    } catch (err) {
      let errorMessage = 'Failed to fetch character';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('[useCharacters] Error:', errorMessage);
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
