# Test Plan

| № | Component/Function | Test Level | Type (Positive/Negative) | Expected Result / Acceptance Criterion | Owner |
|---|---|---|---|---|---|
| 1 | **User Authentication** | Unit | Positive | Function `authenticateUser()` returns JWT token for valid credentials (email + password). Token contains userId and expiry | Volodymyr |
| 2 | User Authentication | Integration | Negative | With incorrect password API returns status 401 and message "Invalid credentials". Token is not generated | Volodymyr |
| 3 | User Authentication | Unit | Negative | Validation function rejects email without "@" symbol or empty password. Returns validation error | Zakhar |
| 4 | **Viewing Expense Charts** | Unit | Positive | Function `generateChartData()` on frontend correctly aggregates expenses by categories for selected period. Sum of all categories = total expense sum | Zakhar |
| 5 | Viewing Expense Charts | Integration | Positive | Chart component receives data from API `/expenses`, processes it and renders chart without errors. All categories with non-zero values are displayed | Nikita |
| 6 | Viewing Expense Charts | Unit | Negative | With empty expense array function `generateChartData()` returns empty data and component displays placeholder "No data to display" | Nikita |
| 7 | **Adding Personal Expenses** | Unit | Positive | Function `addExpense()` creates record with required fields (amount, category, date) and returns ID of created record | Volodymyr |
| 8 | Adding Personal Expenses | Integration | Positive | POST `/expenses` with valid data creates record in DB and returns 201 Created with expense object | Volodymyr |
| 9 | Adding Personal Expenses | Unit | Negative | Validation function rejects negative amount or future date. Returns validation error | Zakhar |
| 10 | **Adding Team Expenses** (not ready) | Unit | Positive | Function `addTeamExpense()` should create record with fields teamId, amount, category, splitType and array of participants | Zakhar |
| 11 | Adding Team Expenses (not ready) | Integration | Positive | POST `/team-expenses` should create record and distribute debts among participants according to splitType (equal/percentage/custom) | Nikita |
| 12 | Adding Team Expenses (not ready) | Integration | Negative | API should return 400 if user is not a team member or distribution sum does not equal 100% | Nikita |
| 13 | **Performance: Dashboard Loading** | Performance | Non-functional | Dashboard loading time < 2 seconds with 1000+ expense records. Measured via Lighthouse | Volodymyr |
| 14 | **Security: SQL Injection** | Security | Non-functional | All API endpoints with parameters use prepared statements. Test with payload `'; DROP TABLE users--` does not affect DB | Zakhar |
| 15 | **Security: XSS Protection** | Security | Non-functional | When adding expense with name `<script>alert('xss')</script>` data is escaped and displayed as text without execution | Nikita |

---
