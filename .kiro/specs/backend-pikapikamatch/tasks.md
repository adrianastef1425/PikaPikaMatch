# Implementation Plan - PikaPikaMatch Backend

## Overview

Este plan de implementación desglosa el desarrollo del backend de PikaPikaMatch en tareas incrementales y manejables. Cada tarea construye sobre las anteriores, asegurando que el código se integre correctamente en cada paso.

## Task List

- [x] 1. Setup project structure and dependencies
  - Initialize Spring Boot project with Java 21 and Maven
  - Configure pom.xml with all required dependencies (Spring Web, Spring Data MongoDB, Validation, Swagger, Lombok, Testing)
  - Create package structure (controller, service, repository, model, exception, config, util)
  - Create application.yml with basic configuration placeholders
  - Create .env.example file with required environment variables
  - _Requirements: All_

- [x] 2. Configure MongoDB connection and base entities
  - [x] 2.1 Create MongoDB configuration class
    - Implement MongoConfig with transaction manager
    - Enable MongoDB auditing
    - Configure connection from environment variables
    - _Requirements: 10.1, 10.4_
  
  - [x] 2.2 Create Character entity
    - Define Character document with all fields (id, externalId, name, source, imageUrl, description, counters, timestamps)
    - Add indexes annotations
    - Implement getLikePercentage() and getDislikePercentage() methods
    - _Requirements: 2.2, 2.3, 3.2, 7.3_
  
  - [x] 2.3 Create Vote entity
    - Define Vote document with DBRef to Character
    - Add indexes annotations
    - Include voteType and timestamp fields
    - _Requirements: 2.4, 5.1, 9.2_
  
  - [ ]* 2.4 Write unit tests for entity methods
    - Test Character percentage calculations
    - Test entity creation and field validation
    - _Requirements: 2.2, 2.3_

- [x] 3. Create DTOs and mappers
  - [x] 3.1 Create DTO classes
    - Implement CharacterDTO with validation annotations
    - Implement VoteRequestDTO with @NotBlank and @Pattern validations
    - Implement VoteResponseDTO
    - Implement CharacterStatsDTO
    - Implement ApiResponse generic wrapper
    - _Requirements: 2.1, 2.6, 2.7, 17.1, 17.2_
  
  - [x] 3.2 Create CharacterMapper utility
    - Implement entity to DTO conversions
    - Implement withDefaults() method for missing data
    - _Requirements: 15.4_
  
  - [ ]* 3.3 Write unit tests for mappers
    - Test all conversion methods
    - Test default value handling
    - _Requirements: 15.4_

- [x] 4. Create repositories
  - [x] 4.1 Create CharacterRepository interface
    - Extend MongoRepository
    - Add custom query methods (findByExternalIdAndSource, findByNameIgnoreCase, findTopByOrderByTotalLikesDesc, etc.)
    - _Requirements: 3.1, 4.1, 6.1, 7.2, 8.2_
  
  - [x] 4.2 Create VoteRepository interface
    - Extend MongoRepository
    - Add custom query methods (findTopByOrderByTimestampDesc, findTopNByOrderByTimestampDesc)
    - _Requirements: 5.1, 9.2_

- [x] 5. Implement external API services
  - [x] 5.1 Configure RestTemplate beans
    - Create RestTemplateConfig class
    - Configure separate RestTemplate beans for each API
    - Set timeouts to 5 seconds
    - _Requirements: 13.3_
  
  - [x] 5.2 Create PokeApiService
    - Implement getRandomPokemon() method
    - Implement getPokemonByName() for Pikachu lookup
    - Fetch Pokemon data and species description
    - Transform to CharacterDTO with proper field mapping
    - Handle missing data with defaults
    - _Requirements: 1.1, 1.2, 6.3, 15.1, 15.4_
  
  - [x] 5.3 Create RickAndMortyApiService
    - Implement getRandomCharacter() method
    - Fetch character data from API
    - Build description from species, status, and origin
    - Transform to CharacterDTO
    - Handle missing data with defaults
    - _Requirements: 1.1, 1.2, 15.2, 15.4_
  
  - [x] 5.4 Create SuperHeroApiService
    - Implement getRandomSuperhero() method
    - Fetch superhero data using API key from environment
    - Build description from biography and work
    - Transform to CharacterDTO
    - Handle missing data with defaults
    - _Requirements: 1.1, 1.2, 10.3, 15.3, 15.4_
  
  - [ ]* 5.5 Write unit tests for external API services
    - Mock RestTemplate responses
    - Test transformation logic for each API
    - Test default value handling
    - Test error scenarios
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 6. Implement retry and resilience logic
  - [x] 6.1 Create retry service
    - Implement executeWithRetry() method with exponential backoff
    - Configure max 3 retries with 1s initial delay
    - Log retry attempts
    - _Requirements: 13.1, 13.4_
  
  - [ ]* 6.2 Write unit tests for retry logic
    - Test successful retry after failures
    - Test exhausted retries
    - Test exponential backoff timing
    - _Requirements: 13.1_

