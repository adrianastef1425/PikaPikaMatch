# Design Document - PikaPikaMatch Backend

## Overview

PikaPikaMatch Backend es una API RESTful desarrollada con Java 21 y Spring Boot que proporciona servicios de gestión de personajes y votaciones. El backend integra tres APIs externas (PokeAPI, Rick and Morty API, SuperHero API), almacena datos en MongoDB Atlas usando un modelo normalizado de dos colecciones, y expone endpoints REST para consultas de estadísticas y gestión de votos.

La arquitectura sigue principios de Clean Architecture con separación clara de capas (Controller, Service, Repository), utiliza Spring Data MongoDB para persistencia, y implementa manejo robusto de errores y logging estructurado con SLF4J.

## Architecture

### Technology Stack

- **Language**: Java 21
- **Framework**: Spring Boot 3.2+
- **Build Tool**: Maven
- **Database**: MongoDB Atlas (Cloud)
- **ORM**: Spring Data MongoDB
- **HTTP Client**: RestTemplate / WebClient
- **Validation**: Jakarta Bean Validation (Hibernate Validator)
- **Logging**: SLF4J + Logback
- **Documentation**: Swagger/OpenAPI 3.0 + Postman Collection
- **Testing**: JUnit 5 + Mockito + AssertJ

### Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── pikapikamatch/
│   │   │           ├── PikaPikaMatchApplication.java
│   │   │           ├── config/
│   │   │           │   ├── MongoConfig.java
│   │   │           │   ├── RestTemplateConfig.java
│   │   │           │   ├── CorsConfig.java
│   │   │           │   └── SwaggerConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── CharacterController.java
│   │   │           │   ├── VoteController.java
│   │   │           │   └── StatsController.java
│   │   │           ├── service/
│   │   │           │   ├── CharacterService.java
│   │   │           │   ├── VoteService.java
│   │   │           │   ├── StatsService.java
│   │   │           │   └── external/
│   │   │           │       ├── PokeApiService.java
│   │   │           │       ├── RickAndMortyApiService.java
│   │   │           │       └── SuperHeroApiService.java
│   │   │           ├── repository/
│   │   │           │   ├── CharacterRepository.java
│   │   │           │   └── VoteRepository.java
│   │   │           ├── model/
│   │   │           │   ├── entity/
│   │   │           │   │   ├── Character.java
│   │   │           │   │   └── Vote.java
│   │   │           │   └── dto/
│   │   │           │       ├── CharacterDTO.java
│   │   │           │       ├── VoteRequestDTO.java
│   │   │           │       ├── VoteResponseDTO.java
│   │   │           │       ├── CharacterStatsDTO.java
│   │   │           │       └── ApiResponse.java
│   │   │           ├── exception/
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── ExternalApiException.java
│   │   │           │   └── ValidationException.java
│   │   │           └── util/
│   │   │               ├── CharacterMapper.java
│   │   │               └── Constants.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── logback-spring.xml
│   └── test/
│       └── java/
│           └── com/
│               └── pikapikamatch/
│                   ├── service/
│                   ├── controller/
│                   └── util/
├── pom.xml
├── README.md
└── postman/
    └── PikaPikaMatch-API.postman_collection.json
```

### Architectural Patterns

1. **Layered Architecture**: Separación clara entre Controller, Service, Repository
2. **DTO Pattern**: Objetos de transferencia para desacoplar API de entidades
3. **Repository Pattern**: Abstracción de acceso a datos con Spring Data
4. **Service Layer**: Lógica de negocio encapsulada
5. **Exception Handling**: Manejo centralizado con @ControllerAdvice
6. **Dependency Injection**: Inyección de dependencias con Spring

## Components and Interfaces

### Controllers

#### 1. CharacterController
```java
@RestController
@RequestMapping("/api/characters")
@Tag(name = "Characters", description = "Character management endpoints")
public class CharacterController {
    
    @GetMapping("/random")
    public ResponseEntity<ApiResponse<CharacterDTO>> getRandomCharacter();
    
    @GetMapping("/pikachu")
    public ResponseEntity<ApiResponse<CharacterStatsDTO>> getPikachuStatus();
}
```

Responsabilidades:
- Exponer endpoint para obtener personaje aleatorio
- Exponer endpoint para consultar estado de Pikachu
- Validar parámetros de entrada
- Transformar respuestas a DTOs

#### 2. VoteController
```java
@RestController
@RequestMapping("/api/votes")
@Tag(name = "Votes", description = "Vote management endpoints")
public class VoteController {
    
    @PostMapping
    public ResponseEntity<ApiResponse<VoteResponseDTO>> createVote(
        @Valid @RequestBody VoteRequestDTO request);
    
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<VoteResponseDTO>>> getRecentVotes(
        @RequestParam(defaultValue = "10") @Min(1) @Max(50) Integer limit);
    
    @GetMapping("/last")
    public ResponseEntity<ApiResponse<VoteResponseDTO>> getLastEvaluated();
}
```

Responsabilidades:
- Registrar nuevos votos
- Consultar votos recientes
- Consultar último voto registrado
- Validar datos de entrada

#### 3. StatsController
```java
@RestController
@RequestMapping("/api/stats")
@Tag(name = "Statistics", description = "Statistics endpoints")
public class StatsController {
    
    @GetMapping("/most-liked")
    public ResponseEntity<ApiResponse<CharacterStatsDTO>> getMostLiked();
    
    @GetMapping("/most-disliked")
    public ResponseEntity<ApiResponse<CharacterStatsDTO>> getMostDisliked();
    
    @GetMapping("/top-liked")
    public ResponseEntity<ApiResponse<List<CharacterStatsDTO>>> getTopLiked(
        @RequestParam(defaultValue = "5") @Min(1) @Max(50) Integer limit);
    
