# Design Document - Frontend-Backend Integration

## Overview

Este documento describe el diseño de la integración entre el frontend React/TypeScript de PikaPikaMatch y el backend REST API Java/Spring Boot. La integración reemplazará el sistema de APIs mock actual con un cliente HTTP real que se comunica con los endpoints del backend, implementando manejo robusto de errores, estados de carga, y optimizaciones de rendimiento mediante caching.

La arquitectura seguirá el patrón de Service Layer, donde un API Client centralizado maneja todas las comunicaciones HTTP, y los servicios específicos de dominio (CharacterService, VoteService, StatsService) consumen este cliente. Los hooks personalizados existentes se actualizarán para usar los servicios reales en lugar de los mocks.

## Architecture

### Technology Stack

- **HTTP Client**: Axios (para mejor manejo de errores y interceptors)
- **Environment Management**: Vite environment variables
- **Type Safety**: TypeScript interfaces para request/response
- **Error Handling**: Custom error classes y error boundaries
- **State Management**: React Context API (sin cambios)
- **Caching**: Simple in-memory cache con TTL

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
│  (VotingView, DexView, CharacterCard, etc.)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   Custom Hooks Layer                         │
│  (useCharacters, useVoting, useStats)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
│  (characterService, voteService, statsService)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Client                                 │
│  (apiClient with interceptors, error handling)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                Backend REST API                              │
│  (Spring Boot - Java)                                        │
└─────────────────────────────────────────────────────────────┘
```


### Project Structure Changes

```
front/src/
├── services/
│   ├── api/
│   │   ├── apiClient.ts          # Axios instance with interceptors
│   │   ├── config.ts              # API configuration and base URL
│   │   ├── types.ts               # Backend DTO types
│   │   └── errors.ts              # Custom error classes
│   ├── characterService.ts        # Character-related API calls
│   ├── voteService.ts             # Vote-related API calls
│   └── statsService.ts            # Statistics API calls
├── hooks/
│   ├── useCharacters.ts           # Updated to use real API
│   ├── useVoting.ts               # Updated to use real API
│   └── useStats.ts                # Updated to use real API
├── types/
│   ├── index.ts                   # Frontend types (existing)
│   └── backend.ts                 # Backend response types
└── utils/
    ├── mappers.ts                 # DTO to frontend type mappers
    └── validators.ts              # Response validators

# Files to be removed:
├── services/
│   └── mockApi.ts                 # DELETE
```

## Components and Interfaces

### 1. API Client (apiClient.ts)

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { ApiError, NetworkError, ValidationError } from './errors';

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status}`, response.data);
        return response.data; // Extract data from ApiResponse wrapper
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }
  
  private handleError(error: AxiosError): Error {
    if (!error.response) {
      return new NetworkError('Network error - please check your connection');
    }
    
    const status = error.response.status;
    const data = error.response.data as any;
    
    switch (status) {
      case 400:
        return new ValidationError(data.message || 'Invalid request');
      case 404:
        return new ApiError(data.message || 'Resource not found', status);
      case 503:
        return new ApiError('Service temporarily unavailable', status);
      default:
        return new ApiError(data.message || 'An error occurred', status);
    }
  }
  
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```


### 2. API Configuration (config.ts)

```typescript
const getBaseURL = (): string => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  
  if (envURL) {
    return envURL.endsWith('/') ? envURL.slice(0, -1) : envURL;
  }
  
  return 'http://localhost:8080/api';
};

export const API_CONFIG = {
  baseURL: getBaseURL(),
  timeout: 10000, // 10 seconds
  retryAttempts: 2,
  retryDelay: 1000,
} as const;

