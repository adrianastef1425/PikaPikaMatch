import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';
import type { CharacterStatsDTO } from './api/types';
import type { Character, CharacterStats } from '../types';
import { toCharacterWithStats } from '../utils/mappers';

/**
 * Stats Service
 * Handles all statistics-related API operations
 */
export const statsService = {
  /**
   * Get top liked characters
   * Always fetches fresh data from backend
   * @param limit - Maximum number of characters to retrieve (default: 5)
   * @returns Promise<Array<{ character: Character; stats: CharacterStats }>> - Top liked characters with stats
   */
  async getTopLiked(
    limit: number = 5
  ): Promise<Array<{ character: Character; stats: CharacterStats }>> {
    console.log('[statsService] Fetching top liked from backend');
    try {
      const dtos = await apiClient.get<CharacterStatsDTO[]>(
        API_ENDPOINTS.stats.topLiked,
        { limit }
      );

      return dtos.map(toCharacterWithStats);
    } catch (error: any) {
      // Handle 404 gracefully - no data available yet
      if (error.statusCode === 404) {
        console.log('[statsService] No top liked data available (404)');
        return [];
      }
      throw error;
    }
  },

  /**
   * Get top disliked characters
   * Always fetches fresh data from backend
   * @param limit - Maximum number of characters to retrieve (default: 5)
   * @returns Promise<Array<{ character: Character; stats: CharacterStats }>> - Top disliked characters with stats
   */
  async getTopDisliked(
    limit: number = 5
  ): Promise<Array<{ character: Character; stats: CharacterStats }>> {
    console.log('[statsService] Fetching top disliked from backend');
    try {
      const dtos = await apiClient.get<CharacterStatsDTO[]>(
        API_ENDPOINTS.stats.topDisliked,
        { limit }
      );

      return dtos.map(toCharacterWithStats);
    } catch (error: any) {
      // Handle 404 gracefully - no data available yet
      if (error.statusCode === 404) {
        console.log('[statsService] No top disliked data available (404)');
        return [];
      }
      throw error;
    }
  },

  /**
   * Get most liked character
   * @returns Promise<{ character: Character; stats: CharacterStats } | null> - Most liked character or null if none exists
   */
  async getMostLiked(): Promise<{ character: Character; stats: CharacterStats } | null> {
    console.log('[statsService] Fetching most liked from backend');
    try {
      const dto = await apiClient.get<CharacterStatsDTO>(
        API_ENDPOINTS.stats.mostLiked
      );
      return toCharacterWithStats(dto);
    } catch (error: any) {
      // Handle 404 gracefully - no data available yet
      if (error.statusCode === 404) {
        console.log('[statsService] No most liked data available (404)');
        return null;
      }
      throw error;
    }
  },

  /**
   * Get most disliked character
   * @returns Promise<{ character: Character; stats: CharacterStats } | null> - Most disliked character or null if none exists
   */
  async getMostDisliked(): Promise<{ character: Character; stats: CharacterStats } | null> {
    console.log('[statsService] Fetching most disliked from backend');
    try {
      const dto = await apiClient.get<CharacterStatsDTO>(
        API_ENDPOINTS.stats.mostDisliked
      );
      return toCharacterWithStats(dto);
    } catch (error: any) {
      // Handle 404 gracefully - no data available yet
      if (error.statusCode === 404) {
        console.log('[statsService] No most disliked data available (404)');
        return null;
      }
      throw error;
    }
  },
};
