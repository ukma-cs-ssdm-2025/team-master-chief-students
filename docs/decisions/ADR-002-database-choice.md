# ADR-002: Database Choice for Expense Tracking Application
## Status
Accepted
## Context
The expense tracking application requires reliable storage of user data, including expense history, categories, reports, and statistics.  
A database is needed that supports:  
- Structured data (SQL tables for expenses, categories, users)  
- Scalability and fast access to aggregated statistics  
- Ability to integrate with cache and other services  

## Decision
Choose **PostgreSQL** as the primary database.  
- Use tables to store expenses, categories, users  
- Use indexes for fast reads and aggregations  
- Integrate Redis as cache for statistical queries  

## Consequences
- ✅ Reliable storage of structured data  
- ✅ Support for complex SQL queries and aggregations  
- ✅ Fast statistics reading through caching  
- ⚠️ Need to configure backups and scaling  
- ❌ Not optimal for storing large objects (Object Storage is used for this)  

## Implementation
Sprint 1: Create database schemas and tables  
Sprint 2-3: Integrate with backend and implement CRUD for expenses  
Sprint 4: Configure Redis cache for reports and statistics