    @GetMapping("/top-disliked")
    public ResponseEntity<ApiResponse<List<CharacterStatsDTO>>> getTopDisliked(
        @RequestParam(defaultValue = "5") @Min(1) @Max(50) Integer limit);
}
```

Responsabilidades:
- Exponer estadísticas de personajes
- Consultar rankings de likes y dislikes
- Validar parámetros de límite

### Services

#### 1. CharacterService
```java
@Service
public class CharacterService {
    
    public CharacterDTO getRandomCharacter();
    public CharacterStatsDTO getPikachuStatus();
    public Character findOrCreateCharacter(VoteRequestDTO voteRequest);
    private CharacterDTO fetchFromRandomApi();
}
```

Responsabilidades:
- Obtener personaje aleatorio de APIs externas
- Consultar o crear personajes en base de datos
- Coordinar llamadas a servicios externos
- Transformar datos de APIs externas a formato unificado

#### 2. VoteService
```java
@Service
public class VoteService {
    
    @Transactional
    public VoteResponseDTO createVote(VoteRequestDTO request);
    public List<VoteResponseDTO> getRecentVotes(Integer limit);
    public VoteResponseDTO getLastEvaluated();
}
```

Responsabilidades:
- Registrar votos con transacciones
- Actualizar contadores de personajes
- Consultar historial de votos
- Realizar lookups entre colecciones

#### 3. StatsService
```java
@Service
public class StatsService {
    
    public CharacterStatsDTO getMostLiked();
    public CharacterStatsDTO getMostDisliked();
    public List<CharacterStatsDTO> getTopLiked(Integer limit);
    public List<CharacterStatsDTO> getTopDisliked(Integer limit);
}
```

Responsabilidades:
- Consultar estadísticas de personajes
- Calcular porcentajes de likes/dislikes
- Ordenar y limitar resultados

#### 4. External API Services

**PokeApiService**
```java
@Service
public class PokeApiService {
    
    public CharacterDTO getRandomPokemon();
    public CharacterDTO getPokemonByName(String name);
    private String fetchPokemonDescription(String speciesUrl);
}
```

**RickAndMortyApiService**
```java
@Service
public class RickAndMortyApiService {
    
    public CharacterDTO getRandomCharacter();
    private String buildDescription(RickAndMortyCharacter character);
}
```

**SuperHeroApiService**
```java
@Service
public class SuperHeroApiService {
    
    public CharacterDTO getRandomSuperhero();
    private String buildDescription(SuperheroResponse response);
}
```

Responsabilidades:
- Consumir APIs externas con RestTemplate
- Transformar respuestas a CharacterDTO unificado
- Manejar errores y reintentos
- Proporcionar valores por defecto para datos faltantes

### Repositories

#### 1. CharacterRepository
```java
@Repository
public interface CharacterRepository extends MongoRepository<Character, String> {
    
    Optional<Character> findByExternalIdAndSource(String externalId, String source);
    Optional<Character> findByNameIgnoreCase(String name);
    List<Character> findTop5ByOrderByTotalLikesDesc();
    List<Character> findTop5ByOrderByTotalDislikesDesc();
    Character findTopByOrderByTotalLikesDesc();
    Character findTopByOrderByTotalDislikesDesc();
}
```

Responsabilidades:
- Operaciones CRUD sobre colección characters
- Consultas personalizadas para rankings
- Búsqueda por nombre (case-insensitive)
- Búsqueda por externalId y source

#### 2. VoteRepository
```java
@Repository
public interface VoteRepository extends MongoRepository<Vote, String> {
    
    List<Vote> findTop10ByOrderByTimestampDesc();
    Vote findTopByOrderByTimestampDesc();
    
