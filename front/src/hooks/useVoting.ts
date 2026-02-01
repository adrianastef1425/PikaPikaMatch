import { useCallback } from 'react';
import { voteService } from '../services/voteService';
import { useVotingContext } from '../context/VotingContext';
import type { EvaluatedCharacter } from '../types';
import { ApiError } from '../services/api/errors';

export function useVoting() {
  const { currentCharacter, addVotedCharacter, setError } = useVotingContext();

  const submitVote = useCallback(async (voteType: 'like' | 'dislike') => {
    if (!currentCharacter) {
      setError('No character to vote on');
      return false;
    }

    setError(null);

    try {
      const result = await voteService.submitVote(currentCharacter, voteType);

      if (result.success) {
        // Add to voted characters list
        const evaluatedCharacter: EvaluatedCharacter = {
          ...currentCharacter,
          vote: voteType,
          votedAt: Date.now(),
        };
        addVotedCharacter(evaluatedCharacter);
        return true;
      }

      return false;
    } catch (err) {
      let errorMessage = 'Failed to submit vote';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('[useVoting] Error:', errorMessage);
      setError(errorMessage);
      return false;
    }
  }, [currentCharacter, addVotedCharacter, setError]);

  const handleLike = useCallback(async () => {
    return await submitVote('like');
  }, [submitVote]);

  const handleDislike = useCallback(async () => {
    return await submitVote('dislike');
  }, [submitVote]);

  return {
    submitVote,
    handleLike,
    handleDislike,
  };
}