export const API_ENDPOINTS = {
  characters: {
    random: '/characters/random',
    pikachu: '/characters/pikachu',
  },
  votes: {
    create: '/votes',
    recent: '/votes/recent',
    last: '/votes/last',
  },
  stats: {
    mostLiked: '/stats/most-liked',
    mostDisliked: '/stats/most-disliked',
    topLiked: '/stats/top-liked',
    topDisliked: '/stats/top-disliked',
  },
} as const;
```

### 3. Custom Error Classes (errors.ts)

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, 0, true);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, false);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404, false);
    this.name = 'NotFoundError';
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(message: string) {
    super(message, 503, true);
    this.name = 'ServiceUnavailableError';
  }
}
```

### 4. Backend Types (types.ts)

```typescript
// Backend response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Backend DTOs
export interface CharacterDTO {
  id: string;
  externalId: string;
  name: string;
  source: string;
  imageUrl: string;
  description: string;
}

export interface VoteRequestDTO {
  characterId: string;
  characterName: string;
  characterSource: string;
  voteType: 'like' | 'dislike';
  imageUrl: string;
  description?: string;
}

export interface VoteResponseDTO {
  voteId: string;
  characterId: string;
  characterName: string;
  characterSource: string;
  imageUrl: string;
  description: string;
  voteType: 'like' | 'dislike';
  timestamp: string;
}

export interface CharacterStatsDTO {
  id: string;
  externalId: string;
  name: string;
  source: string;
  imageUrl: string;
  description: string;
  totalLikes: number;
  totalDislikes: number;
  totalVotes: number;
  likePercentage: number;
  dislikePercentage: number;
}
```


### 5. Data Mappers (mappers.ts)

```typescript
import type { Character, CharacterStats, EvaluatedCharacter } from '../types';
import type { CharacterDTO, CharacterStatsDTO, VoteResponseDTO } from '../types/backend';

export const mappers = {
  /**
   * Map backend CharacterDTO to frontend Character
   */
  toCharacter(dto: CharacterDTO): Character {
    return {
      id: dto.externalId, // Use externalId as the frontend id
      name: dto.name,
      imageUrl: dto.imageUrl,
      description: dto.description || 'No description available',
      source: dto.source as 'pokemon' | 'rickandmorty' | 'superhero',
    };
  },

  /**
   * Map backend CharacterStatsDTO to frontend CharacterStats
   */
  toCharacterStats(dto: CharacterStatsDTO): CharacterStats {
    return {
      characterId: dto.externalId,
      likes: dto.totalLikes,
      dislikes: dto.totalDislikes,
      totalVotes: dto.totalVotes,
      likePercentage: dto.likePercentage,
      dislikePercentage: dto.dislikePercentage,
    };
  },

  /**
   * Map backend VoteResponseDTO to frontend EvaluatedCharacter
   */
  toEvaluatedCharacter(dto: VoteResponseDTO): EvaluatedCharacter {
    return {
      id: dto.characterId,
      name: dto.characterName,
      imageUrl: dto.imageUrl,
      description: dto.description || 'No description available',
      source: dto.characterSource as 'pokemon' | 'rickandmorty' | 'superhero',
      vote: dto.voteType,
      votedAt: new Date(dto.timestamp).getTime(),
    };
  },

  /**
   * Combine CharacterDTO and CharacterStatsDTO for stats display
   */
  toCharacterWithStats(dto: CharacterStatsDTO): {
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
  },
};
```

### 6. Character Service (characterService.ts)

```typescript
import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';
import type { CharacterDTO } from './api/types';
import type { Character } from '../types';
import { mappers } from '../utils/mappers';

export const characterService = {
  /**
   * Fetch a random character from the backend
   */
  async getRandomCharacter(): Promise<Character> {
    const dto = await apiClient.get<CharacterDTO>(
      API_ENDPOINTS.characters.random
    );
    return mappers.toCharacter(dto);
  },

  /**
   * Fetch Pikachu's status (for future use)
   */
  async getPikachuStatus(): Promise<Character> {
    const dto = await apiClient.get<CharacterDTO>(
      API_ENDPOINTS.characters.pikachu
    );
    return mappers.toCharacter(dto);
  },
};
```


### 7. Vote Service (voteService.ts)

