| Requirement ID | Type |                       Description                           |                        Components                    |
|----------------|------|-------------------------------------------------------------|------------------------------------------------------|
| FR-001         | FR   | User authentication by login and password               | Frontend, Backend (Auth Service), Database, Security |
| FR-002         | FR   | Adding a new expense                                     | Frontend, Backend (Expense Service), Database        |
| FR-003         | FR   | Viewing expense list                                      | Frontend, Backend, Database                          |
| FR-004         | FR   | Searching expenses by keyword                             | Frontend, Backend, Database                          |
| FR-005         | FR   | Viewing expense statistics in the form of charts                | Frontend, Backend (Analytics Service), Cache (Redis) |
| FR-006         | FR   | Searching expenses by amount                                       | Frontend, Backend, Database                          |
| FR-007         | FR   | Exporting expenses to CSV format                                 | Frontend, Backend, Database                          |
| FR-008         | FR   | Exporting expenses to PDF format                                 | Frontend, Backend, Database                          |
| FR-009         | FR   | User management: adding, blocking, deletion  | Frontend, Backend (User Service), Database, Security |
| FR-010         | FR   | Displaying a message when search results are empty| Frontend                                             |
| FR-011         | FR   | Updating chart when filter period changes             | Frontend, Backend (Analytics Service), Cache         |
| PERF-001       | NFR  | p95 latency ≤ 300 ms under load of 500 rps               | Backend, Cache, Deployment/Infra                     |
| PERF-002       | NFR  | Export generation time ≤ 2 sec for list up to 10,000 expenses  | Backend, Database                                    |
| REL-001        | NFR  | Uptime ≥ 99.5%                                              | Deployment/Infra (Docker, Nginx, CI/CD)              |
| REL-002        | NFR  | Recovery after failure ≤ 5 min                               | Deployment/Infra, Database (Backups), Cache          |
| SEC-001        | NFR  | Passwords stored in hashed form                    | Backend (Auth Service), Database                     |
| SEC-002        | NFR  | Use of HTTPS for all requests                         | Deployment/Infra (Nginx, TLS)                        |
| SEC-003        | NFR  | Sessions with auto-termination after 15 min of inactivity           | Backend, Cache (Redis sessions)                      |
| USAB-001       | NFR  | Interface is responsive                                        | Frontend                                             |
| USAB-002       | NFR  | Localization in Ukrainian and English                      | Frontend                                             |
| COMP-001       | NFR  | Support for modern browsers                                | Frontend                                             |
| MAINT-001      | NFR  | Code covered by tests ≥ 70%                                  | Backend, Frontend                                    |
| MAINT-002      | NFR  | Use of CI/CD for automatic deployment                 | Deployment/Infra                                     |
| DATA-001       | NFR  | Export data in UTF-8 format                               | Backend (Export Module)                              |
| DATA-002       | NFR  | All data operations are logged                             | Backend, Database                                    |