    @Aggregation(pipeline = {
        "{ $sort: { timestamp: -1 } }",
        "{ $limit: ?0 }",
        "{ $lookup: { from: 'characters', localField: 'characterId', foreignField: '_id', as: 'character' } }",
        "{ $unwind: '$character' }"
    })
    List<VoteWithCharacter> findRecentWithCharacterInfo(int limit);
}
```

Responsabilidades:
- Operaciones CRUD sobre colección votes
- Consultas de votos recientes
- Agregaciones con lookup a characters
- Ordenamiento por timestamp

## Data Models

### Entity Models

#### Character Entity
```java
@Document(collection = "characters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Character {
    
    @Id
    private String id;
    
    @Indexed
    private String externalId;  // ID del personaje en la API externa
    
    @Indexed
    private String name;
    
    @Indexed
    private String source;  // "pokemon", "rickandmorty", "superhero"
    
    private String imageUrl;
    
    private String description;
    
    private Integer totalLikes = 0;
    
    private Integer totalDislikes = 0;
    
    private Integer totalVotes = 0;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime lastUpdated;
    
    // Método calculado
    public Double getLikePercentage() {
        if (totalVotes == 0) return 0.0;
        return (totalLikes * 100.0) / totalVotes;
    }
    
    public Double getDislikePercentage() {
        if (totalVotes == 0) return 0.0;
        return (totalDislikes * 100.0) / totalVotes;
    }
}
```

#### Vote Entity
```java
@Document(collection = "votes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {
    
    @Id
    private String id;
    
    @Indexed
    @DBRef
    private Character character;  // Referencia a Character
    
    @Indexed
    private String voteType;  // "like" o "dislike"
    
    @Indexed
    private LocalDateTime timestamp;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

### DTO Models

#### CharacterDTO
```java
@Data
@Builder
public class CharacterDTO {
    private String id;
    private String externalId;
    private String name;
    private String source;
    private String imageUrl;
    private String description;
}
```

#### VoteRequestDTO
```java
@Data
public class VoteRequestDTO {
    
    @NotBlank(message = "Character ID is required")
    private String characterId;
    
    @NotBlank(message = "Character name is required")
    private String characterName;
    
    @NotBlank(message = "Character source is required")
    @Pattern(regexp = "pokemon|rickandmorty|superhero", message = "Invalid source")
    private String characterSource;
    
    @NotBlank(message = "Vote type is required")
    @Pattern(regexp = "like|dislike", message = "Vote type must be 'like' or 'dislike'")
    private String voteType;
    
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
    
    private String description;
}
```

#### VoteResponseDTO
```java
@Data
@Builder
public class VoteResponseDTO {
    private String voteId;
    private String characterId;
    private String characterName;
    private String characterSource;
    private String imageUrl;
    private String description;
    private String voteType;
    private LocalDateTime timestamp;
}
```

#### CharacterStatsDTO
```java
@Data
@Builder
public class CharacterStatsDTO {
    private String id;
    private String externalId;
    private String name;
    private String source;
    private String imageUrl;
    private String description;
    private Integer totalLikes;
    private Integer totalDislikes;
    private Integer totalVotes;
    private Double likePercentage;
    private Double dislikePercentage;
}
```

#### ApiResponse
```java
@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, LocalDateTime.now());
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now());
    }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Character transformation completeness
*For any* character fetched from any external API (Pokemon, Rick and Morty, Superhero), the transformed CharacterDTO SHALL include all required fields: id, name, imageUrl, description, and source
**Validates: Requirements 1.2, 15.1, 15.2, 15.3, 15.5**

### Property 2: API source distribution
*For any* sequence of random character requests, the system SHALL return characters from all three API sources (pokemon, rickandmorty, superhero) over time
**Validates: Requirements 1.1**

### Property 3: API failover resilience
*For any* external API call that fails, the system SHALL attempt to fetch from a different API source before returning an error
**Validates: Requirements 1.4**

### Property 4: Vote validation rejection
*For any* vote request with missing required fields (characterId, characterName, characterSource, voteType, imageUrl), the system SHALL return HTTP status 400 with a descriptive error message
**Validates: Requirements 2.1, 2.6, 17.1, 17.4**

### Property 5: Vote type validation
*For any* vote request with voteType not equal to "like" or "dislike", the system SHALL return HTTP status 400
**Validates: Requirements 2.7, 17.2**

### Property 6: Character creation on first vote
*For any* vote submitted for a character that does not exist in the database, the system SHALL create a new Character document with initialized counters (totalLikes=0, totalDislikes=0, totalVotes=0)
**Validates: Requirements 2.2**

### Property 7: Vote counter increment
*For any* vote submitted for an existing character, the system SHALL increment the appropriate counter (totalLikes for "like", totalDislikes for "dislike") and totalVotes by exactly 1
**Validates: Requirements 2.3**

### Property 8: Vote persistence atomicity
*For any* successful vote operation, both the Character counter update and Vote document creation SHALL complete, or neither SHALL complete
**Validates: Requirements 2.4**

### Property 9: Most liked character correctness
*For any* database state with characters, the most liked character endpoint SHALL return the character with the highest totalLikes value
**Validates: Requirements 3.1**

### Property 10: Most disliked character correctness
*For any* database state with characters, the most disliked character endpoint SHALL return the character with the highest totalDislikes value
**Validates: Requirements 4.1**

### Property 11: Character response completeness
*For any* character returned in statistics endpoints, the response SHALL include all required fields: id, externalId, name, source, imageUrl, description, totalLikes, totalDislikes, totalVotes
**Validates: Requirements 3.2, 4.2**

### Property 12: Last evaluated vote recency
*For any* database state with votes, the last evaluated endpoint SHALL return the vote with the most recent timestamp
**Validates: Requirements 5.1**

### Property 13: Vote-character lookup completeness
*For any* vote returned by recent votes endpoints, the response SHALL include complete character information through lookup
**Validates: Requirements 5.2, 5.3, 9.3, 9.4**

### Property 14: Limit parameter validation
*For any* request with a limit parameter, the system SHALL validate that limit is a positive integer between 1 and 50, returning HTTP status 400 if invalid
**Validates: Requirements 7.1, 8.1, 9.1, 17.3**

### Property 15: Top characters sorting correctness
*For any* top liked or top disliked request, the returned array SHALL be sorted in descending order by the respective counter (totalLikes or totalDislikes)
**Validates: Requirements 7.2, 8.2**

### Property 16: Recent votes chronological ordering
*For any* recent votes request, the returned array SHALL be sorted in descending order by timestamp (most recent first)
**Validates: Requirements 9.2**

### Property 17: Default values for missing data
*For any* external API response with missing fields, the system SHALL provide default values: "Unknown" for missing text fields and a placeholder URL for missing images
**Validates: Requirements 15.4**

### Property 18: Error response structure consistency
*For any* error that occurs in any endpoint, the system SHALL return a JSON response with fields: success (false), message (string), and timestamp
**Validates: Requirements 12.1**

### Property 19: HTTP status code correctness for validation errors
*For any* validation error (missing fields, invalid values), the system SHALL return HTTP status 400
**Validates: Requirements 12.2, 17.4**

### Property 20: HTTP status code correctness for not found
*For any* resource not found error (no characters, no votes, Pikachu not found), the system SHALL return HTTP status 404
**Validates: Requirements 12.3**

### Property 21: HTTP status code correctness for external API failures
*For any* external API failure after all retries, the system SHALL return HTTP status 503
**Validates: Requirements 12.4**

### Property 22: External API retry behavior
*For any* external API call that fails with a network error, the system SHALL retry up to 3 times with exponential backoff before returning an error
**Validates: Requirements 13.1**

### Property 23: External API timeout enforcement
*For any* external API call, the system SHALL cancel the request after 5 seconds if no response is received
**Validates: Requirements 13.3**

### Property 24: External API response validation
*For any* external API response received, the system SHALL validate the response structure before processing
**Validates: Requirements 13.5**

### Property 25: Vote processing completion
*For any* vote request that passes validation, the system SHALL proceed with creating the vote and updating counters
**Validates: Requirements 17.5**

## Error Handling

### Exception Hierarchy

```java
// Custom exceptions
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class ExternalApiException extends RuntimeException {
    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
```

### Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(ValidationException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        log.warn("Validation errors: {}", errors);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error("Validation failed"));
    }
    
    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleExternalApi(ExternalApiException ex) {
        log.error("External API error: {}", ex.getMessage(), ex);
        return ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(ApiResponse.error("External service temporarily unavailable"));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("An unexpected error occurred"));
    }
}
```

### Error Handling Strategy

1. **Validation Errors**: Capturar en controllers con @Valid, retornar 400
2. **Not Found**: Lanzar ResourceNotFoundException, retornar 404
3. **External API Errors**: Reintentar 3 veces, luego lanzar ExternalApiException, retornar 503
4. **Database Errors**: Loggear y retornar 500
5. **Unexpected Errors**: Loggear stack trace completo, retornar mensaje genérico al cliente

## Testing Strategy

### Unit Testing Approach

El proyecto utilizará **solo pruebas unitarias** con JUnit 5 y Mockito. No se implementarán pruebas de integración ni property-based testing.

### Unit Testing Coverage

#### 1. Service Layer Tests
- **CharacterService**: 
  - Probar obtención de personaje aleatorio
  - Probar transformación de datos de APIs externas
  - Probar manejo de errores de APIs
  - Mockear repositorios y servicios externos

- **VoteService**:
  - Probar creación de votos con personaje nuevo
  - Probar creación de votos con personaje existente
  - Probar actualización de contadores
  - Probar consultas de votos recientes
  - Mockear repositorios

- **StatsService**:
  - Probar consultas de estadísticas
  - Probar cálculo de porcentajes
  - Probar ordenamiento y límites
  - Mockear repositorios

- **External API Services**:
  - Probar transformación de respuestas de cada API
  - Probar manejo de datos incompletos
  - Probar valores por defecto
  - Mockear RestTemplate

#### 2. Controller Layer Tests
- **CharacterController**:
  - Probar endpoint de personaje aleatorio
  - Probar endpoint de Pikachu
  - Probar validación de parámetros
  - Mockear servicios

- **VoteController**:
  - Probar endpoint de creación de votos
  - Probar validación de request body
  - Probar endpoints de consulta
  - Mockear servicios

- **StatsController**:
  - Probar todos los endpoints de estadísticas
  - Probar validación de parámetros limit
  - Probar respuestas de error
  - Mockear servicios

#### 3. Utility Classes Tests
- **CharacterMapper**:
  - Probar conversiones entre entidades y DTOs
  - Probar manejo de valores nulos
  - Probar cálculo de porcentajes

#### 4. Exception Handler Tests
- **GlobalExceptionHandler**:
  - Probar manejo de cada tipo de excepción
  - Probar estructura de respuestas de error
  - Probar códigos de estado HTTP

### Testing Tools and Libraries

```xml
<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>
    
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- AssertJ for fluent assertions -->
    <dependency>
        <groupId>org.assertj</groupId>
        <artifactId>assertj-core</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Test Naming Convention

```java
// Pattern: methodName_scenario_expectedBehavior
@Test
void getRandomCharacter_whenAllApisAvailable_returnsCharacterFromRandomSource()

@Test
void createVote_whenCharacterDoesNotExist_createsNewCharacterAndVote()

@Test
void getMostLiked_whenNoCharactersExist_throwsResourceNotFoundException()
```

### Mocking Strategy

- Usar `@Mock` para dependencias
- Usar `@InjectMocks` para clase bajo prueba
- Usar `@ExtendWith(MockitoExtension.class)` en clases de test
- Mockear solo dependencias directas
- Verificar interacciones importantes con `verify()`

### Test Coverage Goals

- **Service Layer**: 80%+ coverage
- **Controller Layer**: 70%+ coverage
- **Utility Classes**: 90%+ coverage
- **Overall**: 75%+ coverage

## Configuration

### Application Configuration (application.yml)

```yaml
spring:
  application:
    name: pikapikamatch-backend
  
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb://localhost:27017/pikapikamatch}
      auto-index-creation: true
  
  jackson:
    serialization:
      write-dates-as-timestamps: false
    time-zone: UTC

server:
  port: ${PORT:8080}
  error:
    include-message: always
    include-stacktrace: never

logging:
  level:
    root: INFO
    com.pikapikamatch: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"

# External APIs
external:
  apis:
    pokeapi:
      base-url: https://pokeapi.co/api/v2
      timeout: 5000
    rickandmorty:
      base-url: https://rickandmortyapi.com/api
      timeout: 5000
    superhero:
      base-url: https://superheroapi.com/api
      api-key: ${SUPERHERO_API_KEY}
      timeout: 5000
  
  retry:
    max-attempts: 3
    backoff-delay: 1000

# CORS
cors:
  allowed-origins: ${CORS_ORIGIN:http://localhost:5173,http://localhost:3000}
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
  allow-credentials: true

# Swagger
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    operations-sorter: method
```

### Environment Variables

```bash
# Required
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pikapikamatch
SUPERHERO_API_KEY=your_api_key_here

# Optional
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

### MongoDB Configuration

```java
@Configuration
@EnableMongoAuditing
public class MongoConfig {
    
    @Bean
    public MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }
}
```

### RestTemplate Configuration

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .errorHandler(new CustomResponseErrorHandler())
            .build();
    }
    
    @Bean
    public RestTemplate pokeApiRestTemplate(RestTemplateBuilder builder) {
        return builder
            .rootUri("https://pokeapi.co/api/v2")
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .build();
    }
    
    @Bean
    public RestTemplate rickAndMortyRestTemplate(RestTemplateBuilder builder) {
        return builder
            .rootUri("https://rickandmortyapi.com/api")
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .build();
    }
    
    @Bean
    public RestTemplate superheroRestTemplate(RestTemplateBuilder builder,
                                              @Value("${external.apis.superhero.api-key}") String apiKey) {
        return builder
            .rootUri("https://superheroapi.com/api/" + apiKey)
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .build();
    }
}
```

### CORS Configuration

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

### Swagger Configuration

```java
@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("PikaPikaMatch API")
                .version("1.0")
                .description("API for character voting system with Pokemon, Rick and Morty, and Superheroes")
                .contact(new Contact()
                    .name("API Support")
                    .email("support@pikapikamatch.com")))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Local server"),
                new Server().url("https://api.pikapikamatch.com").description("Production server")
            ));
    }
}
```

## API Endpoints

### Character Endpoints

#### GET /api/characters/random
Obtiene un personaje aleatorio de cualquier fuente.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "25",
    "externalId": "25",
    "name": "Pikachu",
    "source": "pokemon",
    "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    "description": "Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy."
  },
  "timestamp": "2026-01-31T10:30:00Z"
}
```

