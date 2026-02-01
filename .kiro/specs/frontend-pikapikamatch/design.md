# Design Document - PikaPikaMatch Frontend

## Overview

PikaPikaMatch es una aplicación web responsive de votación de personajes que permite a los usuarios evaluar personajes de diferentes universos mediante un sistema de like/dislike. El frontend será desarrollado como una Single Page Application (SPA) usando React con TypeScript, Tailwind CSS para estilos, y un sistema de APIs mock para desarrollo independiente del backend.

La aplicación seguirá un diseño mobile-first con breakpoints responsive, implementará microinteracciones fluidas, y mantendrá consistencia visual mediante un sistema de componentes reutilizables.

## Architecture

### Technology Stack

- **Framework**: React 18+ con TypeScript
- **Styling**: Tailwind CSS con configuración personalizada
- **Routing**: React Router v6
- **State Management**: React Context API + Custom Hooks
- **Animations**: Framer Motion para microinteracciones
- **Icons**: Material Symbols (Google Icons)
- **Fonts**: Plus Jakarta Sans (Google Fonts)
- **Build Tool**: Vite
- **Mock API**: MSW (Mock Service Worker) o custom mock service

### Application Structure

```
front/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── NavigationBar.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   └── features/
│   │       ├── CharacterCard.tsx
│   │       ├── VoteButtons.tsx
│   │       ├── StatsCard.tsx
│   │       └── RecentlyEvaluatedList.tsx
│   ├── pages/
│   │   ├── SplashScreen.tsx
│   │   ├── VotingView.tsx
│   │   └── DexView.tsx
│   ├── services/
│   │   ├── mockApi.ts
│   │   └── characterService.ts
│   ├── hooks/
│   │   ├── useCharacters.ts
│   │   ├── useVoting.ts
│   │   └── useStats.ts
│   ├── context/
│   │   └── VotingContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── animations.ts
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### Architectural Patterns

1. **Component-Based Architecture**: Separación clara entre componentes UI reutilizables, componentes de layout, y componentes de features
2. **Container/Presentational Pattern**: Páginas actúan como containers que manejan lógica, componentes presentan UI
3. **Custom Hooks**: Encapsulación de lógica de negocio y efectos secundarios
4. **Context API**: Gestión de estado global para votaciones y personajes
5. **Service Layer**: Abstracción de llamadas a API mediante servicios

## Components and Interfaces

### Core Components

#### 1. Button Component
```typescript
interface ButtonProps {
  variant: 'like' | 'dislike' | 'icon' | 'default';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

Responsabilidades:
- Renderizar botones con variantes predefinidas
- Aplicar animaciones de hover y active
- Manejar estados disabled

#### 2. Card Component
```typescript
interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'stacked';
  onClick?: () => void;
}
```

Responsabilidades:
- Proporcionar contenedor con estilos consistentes
- Soportar variante stacked para efecto de profundidad
- Aplicar sombras y bordes según diseño

#### 3. CharacterCard Component
```typescript
interface CharacterCardProps {
  character: Character;
  onLike: () => void;
  onDislike: () => void;
  showVoteButtons?: boolean;
  isAnimating?: boolean;
  animationType?: 'like' | 'dislike' | null;
}
```

Responsabilidades:
- Mostrar imagen del personaje con aspect ratio 4:5
- Renderizar nombre, descripción y tags
- Aplicar animaciones de like/dislike
- Mostrar efecto de tarjetas apiladas

#### 4. VoteButtons Component
```typescript
interface VoteButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  disabled?: boolean;
  layout?: 'horizontal' | 'sides';
}
```

Responsabilidades:
- Renderizar botones de like y dislike
- Adaptar layout según viewport (mobile/desktop)
- Aplicar microinteracciones al hacer click

#### 5. NavigationBar Component
```typescript
interface NavigationBarProps {
  activeView: 'vote' | 'dex';
  onNavigate: (view: 'vote' | 'dex') => void;
}
```

Responsabilidades:
- Mostrar navegación inferior con iconos
- Indicar vista activa con estilos
- Aplicar animaciones de hover

#### 6. StatsCard Component
```typescript
interface StatsCardProps {
  character: Character;
  stats: {
    likes: number;
    dislikes: number;
    percentage: number;
  };
  variant: 'favorite' | 'controversial';
}
```

Responsabilidades:
- Mostrar thumbnail del personaje
- Renderizar estadísticas de likes/dislikes
- Aplicar badge según variante

#### 7. RecentlyEvaluatedList Component
```typescript
interface RecentlyEvaluatedListProps {
  characters: EvaluatedCharacter[];
}
```

Responsabilidades:
- Renderizar lista de personajes evaluados
- Mostrar badge de like/dislike
- Ordenar por fecha descendente

### Page Components

#### 1. SplashScreen
Responsabilidades:
- Mostrar branding y elementos decorativos
- Auto-transición después de 2 segundos
- Aplicar animaciones de entrada

#### 2. VotingView
Responsabilidades:
- Cargar personaje actual desde servicio
- Manejar eventos de votación
- Gestionar transiciones entre personajes
- Mostrar animaciones de like/dislike

#### 3. DexView
Responsabilidades:
- Cargar estadísticas desde servicio
- Renderizar secciones de favoritos y controversiales
- Mostrar lista de personajes evaluados recientemente
- Implementar scroll horizontal con snap

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Aspect ratio consistency
*For any* character card rendered in the application, the card SHALL maintain a 4:5 aspect ratio regardless of viewport size or character data
**Validates: Requirements 2.3**

### Property 2: Vote API invocation
*For any* vote action (like or dislike), the system SHALL call the mock API endpoint with the correct vote data
**Validates: Requirements 3.4**

### Property 3: Button interaction feedback
*For any* button press in the application, the system SHALL apply a scale-down transformation animation
**Validates: Requirements 3.6**

### Property 4: Navigation bar presence
*For any* main view (voting or dex), the system SHALL display the bottom navigation bar with both Vote and Dex options
**Validates: Requirements 5.1**

### Property 5: Active navigation styling
*For any* active navigation item, the system SHALL apply filled icon style and primary color
**Validates: Requirements 5.4**

### Property 6: Favorite character badge
*For any* character displayed in the favorites section, the system SHALL show a green heart badge on the thumbnail
**Validates: Requirements 6.3**

### Property 7: Controversial character badge
*For any* character displayed in the controversial section, the system SHALL show a red X badge on the thumbnail
**Validates: Requirements 6.4**

### Property 8: Character statistics display
*For any* character with statistics shown, the system SHALL display the like or dislike percentage
**Validates: Requirements 6.5**

### Property 9: Recently evaluated character information
*For any* recently evaluated character displayed, the system SHALL show thumbnail, name, and type information
**Validates: Requirements 7.2**

### Property 10: Recently evaluated vote badge
*For any* recently evaluated character shown, the system SHALL display a badge indicating like or dislike
**Validates: Requirements 7.3**

### Property 11: Chronological ordering
*For any* recently evaluated list rendered, the system SHALL display characters in reverse chronological order with most recent first
**Validates: Requirements 7.4**

### Property 12: Button animation timing
*For any* button interaction, the system SHALL apply scale transformation animation with duration between 150-200ms
**Validates: Requirements 9.1**

### Property 13: Navigation hover animation
*For any* navigation item hovered on desktop, the system SHALL apply a translate-up animation
**Validates: Requirements 9.5**

### Property 14: Mock API usage for characters
*For any* character data request, the system SHALL use the mock API service
**Validates: Requirements 10.1**

### Property 15: Mock API usage for votes
*For any* vote submission, the system SHALL call the mock API endpoint
**Validates: Requirements 10.2**

### Property 16: Mock API usage for statistics
*For any* statistics request, the system SHALL use the mock API service
**Validates: Requirements 10.3**

### Property 17: Mock API latency simulation
*For any* mock API call, the system SHALL simulate network latency with a delay between 200-500ms
**Validates: Requirements 10.4**

### Property 18: Character data completeness
*For any* character loaded in the application, the system SHALL include name, imageUrl, type, source, and description fields
**Validates: Requirements 10.6**

## Data Models

### Character Model
```typescript
interface Character {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  source: 'pokemon' | 'rickandmorty' | 'superhero';
}
```

### Vote Model
```typescript
interface Vote {
  characterId: string;
  type: 'like' | 'dislike';
  timestamp: number;
}
```

### EvaluatedCharacter Model
```typescript
interface EvaluatedCharacter extends Character {
  vote: 'like' | 'dislike';
  votedAt: number;
}
```

### CharacterStats Model
```typescript
interface CharacterStats {
  characterId: string;
  likes: number;
  dislikes: number;
  totalVotes: number;
  likePercentage: number;
  dislikePercentage: number;
}
```

### VotingState Model
```typescript
interface VotingState {
  currentCharacter: Character | null;
  votedCharacters: EvaluatedCharacter[];
  isLoading: boolean;
  error: string | null;
}
```

## Error Handling

### Error Types
1. **Network Errors**: Fallos en llamadas a mock API
2. **Data Validation Errors**: Datos inválidos o incompletos
3. **State Errors**: Estados inconsistentes en la aplicación

### Error Handling Strategy
- Usar try-catch en servicios y hooks
- Mostrar mensajes de error amigables al usuario
- Implementar fallbacks para datos faltantes
- Log de errores en consola para debugging

### Error UI Components
```typescript
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}
```

## Testing Strategy

### Unit Testing
- **Componentes UI**: Probar renderizado y props
- **Hooks personalizados**: Probar lógica de estado y efectos
- **Servicios**: Probar transformación de datos y manejo de errores
- **Utilidades**: Probar funciones puras

Herramientas: Vitest + React Testing Library

### Integration Testing
- **Flujos de votación**: Probar interacción completa de votar personajes
- **Navegación**: Probar transiciones entre vistas
- **Mock API**: Probar integración con servicios mock

### E2E Testing (Opcional)
- Flujo completo: Splash → Votación → Estadísticas
- Responsive behavior en diferentes viewports

Herramientas: Playwright o Cypress

## Responsive Design

### Breakpoints
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
  }
}
```

### Mobile Layout (< 768px)
- Navegación inferior fija
- Botones de votación debajo de la tarjeta
- Tarjeta centrada con max-width
- Header compacto

### Desktop Layout (≥ 768px)
- Navegación inferior centrada
- Botones de votación a los lados de la tarjeta
- Tarjeta más grande con hover effects
- Header con mayor spacing

### Responsive Patterns
- Mobile-first approach
- Fluid typography con clamp()
- Flexible images con object-fit
- Touch-friendly tap targets (min 44x44px)

## Animation and Microinteractions

### Animation Library
Framer Motion para animaciones complejas y gestos

### Key Animations

#### 1. Like Animation
```typescript
const likeAnimation = {
  button: {
    scale: [1, 1.2, 1],
    boxShadow: ['0 0 0 0 rgba(134, 239, 172, 0)', '0 0 25px 5px rgba(134, 239, 172, 0.6)', '0 0 0 0 rgba(134, 239, 172, 0)']
  },
  sparkles: {
    opacity: [0, 1, 0],
    scale: [0, 1, 1.5],
    y: [0, -50, -100]
  }
}
```

#### 2. Dislike Animation
```typescript
const dislikeAnimation = {
  button: {
    scale: [1, 0.95, 1],
    boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 20px 4px rgba(239, 68, 68, 0.4)', '0 0 0 0 rgba(239, 68, 68, 0)']
  },
  image: {
    filter: ['sepia(0%) saturate(100%) hue-rotate(0deg)', 'sepia(100%) saturate(300%) hue-rotate(-50deg)']
  },
  overlay: {
    opacity: [0, 0.3],
    scale: [0.5, 1]
  }
}
```

#### 3. Card Transition
```typescript
const cardTransition = {
  exit: {
    x: (direction: 'left' | 'right') => direction === 'left' ? -300 : 300,
    opacity: 0,
    rotate: (direction: 'left' | 'right') => direction === 'left' ? -10 : 10,
    transition: { duration: 0.3 }
  },
  enter: {
    x: 0,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.3 }
  }
}
```

#### 4. Button Hover/Active
```typescript
const buttonInteraction = {
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
}
```

### Gesture Support
- Swipe left: Dislike
- Swipe right: Like
- Threshold: 100px
- Velocity consideration para gestos rápidos

## Mock API Service

### Mock Data Structure
```typescript
const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Pikachu',
    imageUrl: 'https://...',
    description: 'Pika Pika! A chubby, electric-type Pokémon...',
    source: 'pokemon',
  },
  // ... más personajes
];
```

### Mock API Endpoints

#### GET /api/characters/random
Retorna un personaje aleatorio que no ha sido votado

```typescript
async function getRandomCharacter(): Promise<Character> {
  await simulateDelay(300);
  // Filtrar personajes no votados
  // Retornar uno aleatorio
}
```

#### POST /api/votes
Registra un voto (simulado)

```typescript
async function submitVote(vote: Vote): Promise<{ success: boolean }> {
  await simulateDelay(200);
  // Guardar en localStorage o estado
  return { success: true };
}
```

#### GET /api/stats/favorites
Retorna top personajes con más likes

```typescript
async function getFavorites(limit: number = 3): Promise<CharacterStats[]> {
  await simulateDelay(400);
  // Calcular estadísticas
  // Ordenar por likes
  // Retornar top N
}
```

#### GET /api/stats/controversial
Retorna personajes con más dislikes

```typescript
async function getControversial(limit: number = 2): Promise<CharacterStats[]> {
  await simulateDelay(400);
  // Calcular estadísticas
  // Ordenar por dislikes
  // Retornar top N
}
```

#### GET /api/votes/recent
Retorna últimos personajes evaluados

```typescript
async function getRecentVotes(limit: number = 4): Promise<EvaluatedCharacter[]> {
  await simulateDelay(300);
  // Obtener de localStorage
  // Ordenar por timestamp descendente
  // Retornar últimos N
}
```

### Data Persistence
Usar localStorage para simular persistencia:
- Votos realizados
- Personajes evaluados
- Estadísticas acumuladas

## Styling System

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FCD34D',
        secondary: '#F9A8D4',
        accent: '#6EE7B7',
        'background-light': '#FFFBEB',
        'background-dark': '#292524',
        'card-light': '#ffffff',
        'card-dark': '#1c1917',
        'pastel-red': '#FCA5A5',
        'pastel-green': '#86EFAC',
        'pastel-pink': '#FBCFE8',
        'pastel-yellow': '#FEF08A',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px'
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(252, 211, 77, 0.15)',
        card: '0 20px 50px -12px rgba(252, 211, 77, 0.25)',
        'glow-green': '0 0 25px 5px rgba(134, 239, 172, 0.6)',
        'glow-red': '0 0 20px 4px rgba(239, 68, 68, 0.4)',
      }
    }
  }
}
```

