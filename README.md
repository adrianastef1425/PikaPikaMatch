# PikaPikaMatch 🎮

Aplicación web de votación de personajes que permite a los usuarios votar entre dos personajes aleatorios de diferentes universos (Pokémon, Rick and Morty, Superhéroes) y ver estadísticas de votación en tiempo real.

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
  - [Base de Datos](#1-base-de-datos-mongodb-atlas)
  - [Backend](#2-backend)
  - [Frontend](#3-frontend)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Flujos de la Aplicación](#-flujos-de-la-aplicación)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)

## 🚀 Tecnologías

### Backend
- **Java 21** - Lenguaje de programación
- **Spring Boot 3.2.2** - Framework principal
- **Spring Data MongoDB** - Persistencia de datos
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de código boilerplate
- **SpringDoc OpenAPI** - Documentación API (Swagger)
- **JUnit 5 + Mockito** - Testing

### Frontend
- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Animaciones
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### Base de Datos
- **MongoDB Atlas** - Base de datos NoSQL en la nube

### APIs Externas
- **PokeAPI** - Datos de Pokémon
- **Rick and Morty API** - Datos de personajes de Rick and Morty
- **SuperHero API** - Datos de superhéroes

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Java 21 o superior** - [Descargar](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.8+** - [Descargar](https://maven.apache.org/download.cgi)
- **Node.js 18+** y **npm** - [Descargar](https://nodejs.org/)
- **Cuenta MongoDB Atlas** - [Crear cuenta gratuita](https://www.mongodb.com/cloud/atlas/register)
- **SuperHero API Key** - [Obtener key](https://superheroapi.com/)

## 🔧 Instalación

### 1. Base de Datos (MongoDB Atlas)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crea un nuevo cluster (el tier gratuito es suficiente)
3. Configura el acceso a la red:
   - Ve a "Network Access"
   - Añade tu IP o permite acceso desde cualquier lugar (0.0.0.0/0) para desarrollo
4. Crea un usuario de base de datos:
   - Ve a "Database Access"
   - Crea un nuevo usuario con permisos de lectura/escritura
5. Obtén tu connection string:
   - Ve a "Database" → "Connect" → "Connect your application"
   - Copia el connection string (formato: `mongodb+srv://...`)
   - Reemplaza `<password>` con tu contraseña

### 2. Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

3. Configura las variables de entorno en el archivo `.env`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/PikaPikaMatch?retryWrites=true&w=majority

# SuperHero API Key
SUPERHERO_API_KEY=TU_API_KEY_AQUI

# Server Configuration
PORT=8080

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

4. Estas variables del `.env` se mapean automáticamente en el `application.yml`:

**Archivo `.env`:**
```env
MONGODB_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/PikaPikaMatch
SUPERHERO_API_KEY=7bccb599656ee06afaacdfffa3332a49
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

**Se reemplaza en `application.yml`:**
```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://usuario:pass@cluster.mongodb.net/PikaPikaMatch  # ← MONGODB_URI

server:
  port: 8080  # ← PORT (o valor por defecto)

external:
  apis:
    superhero:
      api-key: 7bccb599656ee06afaacdfffa3332a49  # ← SUPERHERO_API_KEY

cors:
  allowed-origins: http://localhost:5173  # ← CORS_ORIGIN
```

**Nota:** El proyecto usa la librería `dotenv-java` para cargar automáticamente las variables del archivo `.env` al iniciar la aplicación.

5. Instala las dependencias y compila el proyecto:
```bash
mvn clean install
```

6. Ejecuta el backend:
```bash
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

**Documentación API (Swagger):** `http://localhost:8080/swagger-ui.html`


### 3. Frontend

1. Navega al directorio del frontend:
```bash
cd front
```

2. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

3. Configura las variables de entorno en `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_DEBUG_API=true
```

4. Instala las dependencias:
```bash
npm install
```

5. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
pikapikamatch/
├── backend/                          # Backend Java Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/pikapikamatch/
│   │   │   │   ├── config/          # Configuración (CORS, MongoDB, APIs)
│   │   │   │   ├── controller/      # Controladores REST
│   │   │   │   ├── service/         # Lógica de negocio
│   │   │   │   ├── repository/      # Acceso a datos (MongoDB)
│   │   │   │   ├── model/           # Entidades y DTOs
│   │   │   │   ├── exception/       # Excepciones personalizadas
│   │   │   │   ├── filter/          # Filtros HTTP
│   │   │   │   └── util/            # Utilidades
│   │   │   └── resources/
│   │   │       └── application.yml  # Configuración de Spring
│   │   └── test/                    # Tests unitarios
│   ├── logs/                        # Logs de la aplicación
│   └── pom.xml                      # Dependencias Maven
│
├── front/                           # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Componentes UI reutilizables
│   │   │   ├── layout/              # Layouts (Header, MainLayout)
│   │   │   └── features/            # Componentes de features
│   │   ├── pages/                   # Páginas de la aplicación
│   │   │   ├── SplashScreen.tsx     # Pantalla de inicio
│   │   │   ├── VotingView.tsx       # Vista de votación
│   │   │   └── DexView.tsx          # Vista de estadísticas
│   │   ├── services/                # Servicios API
│   │   │   ├── api/                 # Cliente Axios
│   │   │   ├── characterService.ts  # Servicio de personajes
│   │   │   ├── voteService.ts       # Servicio de votación
│   │   │   └── statsService.ts      # Servicio de estadísticas
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useCharacters.ts     # Hook para personajes
│   │   │   ├── useVoting.ts         # Hook para votación
│   │   │   └── useStats.ts          # Hook para estadísticas
│   │   ├── context/                 # Context API
│   │   │   └── VotingContext.tsx    # Estado global de votación
│   │   ├── types/                   # Tipos TypeScript
│   │   └── utils/                   # Utilidades y constantes
│   ├── public/                      # Archivos estáticos
│   └── package.json                 # Dependencias npm
│
└── mockups/                         # Diseños UI
    ├── desktop/                     # Mockups desktop
    └── mobile/                      # Mockups mobile
```

## 🔄 Flujos de la Aplicación

### 1. Flujo de Inicio
```
Usuario accede → SplashScreen → Animación de bienvenida → VotingView
```

### 2. Flujo de Votación
```
1. Frontend solicita un personaje aleatorio
   ↓
2. Backend consulta una API externa aleatoria (PokeAPI, Rick&Morty o SuperHero)
   ↓
3. Backend retorna 1 personaje aleatorio
   ↓
4. Usuario visualiza el personaje con animaciones
   ↓
5. Usuario vota (Like ❤️ o Dislike ✖️)
   ↓
6. Frontend envía voto al backend
   ↓
7. Backend actualiza/crea el contador del personaje en MongoDB
   ↓
8. Frontend muestra animación de confirmación
   ↓
9. Se carga un nuevo personaje aleatorio (vuelve al paso 1)
```

### 3. Flujo de Estadísticas (DexView)
```
1. Usuario navega a DexView
   ↓
2. Frontend solicita estadísticas al backend
   ↓
3. Backend consulta MongoDB y calcula:
   - Total de votos
   - Top personajes más votados
   - Top personajes menos votados
   - Distribución por universo
   ↓
4. Frontend muestra estadísticas con animaciones
   ↓
5. Usuario puede filtrar por universo
```

### 4. Flujo de Datos Backend

```
Controller → Service → Repository → MongoDB
    ↓           ↓
    ↓      External APIs
    ↓      (PokeAPI, etc.)
    ↓
Response DTO
```

### 5. Arquitectura de Componentes Frontend

```
App
├── MainLayout
│   ├── Header (navegación)
│   └── Outlet (páginas)
│       ├── SplashScreen
│       ├── VotingView
│       │   ├── CharacterCard
│       │   └── VoteButtons
│       └── DexView
│           ├── StatsCard
│           └── CharacterList
```

## 🔐 Variables de Entorno

### Backend (.env)
```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/PikaPikaMatch

# APIs Externas
SUPERHERO_API_KEY=tu_api_key

# Servidor
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
# API Backend
VITE_API_BASE_URL=http://localhost:8080/api

# Debug (opcional)
VITE_DEBUG_API=true
```

## 📜 Scripts Disponibles

### Backend
```bash
# Compilar proyecto
mvn clean install

# Ejecutar aplicación
mvn spring-boot:run

# Ejecutar tests
mvn test

# Empaquetar JAR
mvn package
```

### Frontend
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

## 🧪 Testing

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd front
npm run lint
```

## 📚 Documentación Adicional

- [Backend README](./backend/README.md) - Documentación detallada del backend
- [Frontend README](./front/README.md) - Documentación detallada del frontend
- [API Documentation](http://localhost:8080/swagger-ui.html) - Swagger UI (requiere backend ejecutándose)

## 🎨 Características

- ✅ Votación entre personajes de múltiples universos
- ✅ Animaciones fluidas con Framer Motion
- ✅ Diseño responsive (mobile y desktop)
- ✅ Estadísticas en tiempo real
- ✅ Integración con APIs externas
- ✅ Persistencia de datos en MongoDB
- ✅ Documentación API con Swagger
- ✅ Optimizaciones de rendimiento (code splitting, lazy loading)

## 🐛 Troubleshooting

### Backend no inicia
- Verifica que Java 21 esté instalado: `java -version`
- Verifica que MongoDB URI sea correcto
- Revisa los logs en `backend/logs/`

### Frontend no conecta con Backend
- Verifica que el backend esté ejecutándose en el puerto correcto
- Verifica CORS_ORIGIN en backend/.env
- Verifica VITE_API_BASE_URL en front/.env

### Errores de APIs externas
- Verifica tu API key de SuperHero
- Las APIs de PokeAPI y Rick&Morty no requieren autenticación