**Response 503:**
```json
{
  "success": false,
  "message": "All external APIs are currently unavailable",
  "data": null,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

#### GET /api/characters/pikachu
Obtiene el estado de Pikachu con estadísticas.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "externalId": "25",
    "name": "Pikachu",
    "source": "pokemon",
    "imageUrl": "https://...",
    "description": "Electric mouse Pokemon",
    "totalLikes": 150,
    "totalDislikes": 30,
    "totalVotes": 180,
    "likePercentage": 83.33,
    "dislikePercentage": 16.67
  },
  "timestamp": "2026-01-31T10:30:00Z"
}
```

### Vote Endpoints

#### POST /api/votes
Registra un nuevo voto.

**Request Body:**
```json
{
  "characterId": "25",
  "characterName": "Pikachu",
  "characterSource": "pokemon",
  "voteType": "like",
  "imageUrl": "https://...",
  "description": "Electric mouse Pokemon"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Vote registered successfully",
  "data": {
    "voteId": "507f1f77bcf86cd799439012",
    "characterId": "507f1f77bcf86cd799439011",
    "characterName": "Pikachu",
    "characterSource": "pokemon",
    "imageUrl": "https://...",
    "description": "Electric mouse Pokemon",
    "voteType": "like",
    "timestamp": "2026-01-31T10:30:00Z"
  },
  "timestamp": "2026-01-31T10:30:00Z"
}
```

