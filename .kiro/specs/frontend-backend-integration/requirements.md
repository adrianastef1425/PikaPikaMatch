# Requirements Document - Frontend-Backend Integration

## Introduction

Este documento define los requisitos para integrar el frontend de PikaPikaMatch con el backend REST API. La integración reemplazará el sistema de APIs mock actual con llamadas reales a los endpoints del backend, implementará manejo de errores robusto, y asegurará que la experiencia de usuario se mantenga fluida durante las operaciones de red.

El frontend actualmente utiliza servicios mock que simulan respuestas del backend. Esta integración conectará el frontend con los endpoints reales implementados en el backend Java/Spring Boot, manteniendo la misma interfaz de usuario pero con datos persistentes y sincronizados.

## Glossary

- **API Client**: Módulo que encapsula la lógica de comunicación HTTP con el backend
- **Environment Variable**: Variable de configuración que almacena la URL base del backend
- **HTTP Client**: Biblioteca para realizar peticiones HTTP (fetch API o axios)
- **Error Boundary**: Componente React que captura errores de renderizado
- **Loading State**: Estado de la aplicación mientras se espera respuesta del servidor
- **Retry Logic**: Lógica para reintentar peticiones fallidas
- **CORS**: Cross-Origin Resource Sharing, mecanismo que permite peticiones entre dominios
- **Base URL**: URL raíz del backend API (ej: http://localhost:8080/api)
- **Response DTO**: Data Transfer Object que define la estructura de respuestas del backend
- **Request Payload**: Datos enviados en el cuerpo de una petición HTTP

## Requirements

### Requirement 1

**User Story:** Como desarrollador frontend, quiero configurar la URL del backend mediante variables de entorno, para poder cambiar entre entornos de desarrollo, staging y producción sin modificar código.

#### Acceptance Criteria

1. WHEN the application initializes THEN the system SHALL read the backend base URL from an environment variable named VITE_API_BASE_URL
2. WHEN the environment variable is not set THEN the system SHALL default to "http://localhost:8080/api"
3. WHEN the API client is instantiated THEN the system SHALL use the configured base URL for all HTTP requests
4. WHEN the application is built for production THEN the system SHALL allow overriding the base URL through environment-specific configuration files
5. WHEN the base URL is configured THEN the system SHALL ensure it does not include a trailing slash

### Requirement 2

**User Story:** Como usuario, quiero que la aplicación obtenga personajes aleatorios desde el backend, para votar por personajes con datos reales y persistentes.

#### Acceptance Criteria

1. WHEN the voting view loads THEN the system SHALL send a GET request to /characters/random endpoint
2. WHEN the backend responds with a character THEN the system SHALL transform the response to match the frontend Character interface
3. WHEN the character is received THEN the system SHALL display it in the character card with image, name, description, and source
4. WHEN the backend returns HTTP status 503 THEN the system SHALL display an error message indicating that external services are temporarily unavailable
5. WHEN the request fails due to network error THEN the system SHALL retry up to 2 times before showing an error message

### Requirement 3

**User Story:** Como usuario, quiero que mis votos se registren en el backend, para que mis preferencias sean persistidas y contribuyan a las estadísticas globales.

#### Acceptance Criteria

1. WHEN the user clicks the like button THEN the system SHALL send a POST request to /votes endpoint with characterId, characterName, characterSource, voteType "like", imageUrl, and description
2. WHEN the user clicks the dislike button THEN the system SHALL send a POST request to /votes endpoint with characterId, characterName, characterSource, voteType "dislike", imageUrl, and description
3. WHEN the backend responds with HTTP status 201 THEN the system SHALL proceed with the vote animation and load the next character
4. WHEN the backend responds with HTTP status 400 THEN the system SHALL display an error message indicating invalid vote data
5. WHEN the vote request fails THEN the system SHALL allow the user to retry the vote or skip to the next character

### Requirement 4

**User Story:** Como usuario, quiero ver estadísticas reales de personajes más votados, para conocer las preferencias actuales de la comunidad basadas en datos persistentes.

#### Acceptance Criteria

1. WHEN the Dex view loads THEN the system SHALL send a GET request to /stats/top-liked endpoint with limit parameter set to 5
2. WHEN the Dex view loads THEN the system SHALL send a GET request to /stats/top-disliked endpoint with limit parameter set to 5
3. WHEN the backend responds with statistics THEN the system SHALL transform the response to match the frontend CharacterStats interface
4. WHEN statistics are received THEN the system SHALL display them in the favorites and controversial sections with percentages
5. WHEN the backend returns HTTP status 404 THEN the system SHALL display a message indicating no data is available yet

### Requirement 5

**User Story:** Como usuario, quiero ver los personajes que he evaluado recientemente desde datos persistentes, para tener un historial consistente incluso después de recargar la página.

#### Acceptance Criteria

1. WHEN the Dex view loads THEN the system SHALL send a GET request to /votes/recent endpoint with limit parameter set to 10
2. WHEN the backend responds with recent votes THEN the system SHALL transform the response to match the frontend EvaluatedCharacter interface
3. WHEN recent votes are received THEN the system SHALL display them in the recently evaluated section with vote badges
4. WHEN the backend returns HTTP status 404 THEN the system SHALL display a message indicating no evaluations have been made yet
5. WHEN recent votes are displayed THEN the system SHALL show them in reverse chronological order

### Requirement 6

**User Story:** Como usuario, quiero ver indicadores visuales de carga durante las operaciones de red, para saber que la aplicación está procesando mi solicitud.

#### Acceptance Criteria

1. WHEN any API request is initiated THEN the system SHALL display a loading spinner or skeleton UI
2. WHEN a character is being fetched THEN the system SHALL show a loading state in the character card area
3. WHEN statistics are being fetched THEN the system SHALL show loading skeletons in the stats sections
4. WHEN a vote is being submitted THEN the system SHALL disable vote buttons and show a loading indicator
5. WHEN an API response is received THEN the system SHALL remove the loading indicator and display the content

### Requirement 7

**User Story:** Como usuario, quiero recibir mensajes de error claros cuando algo falla, para entender qué sucedió y qué puedo hacer al respecto.

#### Acceptance Criteria

1. WHEN a network error occurs THEN the system SHALL display a user-friendly error message indicating connection problems
2. WHEN the backend returns HTTP status 400 THEN the system SHALL display the error message from the backend response
3. WHEN the backend returns HTTP status 404 THEN the system SHALL display a message indicating the requested resource was not found
4. WHEN the backend returns HTTP status 500 THEN the system SHALL display a generic error message and suggest trying again later
5. WHEN an error message is displayed THEN the system SHALL provide a "Retry" button to attempt the operation again

### Requirement 8

**User Story:** Como desarrollador, quiero un cliente HTTP centralizado, para mantener consistencia en el manejo de peticiones, respuestas y errores.

#### Acceptance Criteria

1. WHEN the API client is created THEN the system SHALL configure default headers including Content-Type application/json
2. WHEN any API request is made THEN the system SHALL automatically include the base URL prefix
3. WHEN a response is received THEN the system SHALL parse JSON automatically and extract the data field from the ApiResponse wrapper
4. WHEN an HTTP error occurs THEN the system SHALL throw a custom error with the status code and message from the backend
5. WHEN a request timeout occurs THEN the system SHALL abort the request after 10 seconds and throw a timeout error

### Requirement 9

**User Story:** Como usuario, quiero que la aplicación maneje errores de CORS correctamente, para recibir mensajes claros si hay problemas de configuración.

#### Acceptance Criteria

1. WHEN a CORS error occurs THEN the system SHALL detect it and display a specific error message indicating a configuration issue
2. WHEN the backend is not accessible THEN the system SHALL display a message indicating the server is not reachable
3. WHEN CORS is properly configured THEN the system SHALL successfully make requests from the frontend domain
4. WHEN preflight OPTIONS requests are sent THEN the system SHALL handle them transparently without user impact
5. WHEN CORS errors are detected THEN the system SHALL log detailed information to the console for debugging

### Requirement 10

**User Story:** Como desarrollador, quiero eliminar el código de APIs mock, para simplificar el codebase y evitar confusión entre implementaciones mock y reales.

#### Acceptance Criteria

1. WHEN the integration is complete THEN the system SHALL remove all mock API service files
2. WHEN the integration is complete THEN the system SHALL remove mock data generators and fixtures
3. WHEN the integration is complete THEN the system SHALL update all service imports to use the real API client
4. WHEN the integration is complete THEN the system SHALL remove localStorage-based persistence used by mocks
5. WHEN the integration is complete THEN the system SHALL update documentation to reflect the real API integration

### Requirement 11

**User Story:** Como desarrollador, quiero mapear las respuestas del backend a los tipos TypeScript del frontend, para mantener type safety y prevenir errores en tiempo de ejecución.

#### Acceptance Criteria

1. WHEN a character response is received THEN the system SHALL map the backend CharacterDTO to the frontend Character interface
2. WHEN a vote response is received THEN the system SHALL map the backend VoteResponseDTO to the frontend Vote interface
3. WHEN statistics are received THEN the system SHALL map the backend CharacterStatsDTO to the frontend CharacterStats interface
4. WHEN field names differ between backend and frontend THEN the system SHALL transform them appropriately (e.g., externalId to id)
5. WHEN optional fields are missing in the response THEN the system SHALL provide default values to maintain type safety

### Requirement 12

**User Story:** Como usuario, quiero que la aplicación maneje desconexiones de red gracefully, para poder continuar usando funcionalidades offline cuando sea posible.

#### Acceptance Criteria

1. WHEN the network connection is lost THEN the system SHALL detect it and display an offline indicator
2. WHEN the user attempts an action while offline THEN the system SHALL display a message indicating no connection is available
3. WHEN the network connection is restored THEN the system SHALL automatically retry pending operations
4. WHEN the application is offline THEN the system SHALL disable features that require network connectivity
5. WHEN the application detects online status THEN the system SHALL remove the offline indicator and re-enable network features

### Requirement 13

**User Story:** Como desarrollador, quiero logging estructurado de operaciones de red, para facilitar debugging y monitoreo de la integración.

#### Acceptance Criteria

1. WHEN an API request is initiated THEN the system SHALL log the HTTP method, endpoint, and request payload
2. WHEN an API response is received THEN the system SHALL log the status code, response time, and response data
3. WHEN an API error occurs THEN the system SHALL log the error type, status code, and error message
4. WHEN logging is enabled THEN the system SHALL use different log levels (info, warn, error) appropriately
5. WHEN the application is in production mode THEN the system SHALL reduce logging verbosity to errors only

### Requirement 14

**User Story:** Como usuario, quiero que las imágenes de personajes se carguen eficientemente, para tener una experiencia visual fluida sin tiempos de espera largos.

#### Acceptance Criteria

1. WHEN a character image URL is received THEN the system SHALL validate that it is a valid URL
2. WHEN an image is loading THEN the system SHALL display a placeholder or skeleton
3. WHEN an image fails to load THEN the system SHALL display a fallback placeholder image
4. WHEN multiple images are displayed THEN the system SHALL implement lazy loading for images outside the viewport
5. WHEN an image loads successfully THEN the system SHALL apply a fade-in animation for smooth appearance

### Requirement 15

**User Story:** Como desarrollador, quiero tests de integración para los servicios de API, para asegurar que la comunicación con el backend funciona correctamente.

#### Acceptance Criteria

1. WHEN integration tests run THEN the system SHALL mock HTTP responses using a testing library like MSW
2. WHEN testing character fetching THEN the system SHALL verify that the correct endpoint is called and data is transformed properly
3. WHEN testing vote submission THEN the system SHALL verify that the correct payload is sent and responses are handled
4. WHEN testing error scenarios THEN the system SHALL verify that errors are caught and displayed appropriately
5. WHEN tests complete THEN the system SHALL achieve at least 80% coverage of API client and service code

### Requirement 16

**User Story:** Como desarrollador, quiero documentación clara de la integración, para facilitar el mantenimiento y onboarding de nuevos desarrolladores.

#### Acceptance Criteria

1. WHEN the integration is complete THEN the system SHALL include a README section documenting the API client architecture
2. WHEN the integration is complete THEN the system SHALL document all environment variables required for configuration
3. WHEN the integration is complete THEN the system SHALL provide examples of how to add new API endpoints
4. WHEN the integration is complete THEN the system SHALL document error handling patterns and retry logic
5. WHEN the integration is complete THEN the system SHALL include a troubleshooting guide for common integration issues

