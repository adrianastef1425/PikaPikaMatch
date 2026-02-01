# Implementation Plan - Frontend-Backend Integration

- [x] 1. Setup API Client Infrastructure
  - Create API client directory structure
  - Install axios dependency
  - Set up environment variables configuration
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 8.1, 8.2_

- [x] 1.1 Install dependencies
  - Add axios to package.json
  - Install axios types
  - _Requirements: 8.1_

- [x] 1.2 Create API configuration
  - Create `src/services/api/config.ts` with base URL configuration
  - Implement environment variable reading with VITE_API_BASE_URL
  - Add default fallback to localhost:8080/api
  - Implement trailing slash removal
  - Define API_ENDPOINTS constants for all backend routes
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 1.3 Create custom error classes
  - Create `src/services/api/errors.ts`
  - Implement ApiError base class with statusCode and isRetryable
  - Implement NetworkError for connection failures
  - Implement ValidationError for 400 errors
  - Implement NotFoundError for 404 errors
  - Implement ServiceUnavailableError for 503 errors
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.4_

- [x] 1.4 Create backend DTO types
  - Create `src/services/api/types.ts`
  - Define ApiResponse<T> wrapper interface
  - Define CharacterDTO interface
  - Define VoteRequestDTO interface
  - Define VoteResponseDTO interface
  - Define CharacterStatsDTO interface
  - _Requirements: 11.1, 11.2, 11.3_

- [x] 1.5 Implement API client with axios
  - Create `src/services/api/apiClient.ts`
  - Configure axios instance with base URL and timeout (10 seconds)
  - Implement request interceptor for logging
  - Implement response interceptor for data extraction and error handling
  - Handle different HTTP status codes (400, 404, 500, 503)
  - Detect and handle CORS errors specifically
  - Implement get<T>() and post<T>() methods
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 13.1, 13.2, 13.3_

- [x] 2. Create Data Mappers
  - Implement transformation functions between backend DTOs and frontend types
  - Handle field name differences and provide default values
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2.1 Create mapper utilities
  - Create `src/utils/mappers.ts`
  - Implement toCharacter() mapper (CharacterDTO → Character)
  - Implement toCharacterStats() mapper (CharacterStatsDTO → CharacterStats)
  - Implement toEvaluatedCharacter() mapper (VoteResponseDTO → EvaluatedCharacter)
  - Implement toCharacterWithStats() mapper for stats display
  - Handle externalId → id mapping
  - Handle ISO timestamp → Unix timestamp conversion
  - Provide default values for missing optional fields
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 3. Implement Service Layer
  - Create service modules that consume the API client
  - Implement character, vote, and stats services
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 5.1, 5.2_

- [x] 3.1 Implement Character Service
  - Create `src/services/characterService.ts`
  - Implement getRandomCharacter() method calling /characters/random
  - Implement getPikachuStatus() method calling /characters/pikachu
  - Use mappers to transform responses
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3.2 Implement Vote Service
  - Create `src/services/voteService.ts`
  - Implement submitVote() method calling POST /votes
  - Build VoteRequestDTO payload from Character and voteType
  - Implement getRecentVotes() method calling GET /votes/recent with limit
  - Implement getLastEvaluated() method calling GET /votes/last
  - Handle 404 responses gracefully (return null)
  - Use mappers to transform responses
  - _Requirements: 3.1, 3.2, 5.1, 5.2_

- [x] 3.3 Implement Stats Service
  - Create `src/services/statsService.ts`
  - Implement getTopLiked() method calling GET /stats/top-liked with limit
  - Implement getTopDisliked() method calling GET /stats/top-disliked with limit
  - Implement getMostLiked() method calling GET /stats/most-liked
  - Implement getMostDisliked() method calling GET /stats/most-disliked
  - Handle 404 responses gracefully (return null or empty array)
  - Use mappers to transform responses
  - Add console logging for debugging
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4. Update Custom Hooks
  - Modify existing hooks to use real API services instead of mockApi
  - Implement proper error handling and loading states
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 5.1, 6.1, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4_

- [x] 4.1 Update useCharacters hook
  - Update `src/hooks/useCharacters.ts`
  - Replace mockApi import with characterService
  - Update fetchRandomCharacter() to use characterService.getRandomCharacter()
  - Implement proper error handling with ApiError types
  - Ensure loading states are set correctly
  - Add console logging for debugging
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 6.1, 6.2, 6.5, 7.1_