**Response 400:**
```json
{
  "success": false,
  "message": "Validation failed: voteType must be 'like' or 'dislike'",
  "data": null,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

#### GET /api/votes/recent?limit=10
Obtiene los últimos N votos.

**Query Parameters:**
- `limit` (optional): Número de votos a retornar (1-50, default: 10)

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "voteId": "507f1f77bcf86cd799439012",
      "characterId": "507f1f77bcf86cd799439011",
      "characterName": "Pikachu",
      "characterSource": "pokemon",
      "imageUrl": "https://...",
      "description": "Electric mouse Pokemon",
      "voteType": "like",
      "timestamp": "2026-01-31T10:30:00Z"
    }
  ],
  "timestamp": "2026-01-31T10:30:00Z"
}
```

#### GET /api/votes/last
Obtiene el último personaje evaluado.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "voteId": "507f1f77bcf86cd799439012",
    "characterId": "507f1f77bcf86cd799439011",
    "characterName": "Pikachu",
    "characterSource": "pokemon",
    "imageUrl": "https://...",
    "description": "Electric mouse Pokemon",
    "voteType": "like",
    "timestamp": "2026-01-31T10:30:00Z"
  },
  "timestamp": "2026-01-31T10:30:00Z"
}
```

**Response 404:**
```json
{
  "success": false,
  "message": "No evaluations have been made yet",
  "data": null,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

### Statistics Endpoints

#### GET /api/stats/most-liked
Obtiene el personaje con más likes.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "externalId": "25",
    "name": "Pikachu",
    "source": "pokemon",
    "imageUrl": "https://...",
    "description": "Electric mouse Pokemon",
    "totalLikes": 150,
    "totalDislikes": 30,
    "totalVotes": 180,
    "likePercentage": 83.33,
    "dislikePercentage": 16.67
  },
  "timestamp": "2026-01-31T10:30:00Z"
}
```

#### GET /api/stats/most-disliked
Obtiene el personaje con más dislikes.

**Response 200:** (Same structure as most-liked)

#### GET /api/stats/top-liked?limit=5
Obtiene los top N personajes con más likes.

**Query Parameters:**
- `limit` (optional): Número de personajes a retornar (1-50, default: 5)

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "externalId": "25",
      "name": "Pikachu",
      "source": "pokemon",
      "imageUrl": "https://...",
      "description": "Electric mouse Pokemon",
      "totalLikes": 150,
      "totalDislikes": 30,
      "totalVotes": 180,
      "likePercentage": 83.33,
      "dislikePercentage": 16.67
    }
  ],
  "timestamp": "2026-01-31T10:30:00Z"
}
```

#### GET /api/stats/top-disliked?limit=5
Obtiene los top N personajes con más dislikes.

**Query Parameters:**
- `limit` (optional): Número de personajes a retornar (1-50, default: 5)

**Response 200:** (Same structure as top-liked)

## External API Integration

### PokeAPI Integration

**Base URL**: `https://pokeapi.co/api/v2`

**Endpoints Used:**
- `GET /pokemon/{id}` - Obtener datos del Pokemon
- `GET /pokemon-species/{id}` - Obtener descripción del Pokemon

**Transformation Logic:**
```java
public CharacterDTO transformPokemonResponse(PokemonResponse pokemon, SpeciesResponse species) {
    return CharacterDTO.builder()
        .id(String.valueOf(pokemon.getId()))
        .externalId(String.valueOf(pokemon.getId()))
        .name(capitalize(pokemon.getName()))
        .source("pokemon")
        .imageUrl(pokemon.getSprites().getOther().getOfficialArtwork().getFrontDefault())
        .description(extractEnglishDescription(species.getFlavorTextEntries()))
        .build();
}
```

