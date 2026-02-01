# PikaPikaMatch Frontend

Aplicación web responsive de votación de personajes desarrollada con React, TypeScript, Tailwind CSS y Framer Motion.

## Tecnologías

- **React 19** con TypeScript
- **Vite** como build tool
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **React Router** para navegación

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes UI reutilizables (Button, Card, etc.)
│   ├── layout/          # Componentes de layout (Header, MainLayout)
│   └── features/        # Componentes de features (CharacterCard, VoteButtons, etc.)
├── pages/               # Páginas de la aplicación
├── services/            # Servicios y APIs
├── hooks/               # Custom hooks
├── context/             # Context providers
├── types/               # TypeScript types e interfaces
└── utils/               # Utilidades y constantes
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## Configuración

El proyecto está configurado con:
- TypeScript en modo strict
- Tailwind CSS con tema personalizado
- Fuente: Plus Jakarta Sans
- Iconos: Material Symbols
- Breakpoints responsive: mobile (<768px), desktop (≥768px)

### Variables de Entorno

El frontend requiere las siguientes variables de entorno:

```bash
# URL base del backend API
VITE_API_BASE_URL=http://localhost:8080/api
```

Crea un archivo `.env` en la raíz del proyecto frontend con estas variables. Un archivo `.env.example` está disponible como plantilla.

**Nota:** Las variables de entorno en Vite deben tener el prefijo `VITE_` para ser expuestas al código del cliente.

## Desarrollo

1. Instalar dependencias: `npm install`
2. Iniciar servidor de desarrollo: `npm run dev`
3. Abrir http://localhost:5173

## Design Tokens

Los tokens de diseño están definidos en `src/utils/constants.ts`:
- Colores personalizados (primary, secondary, accent, pasteles)
- Espaciado y timing de animaciones
- Aspect ratios y breakpoints

## Performance Optimizations

El proyecto implementa múltiples optimizaciones de rendimiento:

### Code Splitting
- Lazy loading de páginas con React.lazy
- Chunks separados para vendors (React, Framer Motion)
- Bundle total: ~127 KB (gzipped)

### Component Optimization
- Todos los componentes usan React.memo()
- Hooks optimizados con useCallback y useMemo
- Context optimizado para prevenir re-renders innecesarios

### Image Optimization
- Lazy loading nativo en todas las imágenes
- Aspect ratio CSS para prevenir layout shifts

### Build Optimization
- Minificación con Terser
- Tree-shaking automático
- Vendor chunk splitting para mejor caching
- Console.log removido en producción

Ver [PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md) para más detalles.
