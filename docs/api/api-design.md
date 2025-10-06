# API Design Documentation

## Architecture Overview
- **Base URL**: `http://localhost:8080/v3/api-docs`
- **API Style**: RESTful
- **Authentication**: JWT Bearer tokens (planned)
- **Response Format**: JSON
- **Versioning Strategy**: URL path versioning (/v1, /v2)

## Resource Model
У проєкті реалізовано такі основні сутності:

- **User** — представляє користувача системи.  
  Кожен користувач має унікальний `id`, ім’я користувача, електронну адресу та статус активності.  
  Користувач може створювати витрати (expenses).

- **Expense** — описує окрему витрату користувача.  
  Витрата містить категорію, опис, суму та дату.  
  Кожна витрата належить одному користувачу.

- **Auth** — відповідає за автентифікацію користувачів (реєстрація, вхід у систему, оновлення токенів).

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

- **REST architecture** — API побудовано з дотриманням принципів REST. Кожен ресурс має свій endpoint та використовує стандартні HTTP-методи (`GET`, `POST`, `PUT`, `DELETE`).

- **Versioning** — використовується префікс `/api/v1` для полегшення майбутньої підтримки різних версій API.

- **Authentication** — реалізовано JWT (JSON Web Token) для безпечної авторизації користувачів.  
  Використовується пара токенів: `accessToken` і `refreshToken`.

- **Layered structure** — логіка поділена на рівні:  
  контролери (`controller`), сервіси (`service`), репозиторії (`repository`) для підвищення зручності підтримки коду.

- **Validation & Error handling** — всі запити проходять валідацію. У разі помилок API повертає уніфіковану структуру відповіді (`success`, `message`, `data`, `metadata`).

- **Consistent responses** — усі відповіді API мають єдиний формат через обгортку `ApiResponse`.

- **Filtering & Statistics** — реалізовано фільтрацію витрат за категорією, сумою та датою, а також статистику витрат користувача.


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