- [x] 7. Implement CharacterService
  - [x] 7.1 Create CharacterService class
    - Implement getRandomCharacter() with random API selection
    - Implement failover logic to try different APIs
    - Implement getPikachuStatus() with database lookup and API fallback
    - Implement findOrCreateCharacter() helper method
    - Use retry service for external API calls
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 7.2 Write unit tests for CharacterService
    - Mock repositories and external API services
    - Test random character selection from different sources
    - Test API failover behavior
    - Test Pikachu lookup with and without database record
    - Test error handling
    - _Requirements: 1.1, 1.4, 6.1, 6.2, 6.3_

- [x] 8. Implement VoteService
  - [x] 8.1 Create VoteService class
    - Implement createVote() with @Transactional annotation
    - Implement findOrCreate character logic
    - Implement counter increment logic (like vs dislike)
    - Implement getRecentVotes() with character lookup
    - Implement getLastEvaluated() with character lookup
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 9.2, 9.3, 9.4_
  
  - [ ]* 8.2 Write unit tests for VoteService
    - Mock repositories
    - Test vote creation for new character
    - Test vote creation for existing character
    - Test like counter increment
    - Test dislike counter increment
    - Test transaction rollback on error
    - Test recent votes query
    - Test last evaluated query
    - _Requirements: 2.2, 2.3, 2.4, 5.1, 9.2_

- [x] 9. Implement StatsService
  - [x] 9.1 Create StatsService class
    - Implement getMostLiked() using repository query
    - Implement getMostDisliked() using repository query
    - Implement getTopLiked() with limit parameter
    - Implement getTopDisliked() with limit parameter
    - Map entities to CharacterStatsDTO with percentages
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 7.2, 7.3, 8.2, 8.3_
  
  - [ ]* 9.2 Write unit tests for StatsService
    - Mock repository
    - Test most liked query
    - Test most disliked query
    - Test top N queries with different limits
    - Test percentage calculations
    - Test empty database scenarios
    - _Requirements: 3.1, 4.1, 7.2, 8.2_

- [x] 10. Create custom exceptions
  - [x] 10.1 Create exception classes
    - Implement ResourceNotFoundException
    - Implement ExternalApiException
    - Implement ValidationException
    - _Requirements: 12.2, 12.3, 12.4_
  
  - [x] 10.2 Create GlobalExceptionHandler
    - Implement @RestControllerAdvice class
    - Handle ResourceNotFoundException → 404
    - Handle ValidationException → 400
    - Handle MethodArgumentNotValidException → 400
    - Handle ExternalApiException → 503
    - Handle generic Exception → 500
    - Return ApiResponse with consistent structure
    - Log errors appropriately
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 10.3 Write unit tests for GlobalExceptionHandler
    - Test each exception handler
    - Verify HTTP status codes
    - Verify response structure
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 11. Implement CharacterController
  - [x] 11.1 Create CharacterController class
    - Implement GET /api/characters/random endpoint
    - Implement GET /api/characters/pikachu endpoint
    - Add Swagger annotations (@Operation, @ApiResponses)
    - Wrap responses in ApiResponse
    - _Requirements: 1.3, 1.5, 6.5_
  
  - [ ]* 11.2 Write unit tests for CharacterController
    - Mock CharacterService
    - Test random character endpoint
    - Test Pikachu endpoint
    - Test error responses
    - _Requirements: 1.3, 6.5_