**Random Selection Strategy:**
- Generar ID aleatorio entre 1 y 898 (Gen 1-8)
- Llamar a `/pokemon/{id}`
- Llamar a `/pokemon-species/{id}` para descripción
- Transformar a CharacterDTO

### Rick and Morty API Integration

**Base URL**: `https://rickandmortyapi.com/api`

**Endpoints Used:**
- `GET /character/{id}` - Obtener datos del personaje

**Transformation Logic:**
```java
public CharacterDTO transformRickAndMortyResponse(RickAndMortyCharacter character) {
    String description = String.format("%s - %s from %s",
        character.getSpecies(),
        character.getStatus(),
        character.getOrigin().getName());
    
    return CharacterDTO.builder()
        .id(String.valueOf(character.getId()))
        .externalId(String.valueOf(character.getId()))
        .name(character.getName())
        .source("rickandmorty")
        .imageUrl(character.getImage())
        .description(description)
        .build();
}
```

**Random Selection Strategy:**
- Generar ID aleatorio entre 1 y 826
- Llamar a `/character/{id}`
- Transformar a CharacterDTO

### SuperHero API Integration

**Base URL**: `https://superheroapi.com/api/{access-token}`

**Endpoints Used:**
- `GET /{id}` - Obtener datos del superhéroe

**Transformation Logic:**
```java
public CharacterDTO transformSuperheroResponse(SuperheroResponse superhero) {
    String description = String.format("%s - %s",
        superhero.getBiography().getFullName(),
        superhero.getWork().getOccupation());
    
    return CharacterDTO.builder()
        .id(superhero.getId())
        .externalId(superhero.getId())
        .name(superhero.getName())
        .source("superhero")
        .imageUrl(superhero.getImage().getUrl())
        .description(description)
        .build();
}
```

**Random Selection Strategy:**
- Generar ID aleatorio entre 1 y 731
- Llamar a `/{id}`
- Transformar a CharacterDTO

### Retry and Resilience Strategy

```java
@Service
public class ExternalApiRetryService {
    
    private static final int MAX_RETRIES = 3;
    private static final long INITIAL_BACKOFF = 1000; // 1 second
    
    public <T> T executeWithRetry(Supplier<T> apiCall, String apiName) {
        int attempt = 0;
        Exception lastException = null;
        
        while (attempt < MAX_RETRIES) {
            try {
                return apiCall.get();
            } catch (RestClientException e) {
                lastException = e;
                attempt++;
                
                if (attempt < MAX_RETRIES) {
                    long backoff = INITIAL_BACKOFF * (long) Math.pow(2, attempt - 1);
                    log.warn("API call to {} failed (attempt {}/{}). Retrying in {}ms",
                        apiName, attempt, MAX_RETRIES, backoff);
                    
                    try {
                        Thread.sleep(backoff);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new ExternalApiException("Retry interrupted", ie);
                    }
                }
            }
        }
        
        log.error("All {} retry attempts failed for {}", MAX_RETRIES, apiName);
        throw new ExternalApiException(
            String.format("Failed to call %s after %d attempts", apiName, MAX_RETRIES),
            lastException
        );
    }
}
```

### Default Values for Missing Data

```java
public class CharacterMapper {
    
    private static final String DEFAULT_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";
    private static final String DEFAULT_DESCRIPTION = "No description available";
    private static final String DEFAULT_NAME = "Unknown";
    
    public static CharacterDTO withDefaults(CharacterDTO character) {
        return CharacterDTO.builder()
            .id(character.getId())
            .externalId(character.getExternalId())
            .name(character.getName() != null ? character.getName() : DEFAULT_NAME)
            .source(character.getSource())
            .imageUrl(character.getImageUrl() != null ? character.getImageUrl() : DEFAULT_IMAGE)
            .description(character.getDescription() != null ? character.getDescription() : DEFAULT_DESCRIPTION)
            .build();
    }
}
```

## Database Design

### Collections

#### characters Collection

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "externalId": "25",
  "name": "Pikachu",
  "source": "pokemon",
  "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  "description": "Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy.",
  "totalLikes": 150,
  "totalDislikes": 30,
  "totalVotes": 180,
  "createdAt": ISODate("2026-01-15T10:00:00Z"),
  "lastUpdated": ISODate("2026-01-31T10:30:00Z")
}
```

**Indexes:**
```javascript
db.characters.createIndex({ "externalId": 1, "source": 1 }, { unique: true })
db.characters.createIndex({ "name": 1 })
db.characters.createIndex({ "totalLikes": -1 })
db.characters.createIndex({ "totalDislikes": -1 })
db.characters.createIndex({ "lastUpdated": -1 })
```

#### votes Collection

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "character": {
    "$ref": "characters",
    "$id": ObjectId("507f1f77bcf86cd799439011")
  },
  "voteType": "like",
  "timestamp": ISODate("2026-01-31T10:30:00Z"),
  "createdAt": ISODate("2026-01-31T10:30:00Z")
}
```

**Indexes:**
```javascript
db.votes.createIndex({ "timestamp": -1 })
db.votes.createIndex({ "character": 1 })
db.votes.createIndex({ "voteType": 1 })
```

### Database Operations

#### Create Vote Transaction

