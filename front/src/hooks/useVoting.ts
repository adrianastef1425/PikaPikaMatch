import { useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { useVotingContext } from '../context/VotingContext';
import type { Vote, EvaluatedCharacter } from '../types';

export function useVoting() {
  const { currentCharacter, addVotedCharacter, setError } = useVotingContext();

  const submitVote = useCallback(async (voteType: 'like' | 'dislike') => {
    if (!currentCharacter) {
      setError('No character to vote on');
      return false;
    }

    setError(null);

    try {
      const vote: Vote = {
        characterId: currentCharacter.id,
        type: voteType,
        timestamp: Date.now(),
      };

      const result = await mockApi.submitVote(vote);

      if (result.success) {
        // Add to voted characters list
        const evaluatedCharacter: EvaluatedCharacter = {
          ...currentCharacter,
          vote: voteType,
          votedAt: vote.timestamp,
        };
        addVotedCharacter(evaluatedCharacter);
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit vote';
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