```typescript
import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';
import type { VoteRequestDTO, VoteResponseDTO } from './api/types';
import type { Character, EvaluatedCharacter } from '../types';
import { mappers } from '../utils/mappers';

export const voteService = {
  /**
   * Submit a vote for a character
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
   */
  async getRecentVotes(limit: number = 10): Promise<EvaluatedCharacter[]> {
    const dtos = await apiClient.get<VoteResponseDTO[]>(
      API_ENDPOINTS.votes.recent,
      { limit }
    );

    return dtos.map(mappers.toEvaluatedCharacter);
  },

  /**
   * Get the last evaluated character
   */
  async getLastEvaluated(): Promise<EvaluatedCharacter | null> {
    try {
      const dto = await apiClient.get<VoteResponseDTO>(
        API_ENDPOINTS.votes.last
      );
      return mappers.toEvaluatedCharacter(dto);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
};
```

### 8. Stats Service (statsService.ts)

```typescript
import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';
import type { CharacterStatsDTO } from './api/types';
import type { Character, CharacterStats } from '../types';
import { mappers } from '../utils/mappers';

export const statsService = {
  /**
   * Get top liked characters
   * Always fetches fresh data from backend
   */
  async getTopLiked(
    limit: number = 5
  ): Promise<Array<{ character: Character; stats: CharacterStats }>> {
    console.log('[statsService] Fetching top liked from backend');
    const dtos = await apiClient.get<CharacterStatsDTO[]>(
      API_ENDPOINTS.stats.topLiked,
      { limit }
    );

    return dtos.map(mappers.toCharacterWithStats);
  },

  /**
   * Get top disliked characters
   * Always fetches fresh data from backend
   */
  async getTopDisliked(
    limit: number = 5
  ): Promise<Array<{ character: Character; stats: CharacterStats }>> {
    console.log('[statsService] Fetching top disliked from backend');
    const dtos = await apiClient.get<CharacterStatsDTO[]>(
      API_ENDPOINTS.stats.topDisliked,
      { limit }
    );

    return dtos.map(mappers.toCharacterWithStats);
  },

  /**
   * Get most liked character
   */
  async getMostLiked(): Promise<{ character: Character; stats: CharacterStats } | null> {
    try {
      const dto = await apiClient.get<CharacterStatsDTO>(
        API_ENDPOINTS.stats.mostLiked
      );
      return mappers.toCharacterWithStats(dto);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get most disliked character
   */
  async getMostDisliked(): Promise<{ character: Character; stats: CharacterStats } | null> {
    try {
      const dto = await apiClient.get<CharacterStatsDTO>(
        API_ENDPOINTS.stats.mostDisliked
      );
      return mappers.toCharacterWithStats(dto);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
};
```


### 9. Updated useCharacters Hook

```typescript
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
```

### 10. Updated useVoting Hook

```typescript
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
```


### 11. Updated useStats Hook

```typescript
import { useState, useCallback, useEffect } from 'react';
import { statsService } from '../services/statsService';
import { voteService } from '../services/voteService';
import type { CharacterStats, EvaluatedCharacter, Character } from '../types';
import { ApiError, NotFoundError } from '../services/api/errors';

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
    console.log('[useStats] Fetching statistics');
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all statistics in parallel
      const [favorites, controversial, recentVotes] = await Promise.all([
        statsService.getTopLiked(3).catch(err => {
          if (err instanceof NotFoundError) return [];
          throw err;
        }),
        statsService.getTopDisliked(2).catch(err => {
          if (err instanceof NotFoundError) return [];
          throw err;
        }),
        voteService.getRecentVotes(4).catch(err => {
          if (err instanceof NotFoundError) return [];
          throw err;
        }),
      ]);

      setStats({
        favorites,
        controversial,
        recentlyEvaluated: recentVotes,
      });
      
      console.log('[useStats] Statistics fetched successfully');
    } catch (err) {
      let errorMessage = 'Failed to fetch statistics';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('[useStats] Error:', errorMessage);
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
```

## Data Models

### Frontend Types (No Changes)

