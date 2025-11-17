# API Design Documentation

## Architecture Overview
- **Base URL**: `http://localhost:8080/v3/api-docs`
- **API Style**: RESTful
- **Authentication**: JWT Bearer tokens
- **Response Format**: JSON
- **Versioning Strategy**: URL path versioning (/v1, /v2)

## Resource Model
The following main entities are implemented in the project:

- **User** — represents a system user.  
  Each user has a unique `id`, username, email address, and activity status.  
  Users can create expenses.

- **Expense** — describes a single user expense.  
  An expense contains category, description, amount, and date.  
  Each expense belongs to one user.

- **Auth** — handles user authentication (registration, login, token refresh).

---

### **Auth Resource**
- **Base Endpoint**: `/api/v1/auth`
- **Description**: Authentication and authorization
- **Attributes**:
    - `username` (string)
    - `email` (string)
    - `password` (string)
    - `accessToken` (string)
    - `refreshToken` (string)
- **Endpoints**:
    - `POST /api/v1/auth/register` – Register new user
        - **Request body**: `RegisterRequestDto`
    - `POST /api/v1/auth/login` – Login with credentials
        - **Request body**: `AuthRequestDto`
    - `POST /api/v1/auth/refresh` – Refresh tokens
        - **Request body**: `AuthResponseDto`
- **Responses**:
    - `ApiResponseAuthResponseDto`: includes `{ success, message, data: { accessToken, refreshToken } }`

---

### **Expenses Resource**
- **Endpoint**: `/api/v1/expenses`
- **Description**: Manage expenses
- **Attributes**:
    - `id` (integer, int64): Expense identifier
    - `category` (string): Expense category
    - `description` (string): Expense description
    - `amount` (number): Expense amount
    - `date` (string, date): Expense date
- **Endpoints**:
    - `GET /api/v1/expenses` – Get all expenses
    - `POST /api/v1/expenses` – Create new expense
    - `GET /api/v1/expenses/{id}` – Get expense by ID
    - `PUT /api/v1/expenses/{id}` – Update expense
    - `DELETE /api/v1/expenses/{id}` – Delete expense

---

### **Expense Filter Resource**
- **Endpoint**: `/api/v1/expenses/filter`
- **Description**: Filter and get statistics for expenses
- **Query Parameters**:
    - `category` (string, optional): Filter by category
    - `fromDate` (string, date, optional): Start date
    - `toDate` (string, date, optional): End date
    - `minAmount` (number, optional): Minimum amount
    - `maxAmount` (number, optional): Maximum amount
- **Endpoints**:
    - `GET /api/v1/expenses/filter` – Filter expenses
    - `GET /api/v1/expenses/filter/statistics` – Get statistics

### **Relationships**
- User **has many** Expenses
- Each Expense **belongs to one** User

## Design Decisions

- **REST architecture** — API is built following REST principles. Each resource has its own endpoint and uses standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).

- **Versioning** — prefix `/api/v1` is used to facilitate future support of different API versions.

- **Authentication** — JWT (JSON Web Token) is implemented for secure user authorization.  
  A pair of tokens is used: `accessToken` and `refreshToken`.

- **Layered structure** — logic is divided into layers:  
  controllers (`controller`), services (`service`), repositories (`repository`) to improve code maintainability.

- **Validation & Error handling** — all requests are validated. In case of errors, API returns a unified response structure (`success`, `message`, `data`, `metadata`).

- **Consistent responses** — all API responses have a unified format through the `ApiResponse` wrapper.

- **Filtering & Statistics** — expense filtering by category, amount, and date is implemented, as well as user expense statistics.


### Why Code-First?
We chose code-first approach because:
- Documentation stays synchronized with implementation
- Type safety through language features
- Faster development iterations
- No manual YAML maintenance

### Pagination Strategy
- Offset-based pagination for simplicity
- Default limit: 20 items
- Maximum limit: 100 items
- Returns metadata with total count and hasMore flag

### Error Handling
- Consistent error response structure
- Machine-readable error codes
- Human-friendly messages
- Validation errors include field details