- [x] 12. Implement VoteController
  - [x] 12.1 Create VoteController class
    - Implement POST /api/votes endpoint with @Valid
    - Implement GET /api/votes/recent endpoint with @Min/@Max validation
    - Implement GET /api/votes/last endpoint
    - Add Swagger annotations
    - Wrap responses in ApiResponse
    - _Requirements: 2.5, 2.6, 2.7, 5.4, 5.5, 9.5, 9.6, 17.1, 17.2, 17.3, 17.4_
  
  - [ ]* 12.2 Write unit tests for VoteController
    - Mock VoteService
    - Test vote creation with valid data
    - Test vote creation with invalid data
    - Test validation errors
    - Test recent votes endpoint
    - Test last evaluated endpoint
    - _Requirements: 2.5, 2.6, 2.7, 17.4_

- [x] 13. Implement StatsController
  - [x] 13.1 Create StatsController class
    - Implement GET /api/stats/most-liked endpoint
    - Implement GET /api/stats/most-disliked endpoint
    - Implement GET /api/stats/top-liked endpoint with @Min/@Max validation
    - Implement GET /api/stats/top-disliked endpoint with @Min/@Max validation
    - Add Swagger annotations
    - Wrap responses in ApiResponse
    - _Requirements: 3.4, 3.5, 4.4, 4.5, 7.4, 7.5, 8.4, 8.5, 17.3_
  
  - [ ]* 13.2 Write unit tests for StatsController
    - Mock StatsService
    - Test all statistics endpoints
    - Test limit parameter validation
    - Test default limit values
    - Test error responses
    - _Requirements: 3.5, 4.5, 7.5, 8.5, 17.3_

- [x] 14. Configure CORS
  - [x] 14.1 Create CorsConfig class
    - Implement WebMvcConfigurer
    - Configure allowed origins from environment variable
    - Configure allowed methods (GET, POST, PUT, DELETE, OPTIONS)
    - Configure allowed headers
    - Set credentials and max age
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 15. Configure Swagger/OpenAPI
  - [x] 15.1 Create SwaggerConfig class
    - Configure OpenAPI bean with API info
    - Add contact information
    - Add server URLs
    - _Requirements: 14.5_
  
  - [x] 15.2 Add Swagger annotations to all controllers
    - Add @Tag to controller classes
    - Add @Operation to endpoints
    - Add @ApiResponses with response codes
    - Add @Schema to DTOs
    - _Requirements: 14.2, 14.3_

- [x] 16. Implement logging
  - [x] 16.1 Create logback-spring.xml configuration
    - Configure console and file appenders
    - Set log levels for different packages
    - Configure log pattern with timestamp
    - _Requirements: 16.5_
  
  - [x] 16.2 Add logging to services
    - Add @Slf4j to service classes
    - Log important operations (votes created, API calls, errors)
    - Log at appropriate levels (DEBUG, INFO, WARN, ERROR)
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [x] 16.3 Create request logging filter
    - Implement OncePerRequestFilter
    - Log HTTP method, path, status, and duration
    - _Requirements: 16.1_

- [ ] 17. Create Postman collection
  - [ ] 17.1 Create Postman collection file
    - Add all endpoints organized by resource
    - Add example requests with sample data
    - Add example responses for success and error cases
    - Configure environment variables (base_url, api_prefix)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 18. Create comprehensive README
  - [ ] 18.1 Write README.md
    - Add project description
    - List prerequisites (Java 21, Maven, MongoDB Atlas, SuperHero API key)
    - Provide step-by-step installation instructions
    - Include MongoDB Atlas setup guide with links
    - Include SuperHero API key setup guide
    - Document all environment variables
    - List all available endpoints with examples
    - Add testing instructions
    - Add troubleshooting section
    - Link to Swagger UI and Postman collection
    - _Requirements: All_

- [ ] 19. Final integration and testing
  - [ ] 19.1 Integration verification
    - Start application and verify it connects to MongoDB
    - Test all endpoints manually via Swagger UI
    - Test all endpoints via Postman collection
    - Verify CORS works with frontend
    - Verify error handling for all error scenarios
    - Verify logging output
    - _Requirements: All_
  
  - [ ]* 19.2 Run all unit tests
    - Execute mvn test
    - Verify all tests pass
    - Check test coverage report
    - _Requirements: All_

- [ ] 20. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