The existing frontend types in `types/index.ts` remain unchanged:

```typescript
export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  source: 'pokemon' | 'rickandmorty' | 'superhero';
}

export interface Vote {
  characterId: string;
  type: 'like' | 'dislike';
  timestamp: number;
}

export interface EvaluatedCharacter extends Character {
  vote: 'like' | 'dislike';
  votedAt: number;
}

export interface CharacterStats {
  characterId: string;
  likes: number;
  dislikes: number;
  totalVotes: number;
  likePercentage: number;
  dislikePercentage: number;
}
```

### Backend Response Types

New file `types/backend.ts` contains backend-specific types as documented in the Components section above.

### Type Mapping Strategy

1. **Character Mapping**: Backend `externalId` → Frontend `id`
2. **Source Mapping**: Backend string → Frontend union type with validation
3. **Timestamp Mapping**: Backend ISO string → Frontend Unix timestamp
4. **Stats Mapping**: Direct mapping with field name adjustments


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Base URL configuration
*For any* environment configuration, the API client SHALL use the VITE_API_BASE_URL environment variable if set, otherwise default to "http://localhost:8080/api"
**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Base URL trailing slash removal
*For any* configured base URL ending with a trailing slash, the system SHALL remove it before making requests
**Validates: Requirements 1.5**

### Property 3: Character fetch and transformation
*For any* successful response from /characters/random endpoint, the system SHALL transform the CharacterDTO to a frontend Character interface
**Validates: Requirements 2.2, 11.1**

### Property 4: Character display completeness
*For any* character received from the backend, the system SHALL display it with image, name, description, and source
**Validates: Requirements 2.3**

### Property 5: Service unavailable error handling
*For any* backend response with HTTP status 503, the system SHALL display an error message indicating external services are temporarily unavailable
**Validates: Requirements 2.4**

### Property 6: Network retry logic
*For any* request that fails due to network error, the system SHALL retry up to 2 times before showing an error message
**Validates: Requirements 2.5**

### Property 7: Vote payload completeness
*For any* vote submission, the system SHALL send characterId, characterName, characterSource, voteType, imageUrl, and description to the backend
**Validates: Requirements 3.1, 3.2**

### Property 8: Vote success handling
*For any* backend response with HTTP status 201 for a vote, the system SHALL proceed with vote animation and load the next character
**Validates: Requirements 3.3**

### Property 9: Vote validation error display
*For any* backend response with HTTP status 400 for a vote, the system SHALL display an error message indicating invalid vote data
**Validates: Requirements 3.4**

### Property 10: Statistics fetch and transformation
*For any* successful response from stats endpoints, the system SHALL transform CharacterStatsDTO to frontend CharacterStats interface
**Validates: Requirements 4.3, 11.3**

### Property 11: Statistics display with percentages
*For any* statistics received from the backend, the system SHALL display them with like/dislike percentages
**Validates: Requirements 4.4**

### Property 12: Statistics not found handling
*For any* backend response with HTTP status 404 for statistics, the system SHALL display a message indicating no data is available yet
**Validates: Requirements 4.5**

### Property 13: Recent votes transformation
*For any* successful response from /votes/recent endpoint, the system SHALL transform VoteResponseDTO array to EvaluatedCharacter array
**Validates: Requirements 5.2, 11.2**

### Property 14: Recent votes chronological display
*For any* recent votes displayed, the system SHALL show them in reverse chronological order
**Validates: Requirements 5.3**

### Property 15: Loading indicator display
*For any* API request initiated, the system SHALL display a loading spinner or skeleton UI
**Validates: Requirements 6.1**

### Property 16: Loading indicator removal
*For any* API response received, the system SHALL remove the loading indicator and display content
**Validates: Requirements 6.5**

### Property 17: Vote button disabling during submission
*For any* vote being submitted, the system SHALL disable vote buttons and show a loading indicator
**Validates: Requirements 6.4**

### Property 18: Network error message clarity
*For any* network error, the system SHALL display a user-friendly message indicating connection problems
**Validates: Requirements 7.1**

