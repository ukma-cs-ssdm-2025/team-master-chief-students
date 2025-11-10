## Functional Requirements

| Code        | Type | Description                                                  |
| ---------- | --- | ------------------------------------------------------------ |
| **FR-001** | FR  | User authentication by login and password                |
| **FR-002** | FR  | Adding a new expense                                      |
| **FR-003** | FR  | Viewing expense list                                       |
| **FR-004** | FR  | Searching expenses by keyword                              |
| **FR-005** | FR  | Viewing expense statistics in the form of charts                 |
| **FR-006** | FR  | Searching expenses by amount                                        |
| **FR-007** | FR  | Exporting expenses to CSV format                                  |
| **FR-008** | FR  | Exporting expenses to PDF format                                  |
| **FR-009** | FR  | User management: adding, blocking, deletion   |
| **FR-010** | FR  | Displaying a message when search results are empty |
| **FR-011** | FR  | Updating chart when filter period changes              |

## Non-Functional Requirements

|Code|Type|Description|
|---|---|---|
|**PERF-001**|NFR|p95 latency ≤ 300 ms under load of 500 rps|
|**PERF-002**|NFR|Export generation time (CSV or PDF) ≤ 2 sec for list up to 10,000 expenses|
|**REL-001**|NFR|Uptime ≥ 99.5%|
|**REL-002**|NFR|Recovery after failure ≤ 5 minutes|
|**SEC-001**|NFR|Passwords stored in hashed form (e.g., bcrypt, salt ≥ 10)|
|**SEC-002**|NFR|Use of HTTPS for all requests|
|**SEC-003**|NFR|Sessions with automatic termination after 15 min of inactivity|
|**USAB-001**|NFR|Interface is responsive (support for mobile, tablets, desktops)|
|**USAB-002**|NFR|Localization in Ukrainian and English|
|**COMP-001**|NFR|Support for modern browsers (Chrome, Firefox, Edge, Safari, last 2 versions)|
|**MAINT-001**|NFR|Code covered by tests at least 70%|
|**MAINT-002**|NFR|Use of CI/CD for automatic deployment|
|**DATA-001**|NFR|Export data conforms to UTF-8 format|
|**DATA-002**|NFR|All data operations are logged (adding, blocking, deleting users, export)|
