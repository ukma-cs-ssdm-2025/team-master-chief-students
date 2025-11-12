# ExpenseTracker Frontend

React-based single-page application (SPA) for the ExpenseTracker expense management system. Built with Vite, React Router, and Feature-Sliced Design (FSD) architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Testing](#testing)

## 🎯 Overview

The ExpenseTracker frontend is a modern React application that provides:

- **User Authentication**: Login and registration with JWT token management
- **Dashboard**: Personal expense overview with statistics and charts
- **Expense Management**: Add, edit, delete, and filter expenses
- **Team Management**: Create teams, manage members, and track team expenses
- **Analytics**: Interactive charts and visualizations (Recharts)
- **Export**: Download expense reports in CSV and PDF formats
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🛠️ Technology Stack

- **React**: 18.2.0
- **Vite**: 5.1.0 (build tool and dev server)
- **React Router**: 6.14.2 (routing)
- **TanStack Query**: 5.90.7 (data fetching and caching)
- **Axios**: 1.5.0 (HTTP client)
- **Tailwind CSS**: 3.4.18 (styling)
- **Recharts**: 3.3.0 (data visualization)
- **ESLint**: 9.36.0 (code linting)

## 🏗️ Architecture

The frontend follows **Feature-Sliced Design (FSD)** methodology:

```
src/
├── app/              # Application initialization, providers, routing
├── pages/            # Page components (route-level)
├── widgets/          # Complex UI blocks (composed features)
├── features/         # User interactions and business features
├── entities/         # Business entities (expense, user, team, etc.)
└── shared/           # Reusable code (UI components, utilities, config)
```

### FSD Layers

1. **app/**: Application setup, providers (router, store, theme, error boundary)
2. **pages/**: Top-level route components
3. **widgets/**: Composite UI blocks (header, sidebar, charts, stats)
4. **features/**: User-facing features (auth, expense management, team management)
5. **entities/**: Business entities with their models and UI
6. **shared/**: Shared utilities, UI components, API configuration

### Path Aliases

Configured in `vite.config.js` and `jsconfig.json`:

- `@/` → `./src/`
- `@app/` → `./src/app/`
- `@pages/` → `./src/pages/`
- `@widgets/` → `./src/widgets/`
- `@features/` → `./src/features/`
- `@entities/` → `./src/entities/`
- `@shared/` → `./src/shared/`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Backend API running (see [Backend README](../expensetracker/README.md))

### Local Development

1. **Navigate to frontend directory**:
```bash
cd expensetracker-frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables** (optional):
Create a `.env` file in the frontend root:
```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_TOKEN_REFRESH_BUFFER_MINUTES=2
VITE_TOKEN_CHECK_INTERVAL_MINUTES=5
VITE_TOAST_DURATION_MS=3000
VITE_DEBOUNCE_DELAY_MS=500
```

4. **Start development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_TOKEN_REFRESH_BUFFER_MINUTES` | Token refresh buffer time | `2` |
| `VITE_TOKEN_CHECK_INTERVAL_MINUTES` | Token check interval | `5` |
| `VITE_TOAST_DURATION_MS` | Toast notification duration | `3000` |
| `VITE_DEBOUNCE_DELAY_MS` | Input debounce delay | `500` |
| `VITE_QUERY_RETRY_COUNT` | Query retry attempts | `3` |
| `VITE_QUERY_STALE_TIME_MS` | Query stale time | `300000` (5 min) |

## ⚙️ Configuration

### API Configuration

API endpoints are configured in `src/shared/config/api.js`. The base URL is set via `VITE_API_BASE_URL` environment variable.

### CORS

Ensure the backend CORS configuration allows requests from the frontend origin (`http://localhost:5173` for development).

### Authentication

The application uses JWT tokens stored in localStorage:
- `accessToken`: Short-lived token for API requests
- `refreshToken`: Long-lived token for refreshing access token

Token refresh is handled automatically by the application.

## 📁 Project Structure

### Key Directories

**app/**
- `App.jsx`: Main application component with routing
- `providers/`: Context providers (router, store, theme, error boundary)
- `styles/`: Global styles

**pages/**
- `auth/`: Authentication page (login/register)
- `dashboard/`: User dashboard
- `teams/`: Team management pages
- `not-found/`: 404 page

**widgets/**
- `header/`: Application header
- `sidebar/`: Navigation sidebar
- `layout/`: Main layout wrapper
- `charts/`: Chart components (Recharts)
- `stats/`: Statistics cards
- `navigation/`: Navigation components

**features/**
- `auth/`: Authentication features (login, register, multi-account)
- `expense/`: Expense management (add, edit, delete, export, receipt)
- `team/`: Team management (create, members, expenses, analytics, export)
- `transaction/`: Transaction operations
- `dashboard/`: Dashboard features

**entities/**
- `expense/`: Expense entity (model, UI components)
- `user/`: User entity
- `team/`: Team entity
- `category/`: Category entity
- `stats/`: Statistics entity

**shared/**
- `api/`: Axios instance and interceptors
- `config/`: Configuration files
- `ui/`: Reusable UI components (Input, Modal, Toast, etc.)
- `lib/`: Utility functions (auth, formatting, validation)
- `hooks/`: Custom React hooks
- `constants/`: Application constants

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Code Style

The project follows:
- **Airbnb JavaScript Style Guide** (via ESLint)
- **Functional React components** (no class components)
- **Tailwind CSS** for styling (avoid inline styles)

### Development Workflow

1. Create feature branches: `feature/feature-name` or `bugfix/bug-name`
2. Follow FSD architecture when adding new code
3. Use path aliases for imports
4. Run linter before committing: `npm run lint`

### Hot Module Replacement (HMR)

Vite provides fast HMR. Changes to components will update instantly in the browser without full page reload.

## 🏗️ Building for Production

### Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

### Deployment

The `dist/` folder contains static files that can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server (Nginx, Apache)

### Environment Variables in Production

Set environment variables in your hosting platform's configuration. For Vite, all variables must be prefixed with `VITE_`.

## 🧪 Testing

### Linting

```bash
npm run lint
```

ESLint is configured with:
- React Hooks rules
- React Refresh plugin
- Airbnb-style guidelines

### Testing Strategy

(Add testing framework setup when implemented)

## 🔗 Integration with Backend

### API Communication

- All API calls go through `src/shared/api/axiosInstance.js`
- Axios interceptors handle:
  - Request: Adding JWT tokens
  - Response: Error handling
  - Token refresh: Automatic refresh on 401 errors

### API Endpoints

See [Backend API Documentation](../expensetracker/README.md#api-documentation) for available endpoints.

Main API endpoints used:
- `/api/v1/auth/*` - Authentication
- `/api/v1/expenses/*` - Expense management
- `/api/v1/teams/*` - Team management
- `/api/v1/stats/*` - Statistics
- `/api/v1/export/*` - Export functionality

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

### Custom Styles

Global styles are in:
- `src/index.css`: Base styles and Tailwind directives
- `src/app/styles/App.css`: Application-specific styles

### Responsive Design

Tailwind's responsive utilities are used throughout:
- `sm:`, `md:`, `lg:`, `xl:`, `2xl:` breakpoints

## 🐛 Troubleshooting

### CORS Errors

- Ensure backend CORS configuration includes frontend origin
- Check `VITE_API_BASE_URL` matches backend URL

### Token Issues

- Clear localStorage if experiencing authentication issues
- Check token expiration settings
- Verify backend JWT configuration

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Check Node.js version (requires 18+)

### Port Already in Use

Vite will automatically try the next available port if 5173 is in use.

## 📚 Related Documentation

- [Root README](../README.md) - Project overview
- [Backend README](../expensetracker/README.md) - Backend API documentation
- [Team Charter](../TeamCharter.md) - Team workflow and standards
- [Architecture Documentation](../docs/architecture/high-level-design.md)

## 📝 Code Quality Standards

- **Functional Components**: Use function components, not class components
- **Hooks**: Use React Hooks for state and side effects
- **Path Aliases**: Always use configured path aliases for imports
- **FSD Structure**: Follow Feature-Sliced Design principles
- **ESLint**: Fix all linting errors before committing
- **Tailwind**: Use Tailwind utility classes, avoid inline styles

## 🔄 State Management

- **TanStack Query**: Server state and caching
- **React Context**: Theme, authentication state
- **Local State**: `useState` for component-level state
- **LocalStorage**: Token storage and multi-account support

## 📄 License

[Add license information if applicable]
