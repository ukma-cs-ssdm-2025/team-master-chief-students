# Expense Filter Service

## Overview

SQL-level filtering service for expenses with cursor-based pagination. All filtering is performed at database level using JPA Criteria API. Server does NOT sort data - client handles sorting.

## API Endpoints

### Base URL
```
/api/v1/expenses/filter-service
```

### 1. Get Filtered Expenses
```
GET /items
```

**Query Parameters** (all optional):
- `categoryId` (Long) - Filter by category ID
- `category` (String) - Filter by category name
- `categoryMatch` (String) - "exact" or "like" (default: "exact")
- `fromDate` (LocalDate, ISO) - Start date
- `toDate` (LocalDate, ISO) - End date
- `minAmount` (BigDecimal) - Minimum amount
- `maxAmount` (BigDecimal) - Maximum amount
- `hasReceipt` (Boolean) - Filter by receipt presence
- `teamId` (Long) - Filter by team ID
- `search` (String) - Full-text search on description (ILIKE)
- `cursor` (String) - Base64 cursor for pagination
- `limit` (Integer) - Page size (1-100, default: 20)

**Response**:
```json
{
  "success": true,
  "message": "Filtered expenses retrieved successfully",
  "data": {
    "items": [...],
    "nextCursor": "BASE64...",
    "hasNext": true,
    "size": 20
  }
}
```

### 2. Get Statistics
```
GET /stats
```

**Query Parameters**: Same as `/items` (except `cursor` and `limit`)

**Response**:
```json
{
  "success": true,
  "message": "Expense statistics retrieved successfully",
  "data": {
    "totalAmount": 150.0,
    "count": 5,
    "byCategory": { "5": 120.0, "7": 30.0 },
    "byDate": [
      { "date": "2025-10-10", "totalAmount": 50.0, "count": 2 }
    ]
  }
}
```

## Key Features

- ✅ **SQL-level filtering** - All filters applied in database queries
- ✅ **Cursor-based pagination** - Efficient pagination with stable ordering
- ✅ **No server-side sorting** - Client handles all sorting
- ✅ **JWT authentication** - Secure access to user's own data
- ✅ **Performance optimized** - Database indexes for common filters
- ✅ **Statistics aggregation** - SQL-level aggregations (SUM, COUNT, GROUP BY)

## Database Indexes

The following indexes are created via Flyway migration `V2__add_filter_service_indexes.sql`:

- `idx_expenses_user_created_id` - Primary index for cursor pagination
- `idx_expenses_user_date` - Date range filtering
- `idx_expenses_user_category` - Category filtering
- `idx_expenses_user_team` - Team filtering
- `idx_expenses_user_amount` - Amount range filtering
- `idx_receipts_expense_id` - Receipt joins
- `idx_expenses_user_date_category` - Combined filters

## Postman Collection

Import `postman/filter-service.postman_collection.json` into Postman.

**Environment Variables**:
- `BASE_URL`: http://localhost:8080
- `JWT_TOKEN`: Your JWT access token
- `NEXT_CURSOR`: Cursor from previous response

## OpenAPI Documentation

Available at `/swagger-ui.html` when application is running.

