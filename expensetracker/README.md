# ExpenseTracker Backend

Spring Boot REST API backend for the ExpenseTracker application. This service provides authentication, expense management, team collaboration, reporting, and export functionality.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Database](#database)
- [Deployment](#deployment)

## 🎯 Overview

The ExpenseTracker backend is a RESTful API built with Spring Boot 3.5.6 and Java 17. It provides:

- **Authentication & Authorization**: JWT-based authentication with role-based access control (USER, MANAGER, ADMIN)
- **Expense Management**: CRUD operations for expenses with categorization and filtering
- **Team Management**: Team creation, member management, and team expense tracking
- **Analytics**: Statistics and time-series data for expenses
- **Export**: CSV and PDF export functionality for expenses
- **File Management**: Receipt upload and retrieval

## 🛠️ Technology Stack

- **Java**: 17
- **Framework**: Spring Boot 3.5.6
- **Database**: PostgreSQL 15+
- **ORM**: Spring Data JPA with Hibernate
- **Migrations**: Flyway
- **Security**: Spring Security with JWT (jjwt 0.12.3)
- **Logging**: Log4j2
- **Documentation**: SpringDoc OpenAPI (Swagger)
- **Monitoring**: Spring Boot Actuator with Prometheus
- **PDF Generation**: iText7
- **Build Tool**: Maven
- **Testing**: JUnit 5, Mockito, Testcontainers, REST Assured, AssertJ

## 🏗️ Architecture

The backend follows a **layered architecture** pattern:

```
┌─────────────────────────────────────┐
│   Presentation Layer (Controllers)  │
│   - REST API endpoints              │
│   - Request/Response DTOs           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Application Layer (Services)      │
│   - Business logic                 │
│   - Transaction management         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain Layer (Entities)           │
│   - Domain models                  │
│   - Business rules                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure Layer              │
│   - Repositories (JPA)             │
│   - Database (PostgreSQL)          │
│   - File Storage                   │
└─────────────────────────────────────┘
```

### Key Components

- **Controllers**: Handle HTTP requests and responses (`/api/v1/*`)
- **Services**: Implement business logic and orchestrate operations
- **Repositories**: Data access layer using Spring Data JPA
- **Entities**: JPA entities representing database tables
- **DTOs**: Data Transfer Objects for API communication
- **Security**: JWT authentication filter and security configuration
- **Config**: Application configuration (CORS, security, properties)

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 15+ (or Docker for containerized setup)
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository** (if not already done):
```bash
cd expensetracker
```

2. **Set up PostgreSQL database**:
   - Install PostgreSQL locally, or
   - Use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15`

3. **Configure environment variables**:
   Create a `.env` file or set environment variables:
```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/expense_tracker
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# JWT
JWT_ACCESS_SECRET=your-access-secret-key-min-256-bits
JWT_REFRESH_SECRET=your-refresh-secret-key-min-256-bits
JWT_ACCESS_EXPIRATION_MS=900000  # 15 minutes
JWT_REFRESH_EXPIRATION_MS=2592000000  # 30 days

# Server
SERVER_PORT=8080
ACTUATOR_PORT=8081

# File Upload
FILE_UPLOAD_DIR=uploads
```

4. **Build the project**:
```bash
./mvnw clean install
```

5. **Run the application**:
```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

### Docker Development

1. **Create `.env.docker` file**:
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=expense_tracker
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin
SERVER_PORT=8080
ACTUATOR_PORT=8081
JWT_ACCESS_SECRET=your-access-secret-key-min-256-bits
JWT_REFRESH_SECRET=your-refresh-secret-key-min-256-bits
JWT_ACCESS_EXPIRATION_MS=900000
JWT_REFRESH_EXPIRATION_MS=2592000000
```

2. **Start services**:
```bash
docker-compose --env-file .env.docker up --build
```

This starts:
- PostgreSQL on port `5432`
- PgAdmin on port `5050`
- Backend API on port `8080`
- Actuator on port `8081`

## ⚙️ Configuration

### Application Properties

Configuration is managed through `application.yml` and environment variables. Key settings:

- **Database**: Connection URL, credentials, and JPA settings
- **JWT**: Secret keys and token expiration times
- **File Upload**: Maximum file size (10MB), upload directory
- **Logging**: Log levels and patterns (Log4j2)
- **Actuator**: Health and Prometheus endpoints

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/expense_tracker` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `postgres` |
| `JWT_ACCESS_SECRET` | JWT access token secret | (required) |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | (required) |
| `JWT_ACCESS_EXPIRATION_MS` | Access token expiration (ms) | `900000` (15 min) |
| `JWT_REFRESH_EXPIRATION_MS` | Refresh token expiration (ms) | `2592000000` (30 days) |
| `SERVER_PORT` | Application server port | `8080` |
| `ACTUATOR_PORT` | Actuator server port | `8081` |
| `FILE_UPLOAD_DIR` | File upload directory | `uploads` |

### CORS Configuration

CORS is configured to allow requests from `http://localhost:5173` (default Vite dev server). Update `SecurityConfig.java` for production frontend URLs.

## 📚 API Documentation

### Swagger UI

Once the application is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

### API Base URL

All API endpoints are prefixed with `/api/v1`

### Main Endpoints

- **Authentication**: `/api/v1/auth/*` (register, login, refresh)
- **Users**: `/api/v1/users/*` (profile, management)
- **Expenses**: `/api/v1/expenses/*` (CRUD, filtering, statistics)
- **Categories**: `/api/v1/categories/*` (CRUD)
- **Teams**: `/api/v1/teams/*` (CRUD, members, expenses, analytics)
- **Statistics**: `/api/v1/stats/*` (time-series, aggregations)
- **Export**: `/api/v1/export/*` (CSV, PDF)

For detailed API documentation, see:
- [API Design Documentation](../docs/api/api-design.md)
- [Swagger UI](https://ukma-cs-ssdm-2025.github.io/team-master-chief-students/swagger-ui/)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=ExpenseServiceTest

# Run tests with coverage
./mvnw test jacoco:report
```

### Test Structure

- **Unit Tests**: Service and repository layer tests with mocks
- **Integration Tests**: Full Spring Boot context with Testcontainers
- **Reliability Tests**: Error handling, boundary conditions, external failures

### Test Coverage

Minimum coverage requirement: **70%**

Coverage reports are generated in `target/site/jacoco/index.html`

### Testcontainers

Integration tests use Testcontainers to spin up PostgreSQL containers. Ensure Docker is running for integration tests.

### Reliability Tests

See [Reliability Tests README](./src/test/java/com/example/expensetracker/reliability/README.md) for details on:
- Error handling tests
- External failure tests
- Boundary condition tests

## 🗄️ Database

### Schema Management

Database schema is managed using **Flyway** migrations located in `src/main/resources/db/migration/`

### Running Migrations

Migrations run automatically on application startup. To manually run:

```bash
./mvnw flyway:migrate
```

### Database Access

When using Docker Compose, access PgAdmin at `http://localhost:5050`:
- Email: (from `.env.docker` `PGADMIN_DEFAULT_EMAIL`)
- Password: (from `.env.docker` `PGADMIN_DEFAULT_PASSWORD`)

### Connection Details

- **Host**: `localhost` (or `postgres` in Docker network)
- **Port**: `5432`
- **Database**: `expense_tracker` (or from `POSTGRES_DB`)
- **Username/Password**: From environment variables

## 🚢 Deployment

### Docker Build

```bash
docker build -t expense-tracker-backend .
```

### Docker Run

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/expense_tracker \
  -e JWT_ACCESS_SECRET=your-secret \
  -e JWT_REFRESH_SECRET=your-secret \
  expense-tracker-backend
```

### Production Considerations

- Use strong JWT secrets (minimum 256 bits)
- Configure HTTPS
- Set up proper database connection pooling
- Configure log rotation
- Set up monitoring (Prometheus/Grafana)
- Use environment-specific profiles
- Configure CORS for production frontend URL

## 📊 Monitoring

### Actuator Endpoints

- **Health**: `http://localhost:8081/actuator/health`
- **Prometheus**: `http://localhost:8081/actuator/prometheus`

### Logging

Logs are written to:
- Console (with color formatting)
- File: `logs/expense-tracker.log` (rolling)
- Error file: `logs/expense-tracker-error.log`

Log levels can be configured in `application.yml` or `log4j2.xml`

## 🔒 Security

- **Authentication**: JWT tokens (access + refresh)
- **Password Hashing**: BCrypt with salt rounds
- **Authorization**: Role-based access control (RBAC)
- **CORS**: Configured for frontend origin
- **Input Validation**: Bean validation on DTOs
- **SQL Injection**: Prevented by JPA/Hibernate

## 📝 Code Quality

### Checkstyle

Code style is enforced using Google Java Style Guide:

```bash
./mvnw checkstyle:check
```

### Build

```bash
# Clean and build
./mvnw clean package

# Skip tests
./mvnw clean package -DskipTests
```

## 🔗 Related Documentation

- [Root README](../README.md) - Project overview
- [Frontend README](../expensetracker-frontend/README.md) - Frontend documentation
- [Architecture Documentation](../docs/architecture/high-level-design.md)
- [API Design](../docs/api/api-design.md)
- [Architecture Decisions](../docs/decisions/)

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check connection URL and credentials
- Verify network connectivity (Docker networking)

### Port Already in Use

- Change `SERVER_PORT` environment variable
- Or stop the process using the port

### JWT Errors

- Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set
- Secrets should be at least 256 bits long
- Use the same secrets across restarts for token validation

### File Upload Issues

- Ensure `FILE_UPLOAD_DIR` directory exists and is writable
- Check file size limits (default: 10MB)

## 📄 License

[Add license information if applicable]