### Design Tokens
```typescript
export const DESIGN_TOKENS = {
  spacing: {
    cardPadding: '1.5rem',
    sectionGap: '2rem',
    buttonGap: '3rem'
  },
  timing: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  aspectRatio: {
    card: '4/5'
  }
} as const;
```

## Performance Considerations

### Optimization Strategies
1. **Code Splitting**: Lazy load de páginas con React.lazy()
2. **Image Optimization**: Usar loading="lazy" y aspect-ratio CSS
3. **Memoization**: useMemo y useCallback para cálculos costosos
4. **Virtual Scrolling**: Para listas largas (si es necesario)
5. **Bundle Size**: Tree-shaking y análisis con vite-bundle-visualizer

### Performance Metrics
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- Cumulative Layout Shift (CLS) < 0.1

## Accessibility

### WCAG 2.1 Compliance
- Contraste de colores AA (4.5:1 para texto normal)
- Navegación por teclado completa
- ARIA labels en botones de iconos
- Focus visible en elementos interactivos
- Alt text en imágenes de personajes

### Semantic HTML
- Uso correcto de elementos semánticos (nav, main, section)
- Headings jerárquicos (h1, h2, h3)
- Buttons vs Links según contexto

### Screen Reader Support
- Anuncios de cambios de estado
- Descripciones de animaciones
- Labels descriptivos en controles

## Development Workflow

### Setup Steps
1. Inicializar proyecto con Vite + React + TypeScript
2. Instalar dependencias (Tailwind, Framer Motion, React Router)
3. Configurar Tailwind con tema personalizado
4. Crear estructura de carpetas
5. Implementar mock API service
6. Desarrollar componentes UI base
7. Implementar páginas y routing
8. Agregar animaciones y microinteracciones
9. Testing y refinamiento

### Development Commands
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run test         # Ejecutar tests
npm run lint         # Linting
```

## Future Enhancements

### Phase 2 Features (Post-MVP)
- Integración con backend real
- Autenticación de usuarios
- Perfiles de usuario con historial
- Compartir resultados en redes sociales
- Filtros por fuente de personajes
- Búsqueda de personajes
- Modo offline con Service Workers
- Animaciones más complejas con GSAP
- Sonidos de feedback

### Technical Debt Considerations
- Migrar de Context API a Zustand si el estado crece
- Implementar caching más sofisticado
- Optimizar bundle size
- Mejorar cobertura de tests
