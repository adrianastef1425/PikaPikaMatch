import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';
import type { CharacterDTO } from './api/types';
import type { Character } from '../types';
import { toCharacter } from '../utils/mappers';

/**
 * Character Service
 * Handles all character-related API operations
 */
export const characterService = {
  /**
   * Fetch a random character from the backend
   * @returns Promise<Character> - A random character from any source
   */
  async getRandomCharacter(): Promise<Character> {
    const dto = await apiClient.get<CharacterDTO>(
      API_ENDPOINTS.characters.random
    );
    return toCharacter(dto);
  },

  /**
   * Fetch Pikachu's status
   * @returns Promise<Character> - Pikachu character data
   */
  async getPikachuStatus(): Promise<Character> {
    const dto = await apiClient.get<CharacterDTO>(
      API_ENDPOINTS.characters.pikachu
    );
    return toCharacter(dto);
  },
};