### Property 19: Backend error message display
*For any* backend response with HTTP status 400, the system SHALL display the error message from the backend response
**Validates: Requirements 7.2**

### Property 20: Not found error message
*For any* backend response with HTTP status 404, the system SHALL display a message indicating the requested resource was not found
**Validates: Requirements 7.3**

### Property 21: Server error message
*For any* backend response with HTTP status 500, the system SHALL display a generic error message and suggest trying again later
**Validates: Requirements 7.4**

### Property 22: Retry button availability
*For any* error message displayed, the system SHALL provide a "Retry" button to attempt the operation again
**Validates: Requirements 7.5**

### Property 23: Default headers configuration
*For any* API request made, the system SHALL automatically include Content-Type application/json header
**Validates: Requirements 8.1**

### Property 24: Base URL prefix inclusion
*For any* API request made, the system SHALL automatically include the base URL prefix
**Validates: Requirements 8.2**

### Property 25: JSON parsing and data extraction
*For any* response received, the system SHALL parse JSON automatically and extract the data field from ApiResponse wrapper
**Validates: Requirements 8.3**

### Property 26: HTTP error custom exception
*For any* HTTP error, the system SHALL throw a custom error with status code and message from the backend
**Validates: Requirements 8.4**

### Property 27: Request timeout enforcement
*For any* request, the system SHALL abort it after 10 seconds and throw a timeout error
**Validates: Requirements 8.5**

### Property 28: CORS error detection
*For any* CORS error, the system SHALL detect it and display a specific error message indicating a configuration issue
**Validates: Requirements 9.1**

### Property 29: Server unreachable message
*For any* situation where the backend is not accessible, the system SHALL display a message indicating the server is not reachable
**Validates: Requirements 9.2**

### Property 30: Mock code removal
*For any* integration completion, the system SHALL have removed all mock API service files and mock data generators
**Validates: Requirements 10.1, 10.2**

### Property 31: Service imports update
*For any* integration completion, the system SHALL have updated all service imports to use the real API client
**Validates: Requirements 10.3**

### Property 32: LocalStorage cleanup
*For any* integration completion, the system SHALL have removed localStorage-based persistence used by mocks
**Validates: Requirements 10.4**

### Property 33: Field name transformation
*For any* response where field names differ between backend and frontend, the system SHALL transform them appropriately
**Validates: Requirements 11.4**

### Property 34: Default values for missing fields
*For any* optional fields missing in the response, the system SHALL provide default values to maintain type safety
**Validates: Requirements 11.5**

### Property 35: Offline indicator display
*For any* network connection loss, the system SHALL detect it and display an offline indicator
**Validates: Requirements 12.1**

### Property 36: Offline action prevention
*For any* user action attempted while offline, the system SHALL display a message indicating no connection is available
**Validates: Requirements 12.2**

### Property 37: Automatic retry on reconnection
*For any* network connection restoration, the system SHALL automatically retry pending operations
**Validates: Requirements 12.3**

### Property 38: Request logging
*For any* API request initiated, the system SHALL log the HTTP method, endpoint, and request payload
**Validates: Requirements 13.1**

### Property 39: Response logging
*For any* API response received, the system SHALL log the status code, response time, and response data
**Validates: Requirements 13.2**

### Property 40: Error logging
*For any* API error, the system SHALL log the error type, status code, and error message
**Validates: Requirements 13.3**

### Property 41: Image URL validation
*For any* character image URL received, the system SHALL validate that it is a valid URL
**Validates: Requirements 14.1**

### Property 42: Image placeholder display
*For any* image loading, the system SHALL display a placeholder or skeleton
**Validates: Requirements 14.2**

### Property 43: Image fallback on error
*For any* image that fails to load, the system SHALL display a fallback placeholder image
**Validates: Requirements 14.3**


## Error Handling

### Error Hierarchy

