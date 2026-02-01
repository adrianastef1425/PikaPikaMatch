# Requirements Document - PikaPikaMatch Backend

## Introduction

PikaPikaMatch Backend es una API RESTful que proporciona servicios de gestión de personajes y votaciones para la aplicación PikaPikaMatch. El backend integra datos de tres APIs externas (Pokémon, Rick and Morty, y Superhéroes), almacena votaciones en MongoDB Atlas, y expone endpoints para consultar estadísticas y gestionar el sistema de likes/dislikes.

Este documento define los requisitos para el backend de la aplicación, que será desarrollado como una API REST con Java y Spring Boot, integrando múltiples fuentes de datos externas y proporcionando persistencia mediante MongoDB Atlas.

## Glossary

- **Character**: Entidad almacenada en MongoDB que representa un personaje con sus estadísticas acumuladas de votación
- **Vote**: Registro de votación individual que referencia un Character mediante su ID
- **External API**: Servicio externo que proporciona datos de personajes (PokeAPI, Rick and Morty API, SuperHero API)
- **MongoDB Atlas**: Servicio de base de datos MongoDB en la nube con capa gratuita
- **Collection**: Estructura de almacenamiento en MongoDB equivalente a una tabla en bases de datos relacionales
- **Endpoint**: Ruta HTTP que expone funcionalidad específica de la API
- **CORS**: Cross-Origin Resource Sharing, mecanismo de seguridad para permitir peticiones desde el frontend
- **Environment Variable**: Variable de configuración almacenada fuera del código fuente
- **Aggregation Pipeline**: Secuencia de operaciones de MongoDB para procesar y transformar datos
- **DTO**: Data Transfer Object, objeto que transporta datos entre procesos
- **RestTemplate**: Cliente HTTP de Spring para consumir APIs REST externas
- **Transaction**: Operación atómica que garantiza consistencia entre múltiples operaciones de base de datos

## Requirements

### Requirement 1

**User Story:** Como sistema frontend, quiero obtener un personaje aleatorio de cualquier fuente, para presentarlo al usuario en la vista de votación.

#### Acceptance Criteria

1. WHEN the frontend requests a random character THEN the system SHALL select randomly from one of the three external APIs (Pokémon, Rick and Morty, Superhéroes)
2. WHEN a character is fetched from an external API THEN the system SHALL transform the response to a unified Character schema with fields: id, name, imageUrl, description, and source
3. WHEN a character is successfully retrieved THEN the system SHALL return it with HTTP status 200 and the character data in JSON format
4. WHEN an external API call fails THEN the system SHALL retry with a different API source
5. WHEN all external API sources fail THEN the system SHALL return HTTP status 503 with an error message indicating service unavailability

### Requirement 2

**User Story:** Como sistema frontend, quiero registrar votos de like o dislike para personajes, para mantener un historial de votaciones y actualizar estadísticas.

#### Acceptance Criteria

1. WHEN the frontend submits a vote THEN the system SHALL validate that the request includes characterId, characterName, characterSource, voteType, and imageUrl fields
2. WHEN a vote is validated and the character does not exist in the database THEN the system SHALL create a new Character document with the provided data and initialize vote counters to zero
3. WHEN a vote is validated and the character exists THEN the system SHALL increment the appropriate counter (totalLikes or totalDislikes) in the Character document
4. WHEN vote counters are updated THEN the system SHALL create a new Vote document referencing the Character ID and including voteType and timestamp
5. WHEN both operations complete successfully THEN the system SHALL return HTTP status 201 with a success message and the created vote ID
6. WHEN a vote request has missing required fields THEN the system SHALL return HTTP status 400 with a descriptive error message
7. WHEN a vote request has an invalid voteType value THEN the system SHALL return HTTP status 400 with an error message indicating valid values are "like" or "dislike"

### Requirement 3

**User Story:** Como sistema frontend, quiero consultar el personaje con más likes, para mostrarlo en la sección de favoritos de la comunidad.

#### Acceptance Criteria

1. WHEN the frontend requests the most liked character THEN the system SHALL query the Characters collection sorted by totalLikes descending
2. WHEN the query is complete THEN the system SHALL return the character with the highest like count including fields: id, externalId, name, source, imageUrl, description, totalLikes, totalDislikes, and totalVotes
3. WHEN multiple characters have the same like count THEN the system SHALL return the character with the most recent lastUpdated timestamp
4. WHEN no characters exist in the database THEN the system SHALL return HTTP status 404 with a message indicating no data is available
5. WHEN the query is successful THEN the system SHALL return HTTP status 200 with the character data

### Requirement 4

**User Story:** Como sistema frontend, quiero consultar el personaje con más dislikes, para mostrarlo en la sección de personajes controversiales.

#### Acceptance Criteria

1. WHEN the frontend requests the most disliked character THEN the system SHALL query the Characters collection sorted by totalDislikes descending
2. WHEN the query is complete THEN the system SHALL return the character with the highest dislike count including fields: id, externalId, name, source, imageUrl, description, totalLikes, totalDislikes, and totalVotes
3. WHEN multiple characters have the same dislike count THEN the system SHALL return the character with the most recent lastUpdated timestamp
4. WHEN no characters exist in the database THEN the system SHALL return HTTP status 404 with a message indicating no data is available
5. WHEN the query is successful THEN the system SHALL return HTTP status 200 with the character data

