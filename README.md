# PikaPikaMatch 🎮

Aplicación web de votación de personajes que permite a los usuarios votar entre personajes aleatorios de diferentes universos (Pokémon, Rick and Morty, Superhéroes) y ver estadísticas de votación en tiempo real.

![Java](https://img.shields.io/badge/Java-21-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-green) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Guía de Instalación Completa](#-guía-de-instalación-completa)
  - [Paso 0: Clonar el Repositorio](#paso-0-clonar-el-repositorio)
  - [Paso 1: Configurar MongoDB Atlas](#paso-1-configurar-mongodb-atlas)
  - [Paso 2: Obtener API Key de SuperHero](#paso-2-obtener-api-key-de-superhero)
  - [Paso 3: Configurar y Ejecutar Backend](#paso-3-configurar-y-ejecutar-backend)
  - [Paso 4: Configurar y Ejecutar Frontend](#paso-4-configurar-y-ejecutar-frontend)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Flujos de la Aplicación](#-flujos-de-la-aplicación)
- [Scripts Disponibles](#-scripts-disponibles)
- [Troubleshooting](#-troubleshooting)

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
- **MongoDB Atlas** - Base de datos NoSQL en la nube (gratis)

### APIs Externas
- **PokeAPI** - Datos de Pokémon (gratis, sin autenticación)
- **Rick and Morty API** - Datos de personajes (gratis, sin autenticación)
- **SuperHero API** - Datos de superhéroes (gratis, requiere registro)

## 📦 Requisitos Previos

Antes de comenzar, necesitas tener instalado lo siguiente en tu computadora:

### 1. Java Development Kit (JDK) 21
**¿Cómo verificar si lo tienes?**
```bash
java -version
```
Deberías ver algo como: `java version "21.0.x"`

**Si no lo tienes:**
- **Windows/Mac/Linux**: [Descargar Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)
- **Mac (con Homebrew)**: `brew install openjdk@21`
- **Linux (Ubuntu/Debian)**: `sudo apt install openjdk-21-jdk`

### 2. Apache Maven 3.8+
**¿Cómo verificar si lo tienes?**
```bash
mvn -version
```
Deberías ver algo como: `Apache Maven 3.8.x`

**Si no lo tienes:**
- **Windows/Mac/Linux**: [Descargar Maven](https://maven.apache.org/download.cgi)
- **Mac (con Homebrew)**: `brew install maven`
- **Linux (Ubuntu/Debian)**: `sudo apt install maven`

### 3. Node.js 18+ y npm
**¿Cómo verificar si lo tienes?**
```bash
node -version
npm -version
```
Deberías ver versiones 18 o superiores.

**Si no lo tienes:**
- **Todos los sistemas**: [Descargar Node.js](https://nodejs.org/) (incluye npm)
- **Mac (con Homebrew)**: `brew install node`
- **Linux (Ubuntu/Debian)**: `sudo apt install nodejs npm`

### 4. Git
**¿Cómo verificar si lo tienes?**
```bash
git --version
```

**Si no lo tienes:**
- **Todos los sistemas**: [Descargar Git](https://git-scm.com/downloads)
- **Mac (con Homebrew)**: `brew install git`
- **Linux (Ubuntu/Debian)**: `sudo apt install git`

## 🔧 Guía de Instalación Completa

### Paso 0: Clonar el Repositorio

1. Abre tu terminal o línea de comandos

2. Navega a la carpeta donde quieres guardar el proyecto:
```bash
cd ~/Documents  # o la carpeta que prefieras
```

3. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/pikapikamatch.git
```

4. Entra al directorio del proyecto:
```bash
cd pikapikamatch
```

### Paso 1: Configurar MongoDB Atlas

MongoDB Atlas es una base de datos en la nube gratuita. Sigue estos pasos:

#### 1.1 Crear cuenta
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Regístrate con tu email o cuenta de Google
3. Completa el formulario de registro

#### 1.2 Crear un cluster (base de datos)
1. Después de iniciar sesión, haz clic en **"Build a Database"**
2. Selecciona **"M0 FREE"** (el plan gratuito)
3. Elige un proveedor de nube (AWS, Google Cloud o Azure) - cualquiera funciona
4. Selecciona una región cercana a tu ubicación
5. Dale un nombre a tu cluster (o deja el predeterminado)
6. Haz clic en **"Create"**
7. Espera 1-3 minutos mientras se crea el cluster

#### 1.3 Configurar acceso de red
1. En el menú lateral, ve a **"Network Access"**
2. Haz clic en **"Add IP Address"**
3. Haz clic en **"Allow Access from Anywhere"** (para desarrollo)
4. Haz clic en **"Confirm"**

#### 1.4 Crear usuario de base de datos
1. En el menú lateral, ve a **"Database Access"**
2. Haz clic en **"Add New Database User"**
3. Selecciona **"Password"** como método de autenticación
4. Ingresa un nombre de usuario (ejemplo: `pikapikauser`)
5. Haz clic en **"Autogenerate Secure Password"** y **copia la contraseña** (¡guárdala!)
6. En "Database User Privileges", selecciona **"Read and write to any database"**
7. Haz clic en **"Add User"**

#### 1.5 Obtener connection string
1. Ve a **"Database"** en el menú lateral
2. Haz clic en **"Connect"** en tu cluster
3. Selecciona **"Connect your application"**
4. Copia el connection string (se ve así):
   ```
   mongodb+srv://pikapikauser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Importante**: Reemplaza `<password>` con la contraseña que copiaste antes
6. Agrega el nombre de la base de datos después del `/`:
   ```
   mongodb+srv://pikapikauser:tupassword@cluster0.xxxxx.mongodb.net/PikaPikaMatch?retryWrites=true&w=majority
   ```

### Paso 2: Obtener API Key de SuperHero

1. Ve a [SuperHero API](https://superheroapi.com/)
2. Haz clic en **"Get your API key"**
3. Inicia sesión con Facebook (es el único método disponible)
4. Copia tu API key (se ve así: `1234567890abcdef`)

### Paso 3: Configurar y Ejecutar Backend

#### 3.1 Navegar al directorio del backend
```bash
cd backend
```

#### 3.2 Configurar las variables en application.yml

Abre el archivo `src/main/resources/application.yml` con tu editor de texto favorito y reemplaza los valores:

**Busca estas líneas y reemplázalas:**

```yaml
spring:
  data:
    mongodb:
      # REEMPLAZA ESTA LÍNEA con tu connection string de MongoDB Atlas - MONGODB_URI
      uri: mongodb+srv://pikapikauser:tupassword@cluster0.xxxxx.mongodb.net/PikaPikaMatch?retryWrites=true&w=majority

# Más abajo en el archivo, busca:
external:
  apis:
    superhero:
      # REEMPLAZA ESTA LÍNEA con tu API key de SuperHero - SUPERHERO_API_KEY
      api-key: 1234567890abcdef
```

**Ejemplo completo de cómo debería verse:**

```yaml
spring:
  application:
    name: pikapikamatch-backend
  
  data:
    mongodb:
      uri: mongodb+srv://miusuario:mipassword@cluster0.abc123.mongodb.net/PikaPikaMatch?retryWrites=true&w=majority
      auto-index-creation: true

# ... (otras configuraciones)

external:
  apis:
    superhero:
      base-url: https://superheroapi.com/api
      api-key: 7bccb599656ee06afaacdfffa3332a49
      timeout: 5000
```

**Guarda el archivo.**

#### 3.3 Instalar dependencias y compilar
```bash
mvn clean install
```
⏱️ Esto puede tardar 2-5 minutos la primera vez.

#### 3.4 Ejecutar el backend
```bash
mvn spring-boot:run
```

✅ **Si todo está bien, verás:**
```
Started PikaPikaMatchApplication in X.XXX seconds
```

🌐 **El backend estará corriendo en:** `http://localhost:8080`

📚 **Documentación API (Swagger):** `http://localhost:8080/swagger-ui.html`

**⚠️ Deja esta terminal abierta y ejecutándose.**

### Paso 4: Configurar y Ejecutar Frontend

#### 4.1 Abrir una NUEVA terminal
No cierres la terminal del backend. Abre una nueva terminal/ventana.

#### 4.2 Navegar al directorio del frontend
```bash
# Desde la raíz del proyecto:
cd front

# Si estás en el directorio backend:
cd ../front
```

#### 4.3 Crear archivo de configuración
```bash
# En Mac/Linux:
cp .env.example .env

# En Windows (PowerShell):
copy .env.example .env

# En Windows (CMD):
copy .env.example .env
```

#### 4.4 Editar el archivo .env
Abre el archivo `.env` y verifica que tenga:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_DEBUG_API=true
```

**Guarda el archivo.**

#### 4.5 Instalar dependencias
```bash
npm install
```
⏱️ Esto puede tardar 2-5 minutos la primera vez.

#### 4.6 Ejecutar el frontend
```bash
npm run dev
```

✅ **Si todo está bien, verás:**
```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

🌐 **El frontend estará corriendo en:** `http://localhost:5173`

### 🎉 ¡Listo! Abre tu navegador

1. Abre tu navegador favorito (Chrome, Firefox, Safari, Edge)
2. Ve a: `http://localhost:5173`
3. Deberías ver la pantalla de inicio de PikaPikaMatch
4. ¡Comienza a votar por tus personajes favoritos!

### 📝 Resumen de URLs

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación web principal |
| **Backend API** | http://localhost:8080/api | API REST |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | Documentación interactiva de la API |

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
│   ├── .env                         # Variables de entorno (crear este archivo)
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
│   │   ├── hooks/                   # Custom hooks
│   │   ├── context/                 # Context API
│   │   ├── types/                   # Tipos TypeScript
│   │   └── utils/                   # Utilidades y constantes
│   ├── .env                         # Variables de entorno (crear este archivo)
│   └── package.json                 # Dependencias npm
│
└── README.md                        # Este archivo
```

## 🔄 Flujos de la Aplicación

### 1. Flujo de Inicio
```
Usuario accede → SplashScreen (2 segundos) → VotingView
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
1. Usuario navega a DexView (botón en el header)
   ↓
2. Frontend solicita estadísticas al backend
   ↓
3. Backend consulta MongoDB y calcula:
   - Community Favorites (más likes)
   - Most Controversial (más dislikes)
   - Recently Evaluated (últimos votados)
   ↓
4. Frontend muestra estadísticas con animaciones
   ↓
5. Layout responsive: sidebar en desktop, vertical en mobile
```

## 📊 Diagramas de Solución

### Arquitectura General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
│                    (Navegador Web)                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ SplashScreen │  │ VotingView   │  │  DexView     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Services (Axios HTTP Client)              │          │
│  │  - characterService  - voteService  - statsService│          │
│  └──────────────────────────────────────────────────┘          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API (JSON)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND (Spring Boot)                            │
│  ┌──────────────────────────────────────────────────┐          │
│  │              Controllers                          │          │
│  │  - CharacterController  - VoteController          │          │
│  │  - StatsController                                │          │
│  └────────────┬─────────────────────────────────────┘          │
│               │                                                  │
│  ┌────────────▼─────────────────────────────────────┐          │
│  │              Services                             │          │
│  │  - CharacterService  - VoteService                │          │
│  │  - StatsService  - RetryService                   │          │
│  └────────────┬─────────────────────────────────────┘          │
│               │                                                  │
│  ┌────────────▼─────────────────────────────────────┐          │
│  │           Repositories                            │          │
│  │  - CharacterRepository  - VoteRepository          │          │
│  └────────────┬─────────────────────────────────────┘          │
└───────────────┼──────────────────────────────────────────────────┘
                │                          │
                │                          │ HTTP
                ▼                          ▼
┌───────────────────────────┐   ┌──────────────────────────┐
│   MongoDB Atlas           │   │   APIs Externas          │
│   (Base de Datos)         │   │  - PokeAPI               │
│                           │   │  - Rick & Morty API      │
│  Collections:             │   │  - SuperHero API         │
│  - characters             │   └──────────────────────────┘
│  - votes                  │
└───────────────────────────┘
```

### Diagrama de Flujo: Votación Completa

```
                    ┌─────────────────┐
                    │  Usuario en     │
                    │  VotingView     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ useEffect se    │
                    │ ejecuta al      │
                    │ montar          │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ ¿Hay personaje  │
                    │ cargado?        │
                    └────┬───────┬────┘
                         │ NO    │ SÍ
                         ▼       │
              ┌──────────────┐  │
              │ GET /api/    │  │
              │ characters/  │  │
              │ random       │  │
              └──────┬───────┘  │
                     │          │
                     ▼          │
          ┌──────────────────┐ │
          │ Backend selecciona│ │
          │ API aleatoria     │ │
          │ (Pokemon/Rick/    │ │
          │ SuperHero)        │ │
          └──────┬───────────┘ │
                 │             │
                 ▼             │
          ┌──────────────────┐ │
          │ Consulta API     │ │
          │ externa con      │ │
          │ retry logic      │ │
          └──────┬───────────┘ │
                 │             │
                 ▼             │
          ┌──────────────────┐ │
          │ Retorna          │ │
          │ CharacterDTO     │ │
          └──────┬───────────┘ │
                 │             │
                 ▼             ▼
          ┌──────────────────────┐
          │ Frontend muestra     │
          │ personaje con        │
          │ animaciones          │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ Usuario hace clic    │
          │ en Like o Dislike    │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ POST /api/votes      │
          │ {characterId,        │
          │  voteType: "like"}   │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ Backend busca o crea │
          │ personaje en MongoDB │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ Incrementa contador  │
          │ (likes o dislikes)   │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ Guarda voto en       │
          │ colección votes      │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ Retorna VoteResponse │
          │ con datos actualizados│
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ Frontend muestra     │
          │ animación de         │
          │ confirmación         │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ Espera animación     │
          │ (800ms - 1000ms)     │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ Solicita nuevo       │
          │ personaje aleatorio  │
          │ (vuelve al inicio)   │
          └──────────────────────┘
```

### Diagrama de Flujo: Consulta de Estadísticas

```
                    ┌─────────────────┐
                    │  Usuario navega │
                    │  a DexView      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ GET /api/stats  │
                    └────────┬────────┘
                             │
                             ▼
          ┌──────────────────────────────────┐
          │ Backend consulta MongoDB         │
          │ con agregaciones                 │
          └────────┬─────────────────────────┘
                   │
                   ├─────────────────────────┐
                   │                         │
                   ▼                         ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │ Query 1:             │   │ Query 2:             │
    │ Top 10 personajes    │   │ Top 10 personajes    │
    │ ordenados por        │   │ ordenados por        │
    │ totalLikes DESC      │   │ totalDislikes DESC   │
    └──────────┬───────────┘   └──────────┬───────────┘
               │                          │
               │                          │
               └────────┬─────────────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Query 3:             │
             │ Últimos 10 votos     │
             │ ordenados por        │
             │ timestamp DESC       │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Calcula porcentajes  │
             │ para cada personaje  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Retorna StatsDTO     │
             │ {favorites,          │
             │  controversial,      │
             │  recentlyEvaluated}  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Frontend renderiza:  │
             │ - Community Favorites│
             │ - Most Controversial │
             │ - Recently Evaluated │
             └──────────────────────┘
```

### Diagrama de Secuencia: Actualización de Votos por Nombre

```
Usuario          Frontend         Backend API      CharacterService    MongoDB
  │                  │                  │                  │              │
  │  PATCH /api/     │                  │                  │              │
  │  characters/     │                  │                  │              │
  │  Pikachu/like    │                  │                  │              │
  │  {amount: 5}     │                  │                  │              │
  ├─────────────────>│                  │                  │              │
  │                  │                  │                  │              │
  │                  │  PATCH /api/     │                  │              │
  │                  │  characters/     │                  │              │
  │                  │  Pikachu/like    │                  │              │
  │                  ├─────────────────>│                  │              │
  │                  │                  │                  │              │
  │                  │                  │ addLikesByName   │              │
  │                  │                  │ ("Pikachu", 5)  │              │
  │                  │                  ├─────────────────>│              │
  │                  │                  │                  │              │
  │                  │                  │                  │ findByName   │
  │                  │                  │                  │ IgnoreCase   │
  │                  │                  │                  ├─────────────>│
  │                  │                  │                  │              │
  │                  │                  │                  │ Character    │
  │                  │                  │                  │<─────────────┤
  │                  │                  │                  │              │
  │                  │                  │                  │ Update:      │
  │                  │                  │                  │ likes += 5   │
  │                  │                  │                  │ totalVotes   │
  │                  │                  │                  │ recalculated │
  │                  │                  │                  │              │
  │                  │                  │                  │ save()       │
  │                  │                  │                  ├─────────────>│
  │                  │                  │                  │              │
  │                  │                  │                  │ Updated      │
  │                  │                  │                  │ Character    │
  │                  │                  │                  │<─────────────┤
  │                  │                  │                  │              │
  │                  │                  │ CharacterStatsDTO│              │
  │                  │                  │<─────────────────┤              │
  │                  │                  │                  │              │
  │                  │ Response         │                  │              │
  │                  │ {success: true,  │                  │              │
  │                  │  data: stats}    │                  │              │
  │                  │<─────────────────┤                  │              │
  │                  │                  │                  │              │
  │  Estadísticas    │                  │                  │              │
  │  actualizadas    │                  │                  │              │
  │<─────────────────┤                  │                  │              │
  │                  │                  │                  │              │
```

### Modelo de Datos

```
┌─────────────────────────────────────┐
│         Character                    │
├─────────────────────────────────────┤
│ _id: ObjectId                        │
│ externalId: String                   │
│ name: String                         │
│ source: String (pokemon/rick/hero)   │
│ imageUrl: String                     │
│ description: String                  │
│ totalLikes: Integer                  │
│ totalDislikes: Integer               │
│ totalVotes: Integer                  │
│ createdAt: DateTime                  │
│ updatedAt: DateTime                  │
└─────────────────────────────────────┘
              │
              │ 1:N
              │
              ▼
┌─────────────────────────────────────┐
│            Vote                      │
├─────────────────────────────────────┤
│ _id: ObjectId                        │
│ character: ObjectId (ref)            │
│ voteType: String (like/dislike)      │
│ timestamp: DateTime                  │
└─────────────────────────────────────┘
```

### Flujo de Retry Logic (APIs Externas)

```
                ┌─────────────────┐
                │ Solicitud de    │
                │ personaje       │
                │ aleatorio       │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Shuffle APIs    │
                │ [Pokemon, Rick, │
                │  SuperHero]     │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Intenta API #1  │
                └────┬───────┬────┘
                     │       │
              Éxito  │       │ Fallo
                     │       │
                     ▼       ▼
          ┌──────────┐  ┌─────────────┐
          │ Retorna  │  │ Retry con   │
          │ personaje│  │ backoff     │
          └──────────┘  │ (1 segundo) │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ Intento 2/3 │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ ¿Éxito?     │
                        └──┬───────┬──┘
                    Sí     │       │ No
                           │       │
                           ▼       ▼
                    ┌──────────┐  ┌─────────────┐
                    │ Retorna  │  │ Intenta     │
                    │ personaje│  │ API #2      │
                    └──────────┘  └──────┬──────┘
                                         │
                                  (Repite proceso)
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │ Si todas    │
                                  │ fallan:     │
                                  │ Error 503   │
                                  └─────────────┘
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

## 🐛 Troubleshooting

### ❌ Error: "java: command not found"
**Problema:** Java no está instalado o no está en el PATH.

**Solución:**
1. Instala Java 21 (ver [Requisitos Previos](#-requisitos-previos))
2. Verifica la instalación: `java -version`

### ❌ Error: "mvn: command not found"
**Problema:** Maven no está instalado o no está en el PATH.

**Solución:**
1. Instala Maven (ver [Requisitos Previos](#-requisitos-previos))
2. Verifica la instalación: `mvn -version`

### ❌ Error: "MongoTimeoutException" o "Connection refused"
**Problema:** No se puede conectar a MongoDB Atlas.

**Solución:**
1. Verifica que tu `MONGODB_URI` en `.env` sea correcto
2. Asegúrate de haber reemplazado `<password>` con tu contraseña real
3. Verifica que hayas configurado "Network Access" en MongoDB Atlas
4. Verifica tu conexión a internet

### ❌ Error: "Port 8080 is already in use"
**Problema:** Otro programa está usando el puerto 8080.

**Solución:**
1. Cierra cualquier otra aplicación que use el puerto 8080
2. O cambia el puerto en `backend/.env`: `PORT=8081`
3. Si cambias el puerto, actualiza también `front/.env`: `VITE_API_BASE_URL=http://localhost:8081/api`

### ❌ Error: "CORS policy" en el navegador
**Problema:** El backend no permite peticiones desde el frontend.

**Solución:**
1. Verifica que `CORS_ORIGIN` en `backend/.env` incluya `http://localhost:5173`
2. Reinicia el backend después de cambiar el `.env`

### ❌ Frontend muestra "Failed to fetch character"
**Problema:** El backend no está corriendo o hay un error en la API.

**Solución:**
1. Verifica que el backend esté corriendo en `http://localhost:8080`
2. Abre `http://localhost:8080/swagger-ui.html` para verificar que el backend funciona
3. Verifica tu `SUPERHERO_API_KEY` en `backend/.env`
4. Revisa los logs del backend en la terminal

### ❌ Las imágenes no cargan
**Problema:** Las APIs externas pueden estar lentas o bloqueadas.

**Solución:**
1. Verifica tu conexión a internet
2. Espera unos segundos, las imágenes pueden tardar en cargar
3. Las APIs de PokeAPI y Rick&Morty no requieren autenticación
4. Verifica tu API key de SuperHero

### 🆘 ¿Necesitas más ayuda?

1. Revisa los logs del backend en la terminal donde ejecutaste `mvn spring-boot:run`
2. Revisa los logs del frontend en la consola del navegador (F12 → Console)
3. Revisa los logs de la aplicación en `backend/logs/`
4. Consulta la documentación de la API en `http://localhost:8080/swagger-ui.html`

## 🎨 Características

- ✅ Votación entre personajes de múltiples universos
- ✅ Animaciones fluidas con Framer Motion
- ✅ Diseño responsive (mobile y desktop)
- ✅ Estadísticas en tiempo real
- ✅ Integración con 3 APIs externas
- ✅ Persistencia de datos en MongoDB
- ✅ Documentación API con Swagger
- ✅ Modo oscuro/claro
- ✅ Optimizaciones de rendimiento (code splitting, lazy loading)
- ✅ Skeleton loaders para mejor UX

## 📚 Documentación Adicional

- [Backend README](./backend/README.md) - Documentación detallada del backend
- [Frontend README](./front/README.md) - Documentación detallada del frontend
- [API Documentation](http://localhost:8080/swagger-ui.html) - Swagger UI (requiere backend ejecutándose)

---

Desarrollado con ❤️ para la comunidad de fans de personajes
