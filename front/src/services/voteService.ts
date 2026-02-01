import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';
import type { VoteRequestDTO, VoteResponseDTO } from './api/types';
import type { Character, EvaluatedCharacter } from '../types';
import { toEvaluatedCharacter } from '../utils/mappers';

/**
 * Vote Service
 * Handles all vote-related API operations
 */
export const voteService = {
  /**
   * Submit a vote for a character
   * @param character - The character being voted on
   * @param voteType - 'like' or 'dislike'
   * @returns Promise<{ success: boolean }> - Vote submission result
   */
  async submitVote(
    character: Character,
    voteType: 'like' | 'dislike'
  ): Promise<{ success: boolean }> {
    const payload: VoteRequestDTO = {
      characterId: character.id,
      characterName: character.name,
      characterSource: character.source,
      voteType,
      imageUrl: character.imageUrl,
      description: character.description,
    };

    await apiClient.post<VoteResponseDTO>(
      API_ENDPOINTS.votes.create,
      payload
    );

    return { success: true };
  },

  /**
   * Get recently voted characters
   * @param limit - Maximum number of recent votes to retrieve (default: 10)
   * @returns Promise<EvaluatedCharacter[]> - Array of recently evaluated characters
   */
  async getRecentVotes(limit: number = 10): Promise<EvaluatedCharacter[]> {
    const dtos = await apiClient.get<VoteResponseDTO[]>(
      API_ENDPOINTS.votes.recent,
      { limit }
    );

    return dtos.map(toEvaluatedCharacter);
  },

  /**
   * Get the last evaluated character
   * @returns Promise<EvaluatedCharacter | null> - Last evaluated character or null if none exists
   */
  async getLastEvaluated(): Promise<EvaluatedCharacter | null> {
    try {
      const dto = await apiClient.get<VoteResponseDTO>(
        API_ENDPOINTS.votes.last
      );
      return toEvaluatedCharacter(dto);
    } catch (error: any) {
      // Handle 404 gracefully - no votes exist yet
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
};