- [x] 4.2 Update useVoting hook
  - Update `src/hooks/useVoting.ts`
  - Replace mockApi import with voteService
  - Update submitVote() to use voteService.submitVote()
  - Remove cache invalidation logic (no longer needed)
  - Implement proper error handling with ApiError types
  - Handle vote success (201) and validation errors (400)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.4, 7.2_

- [x] 4.3 Update useStats hook
  - Update `src/hooks/useStats.ts`
  - Replace mockApi imports with statsService and voteService
  - Update fetchStats() to use real services
  - Remove character lookup logic (backend returns complete data)
  - Handle 404 errors gracefully (empty arrays)
  - Implement proper error handling with ApiError types
  - Ensure loading states are set correctly
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 6.1, 6.3, 6.5, 7.3_

- [x] 5. Remove Mock API Code
  - Delete mock API files and update imports
  - Clean up localStorage-based persistence
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 5.1 Delete mock API service
  - Delete `src/services/mockApi.ts` file
  - _Requirements: 10.1, 10.2_

- [x] 5.2 Update all imports
  - Search for any remaining mockApi imports in the codebase
  - Verify all hooks are using real services
  - _Requirements: 10.3_

- [x] 5.3 Remove localStorage logic
  - Remove STORAGE_KEYS constants if they exist elsewhere
  - Remove any localStorage.getItem/setItem calls related to votes
  - _Requirements: 10.4_

- [x] 6. Environment Configuration
  - Set up environment variables for different environments
  - Create .env files with proper configuration
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 6.1 Create environment files
  - Create `.env` file with VITE_API_BASE_URL=http://localhost:8080/api
  - Create `.env.production` with production API URL
  - Add optional VITE_DEBUG_API flag for development
  - Update .gitignore to exclude .env but include .env.example
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 6.2 Create .env.example
  - Create `.env.example` file with template values
  - Document all required environment variables
  - _Requirements: 16.2_

- [x] 7. Testing and Validation
  - Test integration with running backend
  - Verify error handling and loading states
  - Test all user flows
  - _Requirements: 2.1, 2.2, 3.1, 4.1, 5.1, 6.1, 7.1, 14.1_

- [x] 7.1 Test character fetching
  - Start backend server
  - Test fetching random character
  - Verify character displays correctly with all fields
  - Test loading state appears and disappears
  - Test error handling when backend is down
  - _Requirements: 2.1, 2.2, 2.3, 6.1, 6.2, 6.5, 7.1_

- [x] 7.2 Test vote submission
  - Test submitting like vote
  - Test submitting dislike vote
  - Verify vote animation plays
  - Verify next character loads after vote
  - Test vote button disabling during submission
  - Test error handling for invalid votes (400)
  - Test error handling when backend is down
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.4, 7.2_

- [x] 7.3 Test statistics display
  - Navigate to Dex view
  - Verify top liked characters display correctly
  - Verify top disliked characters display correctly
  - Verify recently evaluated characters display
  - Verify percentages are calculated correctly
  - Test loading states for stats sections
  - Test empty state when no data exists (404)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.3, 6.5, 7.3_

- [x] 7.4 Test error scenarios
  - Test with backend stopped (network error)
  - Test with invalid backend URL (CORS error)
  - Test with backend returning 500 errors
  - Verify error messages are user-friendly
  - Verify retry buttons work correctly
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2_

- [x] 7.5 Test image handling
  - Verify character images load correctly
  - Test image placeholder during loading
  - Test fallback image when URL is invalid
  - Verify lazy loading works for images
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ] 8. Documentation
  - Document the integration architecture
  - Create troubleshooting guide
  - Document how to add new endpoints
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 8.1 Update README
  - Add section on API integration architecture
  - Document environment variables (VITE_API_BASE_URL)
  - Explain how to run frontend with backend
  - Document API client structure
  - _Requirements: 16.1, 16.2_

- [ ] 8.2 Create integration guide
  - Document how to add new API endpoints
  - Provide code examples for new services
  - Document mapper pattern usage
  - Document error handling patterns
  - _Requirements: 16.3, 16.4_

- [ ] 8.3 Create troubleshooting guide
  - Document common CORS issues and solutions
  - Document network timeout issues
  - Document 404 error debugging
  - Document type error solutions
  - _Requirements: 16.5_

- [ ] 9. Final Checkpoint
  - Ensure all tests pass
  - Verify complete integration works end-to-end
  - Ask user if questions arise