```typescript
ApiError (base)
├── NetworkError (network failures, retryable)
├── ValidationError (400 errors, not retryable)
├── NotFoundError (404 errors, not retryable)
└── ServiceUnavailableError (503 errors, retryable)
```

### Error Handling Strategy

1. **Network Errors**: Display connection message, enable retry, mark as retryable
2. **Validation Errors (400)**: Display backend message, no retry
3. **Not Found (404)**: Display "no data" message, graceful degradation
4. **Service Unavailable (503)**: Display temporary unavailability message, enable retry
5. **Server Errors (500)**: Display generic message, enable retry
6. **Timeout Errors**: Display timeout message, enable retry
7. **CORS Errors**: Display configuration issue message, log details

### Error Display Components

```typescript
// ErrorMessage component
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

// Usage in components
{error && (
  <ErrorMessage 
    message={error} 
    onRetry={refetch}
    type="error"
  />
)}
```

### Error Logging

- Development: Log all errors with full details
- Production: Log only error type and status code
- Console logging for debugging
- Future: Integration with error tracking service (Sentry, etc.)

## Testing Strategy

### Unit Testing

**API Client Tests**:
- Test request interceptor adds correct headers
- Test response interceptor extracts data correctly
- Test error handling for different status codes
- Test timeout enforcement
- Test base URL configuration

**Service Tests**:
- Test characterService.getRandomCharacter() calls correct endpoint
- Test voteService.submitVote() sends correct payload
- Test statsService caching behavior
- Test mapper functions transform data correctly
- Mock axios for all service tests

**Hook Tests**:
- Test useCharacters hook updates state correctly
- Test useVoting hook handles errors appropriately
- Test useStats hook fetches and caches data
- Mock services for all hook tests

**Mapper Tests**:
- Test toCharacter() maps all fields correctly
- Test toCharacterStats() calculates percentages
- Test toEvaluatedCharacter() handles timestamps
- Test default values for missing fields

### Integration Testing

**API Integration Tests** (using MSW):
- Mock backend responses for all endpoints
- Test complete flow: fetch character → vote → fetch stats
- Test error scenarios with mocked error responses
- Test retry logic with intermittent failures
- Test cache invalidation after voting

**Component Integration Tests**:
- Test VotingView fetches and displays character
- Test DexView fetches and displays statistics
- Test error states render correctly
- Test loading states display properly

### E2E Testing (Optional)

- Test complete user flow with real backend
- Test offline/online transitions
- Test error recovery scenarios

### Testing Tools

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "msw": "^2.0.0",
    "axios-mock-adapter": "^1.22.0"
  }
}
```

### Test Coverage Goals

- API Client: 90%+
- Services: 85%+
- Mappers: 95%+
- Hooks: 80%+
- Overall: 85%+


## Configuration

### Environment Variables

Create `.env` file in frontend root:

```bash
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Optional: Enable debug logging
VITE_DEBUG_API=true
```

Create `.env.production` for production:

```bash
VITE_API_BASE_URL=https://api.pikapikamatch.com/api
VITE_DEBUG_API=false
```

### Package Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "msw": "^2.0.0",
    "axios-mock-adapter": "^1.22.0"
  }
}
```

### TypeScript Configuration

Ensure `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "types": ["vite/client"],
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Vite Configuration

Update `vite.config.ts` if needed:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Optional: Proxy API requests during development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

## Performance Considerations

### Optimization Strategies

1. **Request Deduplication**: Prevent duplicate simultaneous requests
2. **Lazy Loading**: Load images lazily
3. **Request Cancellation**: Cancel pending requests on component unmount
4. **Optimistic Updates**: Update UI before backend confirmation (future)

### Network Optimization

- Use HTTP/2 for multiplexing
- Compress responses (gzip/brotli)
- Minimize payload size
- Use CDN for static assets

## Migration Strategy

### Phase 1: Setup (Day 1)
1. Install axios and dependencies
2. Create API client infrastructure
3. Create backend types
4. Create mapper utilities
5. Set up environment variables

### Phase 2: Services (Day 2)
1. Implement characterService
2. Implement voteService
3. Implement statsService
4. Write service tests

### Phase 3: Hooks Update (Day 3)
1. Update useCharacters hook
2. Update useVoting hook
3. Update useStats hook
4. Test hooks with real backend
5. Fix any integration issues

### Phase 4: Cleanup (Day 4)
1. Remove mockApi.ts
2. Remove mock data
3. Remove localStorage logic
4. Update imports throughout app
5. Update documentation

### Phase 5: Testing & Polish (Day 5)
1. Write integration tests
2. Test error scenarios
3. Test loading states
4. Performance testing
5. Final QA

### Rollback Plan

If integration fails:
1. Keep mockApi.ts as backup
2. Use feature flag to toggle between mock/real API
3. Gradual rollout: test with subset of users first

```typescript
// Feature flag approach
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