```java
@Transactional
public VoteResponseDTO createVote(VoteRequestDTO request) {
    // 1. Find or create character
    Character character = characterRepository
        .findByExternalIdAndSource(request.getCharacterId(), request.getCharacterSource())
        .orElseGet(() -> {
            Character newChar = new Character();
            newChar.setExternalId(request.getCharacterId());
            newChar.setName(request.getCharacterName());
            newChar.setSource(request.getCharacterSource());
            newChar.setImageUrl(request.getImageUrl());
            newChar.setDescription(request.getDescription());
            newChar.setTotalLikes(0);
            newChar.setTotalDislikes(0);
            newChar.setTotalVotes(0);
            return characterRepository.save(newChar);
        });
    
    // 2. Update counters
    if ("like".equals(request.getVoteType())) {
        character.setTotalLikes(character.getTotalLikes() + 1);
    } else {
        character.setTotalDislikes(character.getTotalDislikes() + 1);
    }
    character.setTotalVotes(character.getTotalVotes() + 1);
    characterRepository.save(character);
    
    // 3. Create vote
    Vote vote = new Vote();
    vote.setCharacter(character);
    vote.setVoteType(request.getVoteType());
    vote.setTimestamp(LocalDateTime.now());
    vote = voteRepository.save(vote);
    
    // 4. Return response
    return VoteResponseDTO.builder()
        .voteId(vote.getId())
        .characterId(character.getId())
        .characterName(character.getName())
        .characterSource(character.getSource())
        .imageUrl(character.getImageUrl())
        .description(character.getDescription())
        .voteType(vote.getVoteType())
        .timestamp(vote.getTimestamp())
        .build();
}
```

#### Query Recent Votes with Character Info

```java
public List<VoteResponseDTO> getRecentVotes(Integer limit) {
    List<Vote> votes = voteRepository.findTopNByOrderByTimestampDesc(limit);
    
    return votes.stream()
        .map(vote -> {
            Character character = vote.getCharacter();
            return VoteResponseDTO.builder()
                .voteId(vote.getId())
                .characterId(character.getId())
                .characterName(character.getName())
                .characterSource(character.getSource())
                .imageUrl(character.getImageUrl())
                .description(character.getDescription())
                .voteType(vote.getVoteType())
                .timestamp(vote.getTimestamp())
                .build();
        })
        .collect(Collectors.toList());
}
```

### MongoDB Atlas Setup

1. **Create Cluster**: Usar tier gratuito M0
2. **Database**: `pikapikamatch`
3. **Collections**: `characters`, `votes`
4. **Network Access**: Permitir acceso desde cualquier IP (0.0.0.0/0) para desarrollo
5. **Database User**: Crear usuario con permisos de lectura/escritura
6. **Connection String**: Obtener URI de conexión

**Example Connection String:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pikapikamatch?retryWrites=true&w=majority
```

## Logging Strategy

### Logging Configuration (logback-spring.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/pikapikamatch.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/pikapikamatch.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <logger name="com.pikapikamatch" level="DEBUG"/>
    <logger name="org.springframework.web" level="INFO"/>
    <logger name="org.springframework.data.mongodb" level="DEBUG"/>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

### Logging Points

#### 1. HTTP Request Logging
```java
@Component
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {
        long startTime = System.currentTimeMillis();
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            log.info("HTTP {} {} - Status: {} - Duration: {}ms",
                request.getMethod(),
                request.getRequestURI(),
                response.getStatus(),
                duration);
        }
    }
}
```

#### 2. Service Layer Logging
```java
@Service
@Slf4j
public class VoteService {
    
    public VoteResponseDTO createVote(VoteRequestDTO request) {
        log.debug("Creating vote for character: {} ({})", 
            request.getCharacterName(), request.getCharacterSource());
        
        try {
            // ... business logic
            log.info("Vote created successfully: characterId={}, voteType={}", 
                character.getId(), request.getVoteType());
            return response;
        } catch (Exception e) {
            log.error("Error creating vote for character: {}", 
                request.getCharacterName(), e);
            throw e;
        }
    }
}
```

#### 3. External API Logging
```java
@Service
@Slf4j
public class PokeApiService {
    
    public CharacterDTO getRandomPokemon() {
        int pokemonId = random.nextInt(898) + 1;
        log.debug("Fetching Pokemon with ID: {}", pokemonId);
        
        try {
            PokemonResponse response = restTemplate.getForObject(
                "/pokemon/" + pokemonId, PokemonResponse.class);
            log.info("Successfully fetched Pokemon: {}", response.getName());
            return transform(response);
        } catch (RestClientException e) {
            log.error("Failed to fetch Pokemon with ID: {}", pokemonId, e);
            throw new ExternalApiException("PokeAPI call failed", e);
        }
    }
}
```

#### 4. Error Logging
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("An unexpected error occurred"));
    }
}
```

### Log Levels

- **ERROR**: Errores críticos que requieren atención inmediata
- **WARN**: Situaciones anormales que no impiden el funcionamiento
- **INFO**: Eventos importantes del sistema (votos creados, APIs llamadas)
- **DEBUG**: Información detallada para debugging (parámetros, flujo de ejecución)
- **TRACE**: Información muy detallada (no usado en este proyecto)

## Documentation

### Swagger/OpenAPI Documentation

La API estará documentada con Swagger UI accesible en `/swagger-ui.html`.

**Annotations Example:**
```java
@RestController
@RequestMapping("/api/characters")
@Tag(name = "Characters", description = "Character management endpoints")
public class CharacterController {
    
    @Operation(
        summary = "Get random character",
        description = "Returns a random character from Pokemon, Rick and Morty, or Superhero APIs"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Character retrieved successfully",
            content = @Content(schema = @Schema(implementation = CharacterDTO.class))
        ),
        @ApiResponse(
            responseCode = "503",
            description = "All external APIs are unavailable"
        )
    })
    @GetMapping("/random")
    public ResponseEntity<ApiResponse<CharacterDTO>> getRandomCharacter() {
        // implementation
    }
}
```

### Postman Collection

El proyecto incluirá una colección de Postman con:

**Structure:**
```
PikaPikaMatch API/
├── Characters/
│   ├── Get Random Character
│   └── Get Pikachu Status
├── Votes/
│   ├── Create Vote
│   ├── Get Recent Votes
│   └── Get Last Evaluated
└── Statistics/
    ├── Get Most Liked
    ├── Get Most Disliked
    ├── Get Top Liked
    └── Get Top Disliked
```

