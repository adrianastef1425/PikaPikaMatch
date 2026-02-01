import type { Character, CharacterStats, EvaluatedCharacter } from '../types';
import type { CharacterDTO, CharacterStatsDTO, VoteResponseDTO } from '../services/api/types';

/**
 * Mapper utilities for transforming backend DTOs to frontend types
 * Handles field name differences and provides default values for optional fields
 */

/**
 * Map backend CharacterDTO to frontend Character
 * Transforms externalId to id and ensures all required fields have values
 */
export function toCharacter(dto: CharacterDTO): Character {
  return {
    id: dto.externalId, // Use externalId as the frontend id
    name: dto.name,
    imageUrl: dto.imageUrl,
    description: dto.description || 'No description available',
    source: dto.source as 'pokemon' | 'rickandmorty' | 'superhero',
  };
}

/**
 * Map backend CharacterStatsDTO to frontend CharacterStats
 * Transforms field names and ensures all statistics are present
 */
export function toCharacterStats(dto: CharacterStatsDTO): CharacterStats {
  return {
    characterId: dto.externalId,
    likes: dto.totalLikes,
    dislikes: dto.totalDislikes,
    totalVotes: dto.totalVotes,
    likePercentage: dto.likePercentage,
    dislikePercentage: dto.dislikePercentage,
  };
}

/**
 * Map backend VoteResponseDTO to frontend EvaluatedCharacter
 * Combines character data with vote information and converts ISO timestamp to Unix timestamp
 */
export function toEvaluatedCharacter(dto: VoteResponseDTO): EvaluatedCharacter {
  return {
    id: dto.characterId,
    name: dto.characterName,
    imageUrl: dto.imageUrl,
    description: dto.description || 'No description available',
    source: dto.characterSource as 'pokemon' | 'rickandmorty' | 'superhero',
    vote: dto.voteType,
    votedAt: new Date(dto.timestamp).getTime(), // Convert ISO string to Unix timestamp
  };
}

/**
 * Combine CharacterDTO and CharacterStatsDTO for stats display
 * Creates both character and stats objects from a single DTO
 */
export function toCharacterWithStats(dto: CharacterStatsDTO): {
  character: Character;
  stats: CharacterStats;
} {
  return {
    character: {
      id: dto.externalId,
      name: dto.name,
      imageUrl: dto.imageUrl,
      description: dto.description || 'No description available',
      source: dto.source as 'pokemon' | 'rickandmorty' | 'superhero',
    },
    stats: {
      characterId: dto.externalId,
      likes: dto.totalLikes,
      dislikes: dto.totalDislikes,
      totalVotes: dto.totalVotes,
      likePercentage: dto.likePercentage,
      dislikePercentage: dto.dislikePercentage,
    },
  };
}
