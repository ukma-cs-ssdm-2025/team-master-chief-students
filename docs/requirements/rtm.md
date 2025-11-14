| ID       | Type | Description                                                  | Linked Use Cases | Linked Tests | Notes |
|----------|------|--------------------------------------------------------------|------------------|--------------|-------|
| FR-001   | FR   | User authentication by login and password                | US-001           | T-001        |       |
| FR-002   | FR   | Adding a new expense                                      | US-002           | T-002        |       |
| FR-003   | FR   | Viewing expense list                                       | US-002           | T-003        |       |
| FR-004   | FR   | Searching expenses by keyword                              | US-004           | T-004        |       |
| FR-005   | FR   | Viewing expense statistics in the form of charts                 | US-003           | T-005        |       |
| FR-006   | FR   | Searching expenses by amount                                        | US-004           | T-006        |       |
| FR-007   | FR   | Exporting expenses to CSV format                                  | US-005           | T-007        |       |
| FR-008   | FR   | Exporting expenses to PDF format                                  | US-005           | T-008        |       |
| FR-009   | FR   | User management: adding, blocking, deletion   | US-007           | T-009        |       |
| FR-010   | FR   | Displaying a message when search results are empty | US-004           | T-010        |       |
| FR-011   | FR   | Updating chart when filter period changes              | US-003           | T-011        |       |
| PERF-001 | NFR  | p95 latency ≤ 300 ms under load of 500 rps                | US-003           | T-012        |       |
| PERF-002 | NFR  | Export generation time (CSV or PDF) ≤ 2 sec for list up to 10,000 expenses | US-005           | T-013        |       |
| REL-001  | NFR  | Uptime ≥ 99.5%                                               | –                | T-014        |       |
| REL-002  | NFR  | Recovery after failure ≤ 5 minutes                            | –                | T-015        |       |
| SEC-001  | NFR  | Passwords stored in hashed form                     | US-001, US-007   | T-016        |       |
| SEC-002  | NFR  | Use of HTTPS for all requests                          | US-001, US-007   | T-017        |       |
| SEC-003  | NFR  | Sessions with auto-termination after 15 min of inactivity            | US-001, US-007   | T-018        |       |
| USAB-001 | NFR  | Interface is responsive (mobile, tablets, desktops)          | US-001           | T-019        |       |
| USAB-002 | NFR  | Localization in Ukrainian and English                       | –                | T-020        |       |
| COMP-001 | NFR  | Support for modern browsers                                 | –                | T-021        |       |
| MAINT-001| NFR  | Code covered by tests ≥ 70%                                   | –                | T-022        |       |
| MAINT-002| NFR  | Use of CI/CD for automatic deployment                  | –                | T-023        |       |
| DATA-001 | NFR  | Export data conforms to UTF-8 format                     | US-005           | T-024        |       |
| DATA-002 | NFR  | All data operations are logged                              | US-002, US-007   | T-025        |       |
