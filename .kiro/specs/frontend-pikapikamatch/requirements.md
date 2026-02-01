# Requirements Document - PikaPikaMatch Frontend

## Introduction

PikaPikaMatch es una aplicación web responsive de votación de personajes que permite a los usuarios evaluar personajes de diferentes universos (Pokémon, Rick and Morty, y Superhéroes) mediante un sistema de "like" y "dislike" similar a aplicaciones de matching. La aplicación presenta una interfaz atractiva con microinteracciones, mantiene relación de aspecto consistente en las imágenes, y proporciona estadísticas globales de votación.

Este documento define los requisitos para el frontend de la aplicación, que será desarrollado como una aplicación web responsive (mobile-first y desktop) utilizando APIs mock para las interacciones con el backend.

## Glossary

- **Character**: Entidad que representa un personaje de cualquiera de las tres fuentes (Pokémon, Rick and Morty, Superhéroes)
- **Vote**: Acción del usuario de dar "like" o "dislike" a un personaje
- **Dex**: Vista de estadísticas que muestra rankings y personajes evaluados recientemente
- **Card**: Componente UI que muestra la información visual de un personaje
- **Splash Screen**: Pantalla de bienvenida inicial de la aplicación
- **Mock API**: Implementación simulada de endpoints de backend que retorna datos estáticos o generados localmente
- **Responsive Design**: Diseño que se adapta a diferentes tamaños de pantalla (mobile y desktop)
- **Microinteraction**: Animación o feedback visual sutil en respuesta a acciones del usuario
- **Aspect Ratio**: Relación proporcional entre ancho y alto de una imagen

## Requirements

### Requirement 1

**User Story:** Como usuario, quiero ver una pantalla de bienvenida atractiva al iniciar la aplicación, para tener una primera impresión positiva del producto.

#### Acceptance Criteria

1. WHEN the application loads for the first time THEN the system SHALL display a splash screen with the PikaPikaMatch branding
2. WHEN the splash screen is displayed THEN the system SHALL show decorative elements (sparkles, stars) with appropriate opacity levels
3. WHEN the splash screen is visible THEN the system SHALL display the tagline "SPARKLE EVERY DAY" below the main title
4. WHEN 2 seconds have elapsed THEN the system SHALL automatically transition to the voting view
5. WHEN the splash screen is rendered THEN the system SHALL apply the same visual design for both mobile and desktop viewports

### Requirement 2

**User Story:** Como usuario, quiero ver personajes presentados en tarjetas visuales atractivas, para poder evaluarlos fácilmente basándome en su apariencia e información.

#### Acceptance Criteria

1. WHEN a character card is displayed THEN the system SHALL show the character image occupying 75% of the card height
2. WHEN a character card is rendered THEN the system SHALL display the character name, type tags, and description in the remaining 25% of the card
3. WHEN a character card is displayed THEN the system SHALL maintain a consistent 4:5 aspect ratio
4. WHEN the user hovers over a character card on desktop THEN the system SHALL apply a subtle scale transformation to the character image
5. WHEN a character card is rendered THEN the system SHALL show two stacked card shadows behind the current card to create depth and indicate more characters are available

### Requirement 3

**User Story:** Como usuario, quiero votar por personajes usando botones de like y dislike, para expresar mi preferencia de manera intuitiva.

#### Acceptance Criteria

1. WHEN the voting view is displayed THEN the system SHALL show two action buttons: a red dislike button with an X icon and a green like button with a heart icon
2. WHEN the user clicks the like button THEN the system SHALL trigger a like animation with sparkles appearing across the screen
3. WHEN the user clicks the dislike button THEN the system SHALL apply a red monochrome filter to the character image and show a large X overlay
4. WHEN a vote is registered THEN the system SHALL send the vote data to the mock API endpoint
5. WHEN a vote animation completes THEN the system SHALL load and display the next character card
6. WHEN a vote button is pressed THEN the system SHALL apply an active scale-down transformation for tactile feedback

### Requirement 5

**User Story:** Como usuario, quiero navegar entre la vista de votación y la vista de estadísticas, para alternar entre votar y ver resultados globales.

#### Acceptance Criteria

1. WHEN the application is in any main view THEN the system SHALL display a bottom navigation bar with two options: Vote and Dex
2. WHEN the user clicks the Vote navigation item THEN the system SHALL navigate to the voting view and highlight the Vote icon
3. WHEN the user clicks the Dex navigation item THEN the system SHALL navigate to the statistics view and highlight the Dex icon
4. WHEN a navigation item is active THEN the system SHALL apply a filled icon style and primary color to indicate the current view
5. WHEN the user hovers over a navigation item on desktop THEN the system SHALL apply a translate-up animation to the icon