export const api = USE_REAL_API ? realApiService : mockApi;
```

## Monitoring and Debugging

### Logging Strategy

```typescript
// Logger utility
const logger = {
  request: (method: string, url: string, data?: any) => {
    if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_API) {
      console.log(`[API Request] ${method} ${url}`, data);
    }
  },
  response: (status: number, data: any, duration: number) => {
    if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_API) {
      console.log(`[API Response] ${status} (${duration}ms)`, data);
    }
  },
  error: (error: Error) => {
    console.error('[API Error]', error);
  },
};
```

### Debug Tools

- Browser DevTools Network tab
- React DevTools for state inspection
- Axios interceptors for request/response logging
- Custom debug panel (future enhancement)

### Health Check

```typescript
// Health check endpoint
export const healthCheck = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health');
    return true;
  } catch {
    return false;
  }
};
```

## Security Considerations

### CORS Configuration

Backend must allow frontend origin:
```yaml
cors:
  allowed-origins: http://localhost:5173,https://pikapikamatch.com
```

### API Key Management

- No API keys in frontend code
- Backend handles external API keys
- Environment variables for configuration only

### Input Validation

- Validate all user inputs before sending
- Sanitize data in mappers
- Type checking with TypeScript

### Error Message Safety

- Never expose sensitive backend details
- Generic messages for 500 errors
- Detailed messages only in development

## Documentation

### API Client Usage

```typescript
// Example: Adding a new endpoint

// 1. Add endpoint to config
export const API_ENDPOINTS = {
  // ...
  newFeature: {
    getData: '/new-feature/data',
  },
};

// 2. Create service method
export const newFeatureService = {
  async getData(): Promise<Data> {
    const dto = await apiClient.get<DataDTO>(
      API_ENDPOINTS.newFeature.getData
    );
    return mappers.toData(dto);
  },
};

// 3. Use in hook
export function useNewFeature() {
  const [data, setData] = useState<Data | null>(null);
  
  const fetchData = useCallback(async () => {
    const result = await newFeatureService.getData();
    setData(result);
  }, []);
  
  return { data, fetchData };
}
```

### Troubleshooting Guide

**Problem**: CORS errors
- **Solution**: Check backend CORS configuration, ensure frontend origin is allowed

**Problem**: Network timeout
- **Solution**: Check backend is running, verify base URL, increase timeout if needed

**Problem**: 404 errors
- **Solution**: Verify endpoint paths match backend, check API_ENDPOINTS configuration

**Problem**: Type errors
- **Solution**: Ensure mappers handle all backend response fields, add default values

**Problem**: Stale data
- **Solution**: Check cache TTL, invalidate cache after mutations, reduce cache duration

## Future Enhancements

### Phase 2 Features
- Request deduplication
- Optimistic updates
- Offline queue for votes
- WebSocket for real-time updates
- Response caching if needed (with React Query)
- Error tracking integration (Sentry)
- Performance monitoring
- A/B testing infrastructure

### Technical Improvements
- Migrate to React Query for better data management
- Implement request cancellation
- Add request retry with exponential backoff
- Implement circuit breaker pattern
- Add request/response compression
- Implement GraphQL layer (future consideration)