### Requirement 5

**User Story:** Como sistema frontend, quiero consultar el último personaje evaluado, para mostrarlo en la interfaz de usuario.

#### Acceptance Criteria

1. WHEN the frontend requests the last evaluated character THEN the system SHALL query the Votes collection for the most recent vote by timestamp descending
2. WHEN the most recent vote is found THEN the system SHALL perform a lookup to the Characters collection to retrieve complete character information
3. WHEN the lookup is complete THEN the system SHALL return the vote with fields: voteId, characterId, characterName, characterSource, imageUrl, description, voteType, and timestamp
4. WHEN no votes exist in the database THEN the system SHALL return HTTP status 404 with a message indicating no evaluations have been made
5. WHEN the query is successful THEN the system SHALL return HTTP status 200 with the vote data

### Requirement 6

**User Story:** Como sistema frontend, quiero consultar el estado de Pikachu específicamente, para mostrar información detallada de este personaje popular.

#### Acceptance Criteria

1. WHEN the frontend requests Pikachu status THEN the system SHALL query the Characters collection for a character where name matches "Pikachu" (case-insensitive)
2. WHEN Pikachu is found in the database THEN the system SHALL return: id, externalId, name, source, imageUrl, description, totalLikes, totalDislikes, totalVotes, and likePercentage
3. WHEN Pikachu is not found in the database THEN the system SHALL fetch Pikachu data from PokeAPI and return it with zero votes and a message indicating no votes have been registered
4. WHEN Pikachu data cannot be found in any source THEN the system SHALL return HTTP status 404 with a message indicating Pikachu data is unavailable
5. WHEN the query is successful THEN the system SHALL return HTTP status 200 with Pikachu statistics

### Requirement 7

**User Story:** Como sistema frontend, quiero obtener los top N personajes con más likes, para mostrar un ranking de favoritos.

#### Acceptance Criteria

1. WHEN the frontend requests top liked characters with a limit parameter THEN the system SHALL validate that limit is a positive integer between 1 and 50
2. WHEN the limit is valid THEN the system SHALL query the Characters collection sorted by totalLikes descending with the specified limit
3. WHEN the query is complete THEN the system SHALL return an array of characters with fields: id, externalId, name, source, imageUrl, description, totalLikes, totalDislikes, totalVotes, and likePercentage
4. WHEN no limit parameter is provided THEN the system SHALL default to returning 5 characters
5. WHEN the query is successful THEN the system SHALL return HTTP status 200 with the array of characters

### Requirement 8

**User Story:** Como sistema frontend, quiero obtener los top N personajes con más dislikes, para mostrar un ranking de controversiales.

#### Acceptance Criteria

1. WHEN the frontend requests top disliked characters with a limit parameter THEN the system SHALL validate that limit is a positive integer between 1 and 50
2. WHEN the limit is valid THEN the system SHALL query the Characters collection sorted by totalDislikes descending with the specified limit
3. WHEN the query is complete THEN the system SHALL return an array of characters with fields: id, externalId, name, source, imageUrl, description, totalLikes, totalDislikes, totalVotes, and dislikePercentage
4. WHEN no limit parameter is provided THEN the system SHALL default to returning 5 characters
5. WHEN the query is successful THEN the system SHALL return HTTP status 200 with the array of characters

### Requirement 9

**User Story:** Como sistema frontend, quiero obtener los últimos N personajes evaluados, para mostrar el historial reciente de votaciones.

#### Acceptance Criteria

1. WHEN the frontend requests recent evaluations with a limit parameter THEN the system SHALL validate that limit is a positive integer between 1 and 50
2. WHEN the limit is valid THEN the system SHALL query the Votes collection sorted by timestamp descending with the specified limit
3. WHEN the query is complete THEN the system SHALL perform lookups to the Characters collection to retrieve complete character information for each vote
4. WHEN lookups are complete THEN the system SHALL return an array of votes with fields: voteId, characterId, characterName, characterSource, imageUrl, description, voteType, and timestamp
5. WHEN no limit parameter is provided THEN the system SHALL default to returning 10 votes
6. WHEN the query is successful THEN the system SHALL return HTTP status 200 with the array of votes

### Requirement 10

**User Story:** Como administrador del sistema, quiero que las credenciales y configuraciones sensibles estén protegidas, para mantener la seguridad de la aplicación.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL load all sensitive configuration from environment variables including MONGODB_URI, PORT, SUPERHERO_API_KEY, and CORS_ORIGIN
2. WHEN an environment variable is missing THEN the system SHALL log a warning and use a documented default value or fail to start if the variable is critical
3. WHEN the SuperHero API key is required THEN the system SHALL read it from the SUPERHERO_API_KEY environment variable
4. WHEN MongoDB connection is established THEN the system SHALL use the connection string from MONGODB_URI environment variable
5. WHEN environment variables are accessed THEN the system SHALL never log or expose their values in API responses or error messages