**Environment Variables:**
```json
{
  "name": "PikaPikaMatch Local",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:8080",
      "enabled": true
    },
    {
      "key": "api_prefix",
      "value": "/api",
      "enabled": true
    }
  ]
}
```

**Example Request:**
```json
{
  "name": "Create Vote - Like Pikachu",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"characterId\": \"25\",\n  \"characterName\": \"Pikachu\",\n  \"characterSource\": \"pokemon\",\n  \"voteType\": \"like\",\n  \"imageUrl\": \"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png\",\n  \"description\": \"Electric mouse Pokemon\"\n}"
    },
    "url": {
      "raw": "{{base_url}}{{api_prefix}}/votes",
      "host": ["{{base_url}}"],
      "path": ["{{api_prefix}}", "votes"]
    }
  }
}
```

### README Documentation

El README.md incluirá:

1. **Descripción del Proyecto**
2. **Requisitos Previos**
   - Java 21
   - Maven 3.8+
   - MongoDB Atlas account
   - SuperHero API key

3. **Instalación Paso a Paso**
   ```bash
   # 1. Clonar repositorio
   git clone https://github.com/user/pikapikamatch-backend.git
   cd pikapikamatch-backend
   
   # 2. Configurar variables de entorno
   cp .env.example .env
   # Editar .env con tus credenciales
   
   # 3. Instalar dependencias
   mvn clean install
   
   # 4. Ejecutar aplicación
   mvn spring-boot:run
   ```

4. **Configuración de MongoDB Atlas**
   - Link a tutorial de creación de cluster
   - Pasos para obtener connection string
   - Configuración de network access

5. **Configuración de SuperHero API**
   - Link para obtener API key
   - Instrucciones de configuración

6. **Endpoints Disponibles**
   - Lista de todos los endpoints con ejemplos

7. **Testing**
   ```bash
   mvn test
   ```

8. **Documentación API**
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - Postman Collection: `/postman/PikaPikaMatch-API.postman_collection.json`

9. **Troubleshooting**
   - Problemas comunes y soluciones

## Maven Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.1</version>
        <relativePath/>
    </parent>
    
    <groupId>com.pikapikamatch</groupId>
    <artifactId>backend</artifactId>
    <version>1.0.0</version>
    <name>PikaPikaMatch Backend</name>
    <description>Backend API for PikaPikaMatch voting system</description>
    
    <properties>
        <java.version>21</java.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>21</source>
                    <target>21</target>
                </configuration>
            </plugin>
            
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.0.0</version>
            </plugin>
        </plugins>
    </build>
</project>
```

## Development Workflow

### Local Development Setup

1. **Install Prerequisites**
   - Java 21 (OpenJDK or Oracle JDK)
   - Maven 3.8+
   - IDE (IntelliJ IDEA, Eclipse, or VS Code)
   - MongoDB Compass (optional, for database visualization)

2. **Clone and Configure**
   ```bash
   git clone <repository-url>
   cd pikapikamatch-backend
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Setup MongoDB Atlas**
   - Create free cluster at mongodb.com/cloud/atlas
   - Create database user
   - Whitelist IP address (0.0.0.0/0 for development)
   - Copy connection string to .env

4. **Get SuperHero API Key**
   - Visit superheroapi.com
   - Sign up and get API key
   - Add to .env file

5. **Run Application**
   ```bash
   mvn spring-boot:run
   ```

6. **Verify Setup**
   - API: http://localhost:8080/api/characters/random
   - Swagger: http://localhost:8080/swagger-ui.html
   - Health: http://localhost:8080/actuator/health (if actuator is added)

### Development Commands

```bash
# Clean and compile
mvn clean compile

# Run tests
mvn test

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Package application
mvn clean package

# Run packaged JAR
java -jar target/backend-1.0.0.jar

# Skip tests during build
mvn clean package -DskipTests
```

### Code Quality

```bash
# Run checkstyle (if configured)
mvn checkstyle:check

# Generate test coverage report (if jacoco is configured)
mvn jacoco:report
```

## Security Considerations

### Environment Variables Security

- Never commit `.env` file to version control
- Use `.env.example` as template
- Rotate API keys regularly
- Use different credentials for dev/prod

### CORS Configuration

- Restrict allowed origins in production
- Use specific domains instead of wildcards
- Enable credentials only when necessary

### Input Validation

- Validate all user inputs
- Use Bean Validation annotations
- Sanitize strings to prevent injection

### Error Messages

- Don't expose sensitive information in error messages
- Log detailed errors server-side
- Return generic messages to clients

### MongoDB Security

- Use strong passwords
- Enable IP whitelisting
- Use connection string with SSL
- Limit user permissions to necessary operations

## Performance Considerations

### Database Optimization

- Proper indexing on frequently queried fields
- Use projections to limit returned fields
- Avoid N+1 queries with proper lookups
- Monitor slow queries

### API Response Time

- Target: < 500ms for most endpoints
- External API calls: 5s timeout
- Use async processing for heavy operations (if needed)

### Memory Management

- Limit result set sizes (max 50 items)
- Use pagination for large datasets
- Monitor heap usage

### Caching Strategy

- No caching implemented (as per requirements)
- Future: Consider caching external API responses

## Future Enhancements

### Phase 2 Features

- User authentication with JWT
- Rate limiting per user/IP
- WebSocket support for real-time updates
- Admin dashboard endpoints
- Batch operations for votes
- Export statistics to CSV/PDF
- Email notifications
- Scheduled tasks for data cleanup

### Technical Improvements

- Add Spring Boot Actuator for monitoring
- Implement caching with Redis
- Add API versioning
- Implement GraphQL endpoint
- Add database migrations with Liquibase
- Containerize with Docker
- CI/CD pipeline with GitHub Actions
- Performance monitoring with Micrometer
- Distributed tracing with Sleuth/Zipkin
