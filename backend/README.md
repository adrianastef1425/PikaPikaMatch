# PikaPikaMatch Backend

Backend API for PikaPikaMatch voting application built with Java 21 and Spring Boot.

## Prerequisites

- Java 21 or higher
- Maven 3.8+
- MongoDB Atlas account (free tier available)
- SuperHero API key

## Setup

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `SUPERHERO_API_KEY`: Your SuperHero API key from https://superheroapi.com/
   - `PORT`: Server port (default: 8080)
   - `CORS_ORIGIN`: Allowed origins for CORS

## Build

```bash
mvn clean install
```

## Run

```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## API Documentation

Once the application is running, access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## Testing

Run all tests:
```bash
mvn test
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/pikapikamatch/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── service/         # Business logic
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── model/           # Entities and DTOs
│   │   │   ├── exception/       # Custom exceptions
│   │   │   └── util/            # Utility classes
│   │   └── resources/
│   │       └── application.yml  # Application configuration
│   └── test/                    # Unit tests
└── pom.xml                      # Maven dependencies
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB Atlas connection string | Yes |
| SUPERHERO_API_KEY | SuperHero API key | Yes |
| PORT | Server port | No (default: 8080) |
| CORS_ORIGIN | Allowed CORS origins | No (default: localhost) |