### Requirement 11

**User Story:** Como sistema frontend desplegado en un dominio diferente, quiero que el backend permita peticiones CORS, para poder comunicarme con la API.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL configure CORS middleware to accept requests from allowed origins
2. WHEN a preflight OPTIONS request is received THEN the system SHALL respond with appropriate CORS headers including Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers
3. WHEN the CORS_ORIGIN environment variable is set THEN the system SHALL use it to determine allowed origins
4. WHEN the CORS_ORIGIN environment variable is not set THEN the system SHALL default to allowing localhost origins for development
5. WHEN a request from a non-allowed origin is received THEN the system SHALL reject it with HTTP status 403

### Requirement 12

**User Story:** Como administrador del sistema, quiero que la API maneje errores de forma consistente, para facilitar el debugging y proporcionar mensajes claros al frontend.

#### Acceptance Criteria

1. WHEN an error occurs in any endpoint THEN the system SHALL catch it and return a JSON response with fields: success (false), error (message), and optionally details
2. WHEN a validation error occurs THEN the system SHALL return HTTP status 400 with a descriptive error message
3. WHEN a resource is not found THEN the system SHALL return HTTP status 404 with a message indicating what resource was not found
4. WHEN an external API fails THEN the system SHALL return HTTP status 503 with a message indicating the service is temporarily unavailable
5. WHEN an unexpected error occurs THEN the system SHALL return HTTP status 500, log the full error details, and return a generic error message to the client

### Requirement 13

**User Story:** Como administrador del sistema, quiero que las llamadas a APIs externas sean resilientes, para manejar fallos temporales y rate limits.

#### Acceptance Criteria

1. WHEN an external API call fails with a network error THEN the system SHALL retry up to 3 times with exponential backoff
2. WHEN an external API returns HTTP status 429 (rate limit) THEN the system SHALL wait for the specified retry-after period before retrying
3. WHEN an external API call times out THEN the system SHALL cancel the request after 5 seconds and try an alternative API source
4. WHEN all retry attempts fail THEN the system SHALL log the error details and return an error response to the client
5. WHEN external API responses are received THEN the system SHALL validate the response structure before processing

### Requirement 14

**User Story:** Como desarrollador, quiero documentación de la API en formato Postman y Swagger, para facilitar testing e integración.

#### Acceptance Criteria

1. WHEN the project is delivered THEN the system SHALL include a Postman collection file with all API endpoints
2. WHEN each endpoint is documented THEN the collection SHALL include example requests with all required parameters
3. WHEN each endpoint is documented THEN the collection SHALL include example responses for success and error cases
4. WHEN environment-specific values are needed THEN the collection SHALL use Postman variables for base URL and API keys
5. WHEN the application runs THEN the system SHALL expose Swagger UI at /swagger-ui.html with interactive API documentation

### Requirement 15

**User Story:** Como sistema, quiero transformar datos de APIs externas a un formato unificado, para proporcionar una interfaz consistente al frontend.

#### Acceptance Criteria

1. WHEN a Pokémon is fetched from PokeAPI THEN the system SHALL transform it to include: id (pokemon number), name, imageUrl (official artwork), description (from species endpoint), and source ("pokemon")
2. WHEN a Rick and Morty character is fetched THEN the system SHALL transform it to include: id, name, imageUrl, description (species + status + origin), and source ("rickandmorty")
3. WHEN a Superhero is fetched from SuperHero API THEN the system SHALL transform it to include: id, name, imageUrl, description (biography full-name + work occupation), and source ("superhero")
4. WHEN an external API returns incomplete data THEN the system SHALL provide default values: "Unknown" for missing text fields and a placeholder image URL for missing images
5. WHEN character data is transformed THEN the system SHALL ensure all required fields are present before returning to the client

### Requirement 16

**User Story:** Como administrador del sistema, quiero logs estructurados de las operaciones, para monitorear el comportamiento de la API y diagnosticar problemas.

#### Acceptance Criteria

1. WHEN any HTTP request is received THEN the system SHALL log the method, path, status code, and response time
2. WHEN an external API is called THEN the system SHALL log the API name, endpoint, and response status
3. WHEN an error occurs THEN the system SHALL log the error message, stack trace, and relevant context
4. WHEN a vote is created THEN the system SHALL log the characterId and voteType
5. WHEN logs are written THEN the system SHALL use SLF4J with Logback and include timestamp, level, and message fields

### Requirement 17

**User Story:** Como sistema, quiero validar datos de entrada en todos los endpoints, para prevenir datos inválidos en la base de datos.

#### Acceptance Criteria

1. WHEN a vote is submitted THEN the system SHALL validate that characterId is a non-empty string
2. WHEN a vote is submitted THEN the system SHALL validate that voteType is exactly "like" or "dislike"
3. WHEN a query parameter for limit is provided THEN the system SHALL validate it is a positive integer
4. WHEN validation fails THEN the system SHALL return HTTP status 400 with a message specifying which field failed validation
5. WHEN all validations pass THEN the system SHALL proceed with the request processing