### Requirement 6

**User Story:** Como usuario, quiero ver estadísticas globales de personajes más votados, para conocer las preferencias de la comunidad.

#### Acceptance Criteria

1. WHEN the Dex view is displayed THEN the system SHALL fetch and show a "Community Favorites" section with the top 5 most liked characters
2. WHEN the Dex view is displayed THEN the system SHALL fetch and show a "Most Controversial" section with the top 5 most disliked characters
3. WHEN a character appears in the favorites section THEN the system SHALL display a green heart badge on the character thumbnail
4. WHEN a character appears in the controversial section THEN the system SHALL display a red X badge on the character thumbnail
5. WHEN character statistics are shown THEN the system SHALL display the like or dislike percentage for each character
6. WHEN the favorites or controversial sections are rendered THEN the system SHALL display them as horizontally scrollable lists with snap scrolling

### Requirement 7

**User Story:** Como usuario, quiero ver los personajes que he evaluado recientemente, para recordar mis votaciones anteriores.

#### Acceptance Criteria

1. WHEN the Dex view is displayed THEN the system SHALL fetch and show a "Recently Evaluated" section with the last 5 voted characters
2. WHEN a recently evaluated character is displayed THEN the system SHALL show the character thumbnail, name, and type information
3. WHEN a recently evaluated character is shown THEN the system SHALL display a badge indicating whether it received a like or dislike
4. WHEN the recently evaluated list is rendered THEN the system SHALL display characters in reverse chronological order with the most recent first

### Requirement 8

**User Story:** Como usuario, quiero que la aplicación funcione correctamente en dispositivos móviles y de escritorio, para poder usarla en cualquier dispositivo.

#### Acceptance Criteria

1. WHEN the application is accessed on a mobile device with viewport width less than 768px THEN the system SHALL render the mobile-optimized layout
2. WHEN the application is accessed on a desktop device with viewport width 768px or greater THEN the system SHALL render the desktop-optimized layout
3. WHEN the desktop layout is active THEN the system SHALL display vote buttons on the sides of the character card instead of below it
4. WHEN the mobile layout is active THEN the system SHALL display vote buttons below the character card in a horizontal arrangement
5. WHEN the viewport is resized THEN the system SHALL dynamically adjust the layout without requiring a page reload
6. WHEN touch gestures are available THEN the system SHALL support swipe left for dislike and swipe right for like on the character card

### Requirement 9

**User Story:** Como usuario, quiero experimentar microinteracciones fluidas, para tener una experiencia de uso agradable y moderna.

#### Acceptance Criteria

1. WHEN the user interacts with any button THEN the system SHALL apply a scale transformation animation with a duration of 150-200ms
2. WHEN a like vote is registered THEN the system SHALL display sparkle emojis appearing randomly across the screen with fade-out animations
3. WHEN a dislike vote is registered THEN the system SHALL apply a red color filter to the character image with a transition duration of 300ms
4. WHEN the like button is clicked THEN the system SHALL apply a green glow shadow effect to the button
5. WHEN navigation items are hovered THEN the system SHALL apply a smooth translate-up animation
6. WHEN a character card transitions out THEN the system SHALL apply a slide and fade animation before showing the next card

### Requirement 10

**User Story:** Como usuario, quiero que la aplicación use datos mock mientras el backend no esté disponible, para poder desarrollar y probar el frontend de manera independiente.

#### Acceptance Criteria

1. WHEN the application requests character data THEN the system SHALL use a mock API service that returns predefined character objects
2. WHEN a vote is submitted THEN the system SHALL call a mock API endpoint that simulates a successful response without persisting data
3. WHEN statistics are requested THEN the system SHALL use a mock API service that returns predefined ranking and recently evaluated data
4. WHEN the mock API is called THEN the system SHALL simulate network latency with a delay between 200-500ms
5. WHEN mock data is generated THEN the system SHALL include characters from all three sources: Pokemon, Rick and Morty, and Superheroes
6. WHEN the application initializes THEN the system SHALL load mock character data that includes name, image URL, type, source, and description fields

### Requirement 11

**User Story:** Como desarrollador, quiero que la aplicación use componentes UI reutilizables, para mantener consistencia visual y facilitar el mantenimiento del código.

#### Acceptance Criteria

1. WHEN character cards are rendered in different views THEN the system SHALL use a shared Card component with configurable props
2. WHEN buttons are rendered throughout the application THEN the system SHALL use a shared Button component with variant props for styling
3. WHEN navigation is rendered THEN the system SHALL use a shared NavigationBar component
4. WHEN the application structure is examined THEN the system SHALL organize components in a logical folder structure separating layout, UI, and feature components
