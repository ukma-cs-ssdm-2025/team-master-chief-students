# Quality Attributes — Expense Tracker API

---

## 1. Reliability

**Requirements:**  
- `REL-001`: Uptime ≥ 99.5%  
- `REL-002`: Recovery ≤ 5 min 
- System must operate stably and withstand failures without data loss.

**Solution:**  
- Reliable PostgreSQL database is used.  
- All expense operations are idempotent — repeated requests do not create duplicates.  
- Server returns informative error codes (`400`, `404`, `500`).  
- Exception handling is provided for all API requests.  

**Verification:**  
- Manual testing of repeated requests.  
- Verification that on error the system does not "crash" and shows a message to the user.
- Load testing (JMeter)
- Prometheus metrics

---

## 2. Maintainability

**Requirements:**  
- `MAINT-001`: test coverage ≥70%  
- `MAINT-002`: CI/CD  
- Code and API must be understandable, easily modifiable, and documented.

**Solution:**  
- Documentation is automatically generated in OpenAPI format (`openapi-generated.yaml`).  
- Separate layers of logic exist: controllers, services, repositories.  
- Unified REST API style is followed (`/api/v1/...`).  
- Code contains brief comments and has understandable method names. 
- Automatic deployment through GitHub Actions (build -> test -> deploy).

**Verification:**  
- Verification that Swagger documentation is automatically updated.  
- New team member can quickly understand the project structure.  

---

## 3. Scalability

**Requirements:**  
- System must easily support an increase in the number of users or data.

**Solution:**  
- Architecture is divided into components: Frontend, Backend, Database.  
- API can be extended with new routes without changes to existing ones.  
- Possibility to add caching for frequent requests in the future

**Verification:**  
- Adding a new API module without changing existing functions.  
- Testing operation with a large number of records in the database.  

---

## 4. Security

**Requirements:**  
- `SEC-001`, `SEC-002`, `SEC-003`: Password hashing, HTTPS, Sessions with auto-termination after 15 min of inactivity.
- User data must be protected during storage and transmission.  

**Solution:**  
- JWT authentication. Authorization through JWT tokens.  
- Passwords are hashed before saving to the database.     
- Refresh endpoint `/api/v1/auth/refresh` for token refresh. 
- Data access is restricted by roles (USER, MANAGER, ADMIN). 
- HTTPS is used for all requests.  


**Verification:**  
- Testing login/logout for users and managers, admins.  
- Attempt to access without token — expected denial.     

---

## 5. Usability

**Requirement:** 
- `USAB-001`: responsiveness  
- `USAB-002`: localization uk/en  
- API must be intuitive, consistent, and convenient for users and developers.

**Solution:**  
- Clear REST endpoint structure (`/api/v1/expenses`, `/api/v1/users`).  
- Consistent request and response formats (JSON).
- Consistent HTTP codes (`200`, `400`, `404`, `401`, `500`).  
- Swagger UI (README.md) for viewing and testing API.  
- Localized messages (Ukrainian and English).  

**Verification:**  
- Testing API through Swagger UI.  
- Evaluation of route names and message clarity.