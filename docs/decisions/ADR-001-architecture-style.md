# ADR-001: Use Three-Tier Architecture for Expense Tracking Application
## Status
Accepted
## Context
The expense tracking application includes user expense entry, business logic processing (calculation, categorization, reconciliation), and data storage with the ability to generate reports and statistics.  
Clear separation of presentation, business, and infrastructure layers is necessary for scalability, testing, and simplified maintenance.
## Decision
Implement three-tier architecture:
- **Presentation Layer**: React SPA / mobile client (expense entry, statistics viewing)
- **Business Layer**: API Gateway + business logic modules (Expense, Approval, Reporting, Integration)
- **Data / Infra Layer**: PostgreSQL, Redis Cache, Message Broker, Object Storage  
Interaction between layers occurs through REST / GraphQL, RPC calls, and SQL.
## Consequences
- ✅ Clear separation of responsibilities between UI, business logic, and data
- ✅ Easier to test individual modules
- ✅ Support for business logic reuse
- ✅ Ability to scale individual layers independently
- ⚠️ Additional costs for integration between layers
- ⚠️ Potential increase in latency due to network calls between components
- ❌ Less flexibility compared to event-driven / microservices architecture
## Implementation
Sprint 1: Design layers and contracts between them  
Sprint 2-3: Implement business layer (Expense, Approval, Reporting, Integration) and database integration  
Sprint 4: Integrate client layer and configure caching / message queues
