# 📊 ExpenseTracker

ExpenseTracker is a lightweight SaaS expense management tool that enables users and businesses to record, categorize, and share their expenses. The web application is designed to simplify financial accounting and provide full control over personal and corporate expenses. The system addresses key challenges in modern financial management: from lost receipts to complex reporting.

The system is built with a focus on usability, scalability, and maintainability.

## 🏗️ System Architecture

ExpenseTracker consists of two main components:

- **Backend** ([`expensetracker/`](./expensetracker/)): Spring Boot REST API with PostgreSQL database
- **Frontend** ([`expensetracker-frontend/`](./expensetracker-frontend/)): React SPA built with Vite and Feature-Sliced Design (FSD)

For detailed information about each component, see:
- [Backend Documentation](./expensetracker/README.md)
- [Frontend Documentation](./expensetracker-frontend/README.md)

## 👥 User Roles

**User:**
- Add personal expenses
- View personal reports and statistics
- Configure personal categories

**Manager/Administrator:**
- Full access to team expenses
- Create and manage projects
- Configure categories and budgets
- Manage users and permissions
- Create and distribute reports
- Configure system parameters

## 🛠️ Core Features

**Expense Management:**
- Add and edit expense records
- Categorize expenses
- Attach files and receipts to records
- Search and filter expenses by various criteria

**Dashboards:**
- Personal dashboard with user expense overview
- Team dashboard for managers with overall statistics
- Customizable widgets for displaying key metrics

**Analytics & Visualization:**
- Interactive expense charts by category and period
- Trend analysis of expenses
- Expense analysis by projects and employees

**Reporting:**
- Export reports in various formats (CSV, PDF)
- Customizable report templates
- Automatic periodic reports

**Team Management:**
- Create and manage teams
- Assign team members with different roles
- Track team expenses
- Team-level analytics and exports

## ⚡ Non-Functional Requirements (NFR)

- Intuitive interface and smooth user interaction
- System scalability to grow with business needs
- Clean code and architecture for easy development and maintenance

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Java 17+ (for local backend development)
- Node.js 18+ and npm (for local frontend development)

### Running with Docker Compose

1. **Clone the repository:**
```bash
git clone https://github.com/ukma-cs-ssdm-2025/team-master-chief-students.git
cd team-master-chief-students
```

2. **Create environment configuration file:**
```bash
cd expensetracker
cp env.example .env.docker
# Edit .env.docker with your configuration
```

3. **Start the services:**
```bash
docker-compose --env-file .env.docker up --build
```

This will start:
- PostgreSQL database on port `5432`
- PgAdmin on port `5050`
- Backend API on port `8080` (configurable via `SERVER_PORT`)
- Backend Actuator on port `8081` (configurable via `ACTUATOR_PORT`)

### Running Locally (Development)

For local development setup, see:
- [Backend Setup Instructions](./expensetracker/README.md#local-development)
- [Frontend Setup Instructions](./expensetracker-frontend/README.md#local-development)

## 🔗 Documentation Links

- [Requirements, RTM, User Stories](./docs/requirements)
- [Architecture Decisions (ADR)](./docs/decisions)
- [Architecture Documentation (UML)](./docs/architecture)
- [API Documentation](./docs/api)
- [Team Charter](./TeamCharter.md)
- [Workflow Guide](./WORKFLOW.md)
- [Swagger UI](https://ukma-cs-ssdm-2025.github.io/team-master-chief-students/swagger-ui/)

## 🧪 Testing

- Backend tests: See [Backend README](./expensetracker/README.md#testing)
- Frontend tests: See [Frontend README](./expensetracker-frontend/README.md#testing)
- Test coverage: Minimum 70% code coverage requirement

## 📦 Technology Stack

**Backend:**
- Java 17
- Spring Boot 3.5.6
- PostgreSQL 15+
- Flyway (database migrations)
- JWT (authentication)
- Log4j2 (logging)
- Prometheus (monitoring)

**Frontend:**
- React 18
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Recharts (visualization)

**Infrastructure:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)

## 🔒 Security

- JWT-based authentication with access and refresh tokens
- Password hashing using BCrypt
- HTTPS support (production)
- Role-based access control (RBAC)
- CORS configuration for frontend integration

* [Requirements, RTM, US](./docs/requirements)
* [ADR](./docs/decisions)
* [Architecture(UML)](./docs/architecture)
* [Team Charter](./TeamCharter.md)
* [Swagger UI](https://ukma-cs-ssdm-2025.github.io/team-master-chief-students/swagger-ui/)

---

[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=20486319)
[![CI](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/actions/workflows/ci.yml/badge.svg)](https://github.com/ukma-cs-ssdm-2025/team-master-chief-students/actions/workflows/ci.yml)
